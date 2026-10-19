import React from 'react';
// Import chart components and Chart.js core elements
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register the elements you'll use
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Results = ({ results }) => {
  // Add a stronger check for results object itself
  if (!results || typeof results !== 'object') {
     console.error("Results component received invalid results prop:", results);
     return <div className="results"><p className="error-message">Could not display results due to an internal error.</p></div>;
   }

  // --- Helper Functions (More Robust) ---
  const formatCurrency = (value) => {
    // Convert to number, check if it's a valid finite number
    const numValue = Number(value);
    if (!isFinite(numValue)) {
      // Return a default/error indicator or 0 if value is invalid (NaN, Infinity, undefined)
      return '$--'; // Or '$0', 'N/A', etc.
    }
    return '$' + numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatNumber = (value, decimals = 2) => {
    // Convert to number, check if it's a valid finite number
    const numValue = Number(value);
    if (!isFinite(numValue)) {
      return '--'; // Or '0', 'N/A', etc.
    }
    // Ensure decimals is a non-negative integer
    const validDecimals = Math.max(0, Math.floor(decimals));
    return numValue.toFixed(validDecimals);
  };

  // --- Chart Data Preparation ---
  // Ensure data passed to charts is also numeric and handle potential errors
   const getChartSafeData = (keys) => {
      return keys.map(key => {
          const value = Number(results[key]);
          return isFinite(value) ? value : 0; // Default to 0 if data is invalid
      });
   };

  // Data for Cost Breakdown Doughnut Chart
  const costBreakdownKeys = ['landCost', 'earthworkCost', 'pipelineCost', /* 'inletCost', 'fenceCost', */ 'contingencyCost']; // Removed optional costs
  const costBreakdownDataValues = getChartSafeData(costBreakdownKeys);
  const costBreakdownData = {
    labels: ['Land Cost', 'Earthwork', 'Pipeline', /*'Inlets', 'Fencing', */ 'Contingency'], // Match keys
    datasets: [
      {
        label: 'Cost Breakdown',
        data: costBreakdownDataValues,
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',  // Blue
          'rgba(255, 159, 64, 0.7)',  // Orange
          'rgba(75, 192, 192, 0.7)',  // Teal
        //   'rgba(255, 99, 132, 0.7)',  // Red (for Inlet)
        //   'rgba(153, 102, 255, 0.7)', // Purple (for Fencing)
          'rgba(201, 203, 207, 0.7)'  // Grey (for Contingency)
        ],
        borderColor: [
           'rgba(54, 162, 235, 1)',
           'rgba(255, 159, 64, 1)',
           'rgba(75, 192, 192, 1)',
        //    'rgba(255, 99, 132, 1)',
        //    'rgba(153, 102, 255, 1)',
           'rgba(201, 203, 207, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = { /* ... keep options as is ... */ };

  // Data for Cost vs Benefit Bar Chart
  const costBenefitKeys = ['totalCost', 'totalBenefits10Years'];
  const costBenefitDataValues = getChartSafeData(costBenefitKeys);
  const costBenefitData = {
    labels: ['Total Estimated Cost', 'Total Benefits (10 years)'],
    datasets: [
      {
        label: 'USD ($)',
        data: costBenefitDataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)', // Red for Cost
          'rgba(75, 192, 192, 0.7)', // Teal for Benefit
        ],
         borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
         ],
         borderWidth: 1,
      },
    ],
  };

   const barOptions = { /* ... keep options as is ... */ };


  // --- JSX Output ---
  return (
    <div className="results" id="results-section">
      <h2>Preliminary Cost Estimate Results</h2>

       {/* --- Charts Section --- */}
       <div className="results-section results-charts">
         <h3>Visualizations</h3>
         <div className="charts-grid">
           <div className="chart-container">
              {Number(results.totalCost) > 0 ? ( // Check validity before rendering
                <Doughnut options={doughnutOptions} data={costBreakdownData} />
              ) : (
                <p className="no-chart-data">Cost data not available for chart.</p>
              )}
           </div>
           <div className="chart-container">
             {(Number(results.totalCost) > 0 || Number(results.totalBenefits10Years) > 0) ? (
                <Bar options={barOptions} data={costBenefitData} />
             ) : (
                <p className="no-chart-data">Cost/Benefit data not available for chart.</p>
             )}
           </div>
         </div>
       </div>

      {/* --- Detailed Results (Using Grouping & Robust Formatting) --- */}
      {/* Wrap potentially problematic values with the format functions */}
      <div className="results-group">
        <h3>Basin Configuration</h3>
        <div className="results-grid">
           <div className="result-card">
             <h4>Basin Area</h4>
             <p className="result-value">{formatNumber(results.basinArea)} acres</p>
           </div>
           <div className="result-card">
             <h4>Area (sq miles)</h4>
             <p className="result-value">{formatNumber(results.areaSquareMiles, 3)} sq miles</p>
           </div>
           <div className="result-card">
             <h4>Perimeter</h4>
             <p className="result-value">{formatNumber(results.perimeter)} ft</p>
           </div>
           <div className="result-card">
             <h4>Wetted Area</h4>
             <p className="result-value">{formatNumber(results.wettedArea)} acres ({formatNumber(results.wettedAreaPercent, 1)}%)</p>
           </div>
        </div>
      </div>

       <div className="results-group">
         <h3>Earthwork Calculations</h3>
         <div className="results-grid">
             <div className="result-card">
               <h4>Total Earthwork</h4>
               <p className="result-value">{formatNumber(results.totalEarthwork)} cu yds</p>
             </div>
             <div className="result-card">
               <h4>Earthwork Cost</h4>
               <p className="result-value">{formatCurrency(results.earthworkCost)}</p>
             </div>
         </div>
       </div>

        <div className="results-group">
          <h3>Cost Breakdown</h3>
          <div className="results-grid">
              <div className="result-card">
                 <h4>Land Cost</h4>
                 <p className="result-value">{formatCurrency(results.landCost)}</p>
               </div>
               <div className="result-card">
                 <h4>Earthwork Cost</h4>
                 <p className="result-value">{formatCurrency(results.earthworkCost)}</p>
               </div>
               <div className="result-card">
                 <h4>Pipeline Cost</h4>
                 <p className="result-value">{formatCurrency(results.pipelineCost)}</p>
               </div>
               {/* Removed Inlet/Fence Cost cards */}
               <div className="result-card">
                 <h4>Subtotal</h4>
                 <p className="result-value">{formatCurrency(results.subtotal)}</p>
               </div>
               <div className="result-card">
                 <h4>Contingency</h4>
                 <p className="result-value">{formatCurrency(results.contingencyCost)}</p>
               </div>
               <div className="result-card">
                 <h4>Total Cost Estimate</h4>
                 <p className="result-value">{formatCurrency(results.totalCost)}</p>
               </div>
          </div>
        </div>

       <div className="results-group">
         <h3>Annualized Metrics</h3>
         <div className="results-grid">
            <div className="result-card">
             <h4>Annual Capital Payment</h4>
             <p className="result-value">{formatCurrency(results.annualCapitalPayment)}/year</p>
           </div>
           <div className="result-card">
             <h4>Avg Infiltration Rate</h4> {/* Changed label */}
             <p className="result-value">{formatNumber(results.averageRechargeDepth, 2)} ft/day</p>
           </div>
           <div className="result-card">
             <h4>Net Recharge</h4>
             <p className="result-value">{formatNumber(results.netRecharge)} ac ft/yr</p>
           </div>
           <div className="result-card">
             <h4>Capital Cost per Acre-Foot</h4>
             <p className="result-value">{formatCurrency(results.annualizedCapitalCostPerAcreFoot)}/af</p>
           </div>
           <div className="result-card">
             <h4>Total Cost per Acre-Foot</h4>
             <p className="result-value">{formatCurrency(results.totalAnnualizedCostPerAcreFoot)}/af</p>
           </div>
           <div className="result-card">
             <h4>Net Benefit Per Acre-Foot</h4> {/* Clarified label */}
             <p className="result-value">{formatCurrency(results.netBenefit)}/af</p>
           </div>
         </div>
       </div>

        <div className="results-group">
          <h3>Flow Rates & Pipe Sizing</h3>
          <div className="results-grid">
              <div className="result-card">
                 <h4>Recharge Flow</h4>
                 <p className="result-value">{formatNumber(results.rechargeFlow, 1)} cfs</p>
               </div>
               <div className="result-card">
                 <h4>Fill Rate</h4>
                 <p className="result-value">{formatNumber(results.fillRate, 1)} cfs</p>
               </div>
               <div className="result-card">
                 <h4>Required Flow (Input/Est.)</h4> {/* Clarified label */}
                 <p className="result-value">{formatNumber(results.requiredFlow, 1)} cfs</p>
               </div>
               <div className="result-card">
                 <h4>Recommended Pipe Size</h4>
                 <p className="result-value">{results.recommendedPipeSize || '--'}"</p> {/* Handle if undefined */}
               </div>
               <div className="result-card">
                 <h4>Pipe Flow Capacity</h4>
                 <p className="result-value">{formatNumber(results.pipeFlowCapacity, 1)} cfs</p>
               </div>
          </div>
        </div>

       <div className="results-group">
         <h3>Financial Analysis (10 years)</h3>
         <div className="results-grid">
            <div className="result-card">
             <h4>Annual Net Benefits</h4> {/* Clarified label */}
             <p className="result-value">{formatCurrency(results.annualBenefits)}</p>
           </div>
           <div className="result-card">
             <h4>Total Benefits (10 years)</h4>
             <p className="result-value">{formatCurrency(results.totalBenefits10Years)}</p>
           </div>
           <div className="result-card">
             <h4>Total Outlay (10 years)</h4>
             <p className="result-value">{formatCurrency(results.totalOutlay10Years)}</p>
           </div>
           <div className="result-card">
             <h4>Net Benefit (10 years)</h4>
             <p className="result-value">{formatCurrency(results.netBenefit10Years)}</p>
           </div>
           <div className="result-card roi">
             <h4>ROI</h4>
             <p className="result-value">{formatNumber(results.roi, 1)}%</p>
           </div>
           <div className="result-card npv">
             <h4>NPV</h4>
             <p className="result-value">{formatCurrency(results.npv)}</p>
           </div>
           <div className="result-card">
             <h4>B/C Ratio</h4>
             <p className="result-value">{formatNumber(results.bcRatio, 3)}</p>
           </div>
         </div>
       </div>
    </div>
  );
};

export default Results;

