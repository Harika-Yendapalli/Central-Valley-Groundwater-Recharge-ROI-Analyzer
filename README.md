# Central Valley Groundwater Recharge & ROI Analyzer

A full-stack web app that helps farmers in California's Central Valley decide whether building a **groundwater recharge basin** on or near their property is worth the investment. Users select their land on a map, the app looks up the soil type from the USDA soil database, and a calculator estimates construction costs, **ROI** and **payback period**.

Built as a project for **CSCI 130**.

---

## The Problem

Groundwater levels in the Central Valley have been falling for decades due to drought, climate change and heavy agricultural demand. Recharge basins capture surplus water in wet years and let it soak back into the aquifer, but farmers need a quick way to estimate whether a basin would pay off before hiring engineers.

## Features

- **Interactive map:** draw a rectangle around your land on a Leaflet map centered on the Central Valley
- **Automatic soil lookup:** the backend sends the selected area to the **USDA Soil Data Access** service and returns the main soil types, sorted by acreage
- **Recharge basin calculator** with inputs for:
  - Basin size and design (area, side lengths, levee height)
  - Soil type and infiltration rate (sand through clay)
  - Water availability (wet-year frequency and duration)
  - Development costs (land, earthwork, pipeline, engineering contingency)
  - Pipe sizing based on required flow rate
  - Financing (interest rate, loan term) and water costs and value
- **Financial results:** total project cost, net recharge, ROI, NPV, benefit/cost ratio and payback period
- **Charts** of the cost breakdown and cost vs. 10-year benefits
- **Form validation** with clear error messages
- **Responsive design** for desktop and mobile

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, React Router, React Leaflet, Leaflet Draw, Chart.js, CSS |
| Backend | Node.js, Express, Axios, xml2js, dotenv, CORS |
| Data | USDA NRCS Soil Data Access API, OpenStreetMap tiles |
| Database (in progress) | MongoDB / Mongoose schema for saving reports |

---

## Project Structure

```
├── Backend/
│   ├── Models/Report.js      # Mongoose schema for saved reports
│   └── server.js             # Express API: /api/analyze → USDA soil lookup
├── public/
│   └── index.html
├── src/
│   ├── components/           # Calculator, Results, FindROI (map), About sections
│   ├── pages/                # Homepage, CalculatorPage
│   ├── App.js                # Routes: "/" and "/calculator"
│   └── index.js
├── index.html, script.js, styles.css   # Earlier plain HTML/JS version
└── package.json
```

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Harika-Yendapalli/Central-Valley-Groundwater-Recharge-ROI-Analyzer.git
   cd Central-Valley-Groundwater-Recharge-ROI-Analyzer
   npm install
   ```

2. Start the backend (runs on port 5000):
   ```bash
   node Backend/server.js
   ```

3. In a second terminal, start the React app:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000).

Optional: create `Backend/.env` to set `PORT` or a database connection string. This file is ignored by git.

---

## How to Use

1. On the home page, scroll to **Find Your ROI** and describe your project.
2. Draw a box around your property on the map to get its soil types.
3. Open the **Calculator** page and enter basin size, soil, costs and water details.
4. Click **Calculate ROI** to see total cost, ROI and payback period.

---

## Future Improvements

- Save and reload reports with MongoDB
- Pipeline calculator targeting 5 ft/sec flow velocity
- Pipe cost and soil-texture recharge-rate lookup tables
- Support for sloping land and multiple basins
- Historical water supply data and water district incentives

---

## Disclaimer

This calculator gives **preliminary estimates only**. Recharge basins should be professionally designed to reduce the risk of basin failure, and farmers should check with their water district about recharge water availability and cost.
# Central Valley Groundwater Recharge & ROI Analyzer

A full-stack web app that helps farmers in California's Central Valley decide whether building a **groundwater recharge basin** on or near their property is worth the investment. Users select their land on a map, the app looks up the soil type from the USDA soil database, and a calculator estimates construction costs, **ROI** and **payback period**.

Built as a project for **CSCI 130**.

---

## The Problem

Groundwater levels in the Central Valley have been falling for decades due to drought, climate change and heavy agricultural demand. Recharge basins capture surplus water in wet years and let it soak back into the aquifer, but farmers need a quick way to estimate whether a basin would pay off before hiring engineers.

## Features

- **Interactive map:** draw a rectangle around your land on a Leaflet map centered on the Central Valley
- **Automatic soil lookup:** the backend sends the selected area to the **USDA Soil Data Access** service and returns the main soil types, sorted by acreage
- **Recharge basin calculator** with inputs for:
  - Basin size and design (area, side lengths, levee height)
  - Soil type and infiltration rate (sand through clay)
  - Water availability (wet-year frequency and duration)
  - Development costs (land, earthwork, pipeline, engineering contingency)
  - Pipe sizing based on required flow rate
  - Financing (interest rate, loan term) and water costs and value
- **Financial results:** total project cost, annual recharge volume, ROI, payback period and long-term savings
- **Form validation** with clear error messages, plus a sample-data option for quick testing
- **Responsive design** for desktop and mobile

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, React Router, React Leaflet, Leaflet Draw, CSS |
| Backend | Node.js, Express, Axios, xml2js, dotenv, CORS |
| Data | USDA NRCS Soil Data Access API, OpenStreetMap tiles |
| Database (in progress) | MongoDB / Mongoose schema for saving reports |

---

## Project Structure

```
├── Backend/
│   ├── Models/Report.js      # Mongoose schema for saved reports
│   └── server.js             # Express API: /api/analyze → USDA soil lookup
├── public/
│   └── index.html
├── src/
│   ├── components/           # Calculator, Results, FindROI (map), About sections
│   ├── pages/                # Homepage, CalculatorPage
│   ├── App.js                # Routes: "/" and "/calculator"
│   └── index.js
├── index.html, script.js, styles.css   # Earlier plain HTML/JS version
└── package.json
```

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Harika-Yendapalli/Central-Valley-Groundwater-Recharge-ROI-Analyzer.git
   cd Central-Valley-Groundwater-Recharge-ROI-Analyzer
   npm install
   ```

2. Start the backend (runs on port 5000):
   ```bash
   node Backend/server.js
   ```

3. In a second terminal, start the React app:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000).

Optional: create `Backend/.env` to set `PORT` or a database connection string. This file is ignored by git.

---

## How to Use

1. Open the app and go to **Find ROI**.
2. Draw a box around your property on the map to get its soil types.
3. Open the **Calculator** and enter basin size, costs and water details, or load the sample data.
4. Click **Calculate ROI** to see total cost, ROI and payback period.

---

## Future Improvements

- Save and reload reports with MongoDB
- Pipeline calculator targeting 5 ft/sec flow velocity
- Pipe cost and soil-texture recharge-rate lookup tables
- Support for sloping land and multiple basins
- Historical water supply data and water district incentives

---

## Disclaimer

This calculator gives **preliminary estimates only**. Recharge basins should be professionally designed to reduce the risk of basin failure, and farmers should check with their water district about recharge water availability and cost.
