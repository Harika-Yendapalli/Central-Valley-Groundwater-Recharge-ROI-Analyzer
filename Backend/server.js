const express = require("express");
const axios = require("axios");
const cors = require("cors");
const xml2js = require("xml2js");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- HELPER 1: Parse the USDA XML Report ---
function parseAndSortSoils(reportJSON) {
  try {
    const tbody = reportJSON?.section?.table?.[0]?.tbody?.[0];
    if (!tbody?.tr?.length) return null;

    const rows = tbody.tr;
    const soils = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.$?.class === "mapunit") {
        const cell = row.td?.[0];
        const text = cell?.para?.[0]?._ || "";
        const symbol = text.split("--")[0]?.trim();
        const desc = text.split("--")[1]?.trim() || "";

        // Map unit acres is usually in td[1]
        const acresText = row.td?.[1]?.para?.[0]?._ || "";
        const acres = parseFloat(acresText.replace(/,/g, "")) || 0;

        soils.push({ symbol, desc, acres });
      }
    }

    if (!soils.length) return null;

    // Sort by acreage descending (largest area first)
    soils.sort((a, b) => b.acres - a.acres);

    return soils;
  } catch (err) {
    console.warn("Failed to parse soils:", err.message);
    return null;
  }
}

// --- HELPER 2: Calculate Suitability Score ---
function calculateMockScore(soilDesc) {
  let score = 85; // Start baseline
  const lowerDesc = soilDesc.toLowerCase();

  // Simple keyword logic for scoring
  if (lowerDesc.includes("clay")) score -= 20;      // Poor drainage
  if (lowerDesc.includes("rock")) score -= 15;      // Hard to dig
  if (lowerDesc.includes("sand")) score -= 5;       // Too fast (sometimes)
  if (lowerDesc.includes("loam")) score += 10;      // Good balance
  if (lowerDesc.includes("silt")) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

// --- HELPER 3: Financial & ROI Calculator (NEW) ---
function calculateFinancials(acres, soilType) {
  // 1. Constants (Estimates for Central Valley, CA)
  const EXCAVATION_COST_PER_ACRE = 15000; // Digging & grading
  const INFRASTRUCTURE_COST = 50000;      // Pumps, pipes, electrical
  const WATER_PRICE_PER_AF = 450;         // Value of 1 Acre-Foot of water
  
  // 2. Determine Infiltration Rate based on Soil Keywords
  let infiltrationRate = 0.2; // ft/day (default: slow/clay)
  const soil = soilType.toLowerCase();
  
  if (soil.includes("sand") || soil.includes("gravel")) infiltrationRate = 1.5; 
  else if (soil.includes("loam")) infiltrationRate = 0.8;
  else if (soil.includes("silt")) infiltrationRate = 0.4;

  // 3. Calculate Costs
  const constructionCost = (acres * EXCAVATION_COST_PER_ACRE) + INFRASTRUCTURE_COST;

  // 4. Calculate Benefits (Annual)
  // Assuming basin is active 120 days/year (flood season)
  const daysActive = 120;
  // Total Water = Acres * Rate * Days
  const waterRechargedAnnually = acres * infiltrationRate * daysActive; 
  const annualBenefit = waterRechargedAnnually * WATER_PRICE_PER_AF;

  // 5. Calculate ROI (10 Year Horizon)
  const totalBenefit10Years = annualBenefit * 10;
  const netProfit = totalBenefit10Years - constructionCost;
  const roiPercentage = constructionCost > 0 ? ((netProfit / constructionCost) * 100).toFixed(1) : 0;
  const paybackYears = annualBenefit > 0 ? (constructionCost / annualBenefit).toFixed(1) : "> 20";

  return {
    constructionCost: constructionCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    annualWaterRecharge: waterRechargedAnnually.toFixed(1) + " Acre-Feet",
    annualValue: annualBenefit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    tenYearROI: roiPercentage + "%",
    paybackPeriod: paybackYears + " Years"
  };
}

// --- MAIN ROUTES ---
app.get("/", (_req, res) => res.send("Soil Analysis API is Running"));

app.post("/api/analyze", async (req, res) => {
  try {
    // 1. GET INPUTS
    const { bounds, problemStatement } = req.body;

    if (!bounds) {
      return res.status(400).json({ error: "No boundaries provided" });
    }

    // Leaflet sends: { _southWest: { lat, lng }, _northEast: { lat, lng } }
    const minLat = bounds._southWest.lat;
    const minLng = bounds._southWest.lng;
    const maxLat = bounds._northEast.lat;
    const maxLng = bounds._northEast.lng;

    // 2. CONSTRUCT GEOJSON RING FOR USDA
    // Order: [minLng, minLat] -> [minLng, maxLat] -> [maxLng, maxLat] -> [maxLng, minLat] -> [minLng, minLat]
    const ring = [
      [minLng, minLat],
      [minLng, maxLat],
      [maxLng, maxLat],
      [maxLng, minLat],
      [minLng, minLat] 
    ];

    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "User Selection" },
          geometry: { type: "Polygon", coordinates: [ring] }
        }
      ]
    };

    console.log("Analyzing area...");
    const url = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest";

    // 3. USDA STEP A: CREATE AOI
    const aoiResp = await axios.post(url, {
        SERVICE: "aoi", REQUEST: "create", AOICOORDS: JSON.stringify(geojson)
    });
    const AOIID = aoiResp.data?.id;
    if (!AOIID) return res.status(502).json({ error: "AOI creation failed" });

    // 4. USDA STEP B: GET CATALOG
    const aoiCatalog = await axios.post(url, {
        SERVICE: "report", REQUEST: "getcatalog", AOIID
    });
    const folders = aoiCatalog.data?.tables?.[0]?.folders;
    if (!folders) return res.status(502).json({ error: "Catalog fetch failed" });

    // Find "Component Legend" report
    let selected = null;
    for (const folder of folders) {
      const found = folder.reports.find((r) => r.reportname.toLowerCase().includes("component legend"));
      if (found) { selected = found; break; }
    }
    if (!selected) selected = folders[0].reports[0]; 
    const REPORTID = selected.reportid;

    // 5. USDA STEP C: GET REPORT METADATA
    const aoiReportData = await axios.post(url, {
        SERVICE: "report", REQUEST: "getreportdata", REPORTID, AOIID, FORMAT: "short"
    });
    const REPORTDATA = aoiReportData.data;

    // 6. USDA STEP D: RUN REPORT
    const aoiReport = await axios.post(url, {
        SERVICE: "report", REQUEST: "getreport", SHORTFORMDATA: JSON.stringify(REPORTDATA)
    });
    const REPORTXML = aoiReport.data;

    // 7. PARSE XML TO JSON
    const REPORTJSON = await xml2js.parseStringPromise(REPORTXML);
    
    // 8. EXTRACT SOILS
    const soils = parseAndSortSoils(REPORTJSON);
    if (!soils || soils.length === 0) {
        return res.status(404).json({ error: "No soil data found for this location." });
    }

    const dominantSoil = soils[0];

    // --- NEW: RUN FINANCIAL & ROI CALCULATIONS ---
    const financials = calculateFinancials(dominantSoil.acres, dominantSoil.desc);
    const score = calculateMockScore(dominantSoil.desc);

    // 9. RETURN FINAL JSON TO FRONTEND
    const responseData = {
      results: {
        summary: {
          soilType: dominantSoil.desc,
          totalAcres: dominantSoil.acres,
          averagePH: "6.5 (Est)", 
          averageClay: "Unknown"
        },
        financials: financials, // Contains Cost, ROI, Payback
        score: score,
        recommendations: [`Based on soil type: ${dominantSoil.desc}`]
      },
      soilDetails: soils
    };

    console.log("Analysis complete. Sending results.");
    return res.status(200).json(responseData);

  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
