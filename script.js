// Water Recharge Basin Calculator JavaScript

// Soil type infiltration rates (inches/hour)
const soilInfiltrationRates = {
    'sand': 5.0,
    'sandy-loam': 2.0,
    'loam': 1.0,
    'clay-loam': 0.3,
    'clay': 0.05
};

// Update infiltration rate when soil type changes
document.getElementById('soil-type').addEventListener('change', function() {
    const soilType = this.value;
    const infiltrationInput = document.getElementById('infiltration-rate');
    
    if (soilType && soilInfiltrationRates[soilType]) {
        infiltrationInput.value = soilInfiltrationRates[soilType];
    }
});

// Main calculation function
function calculateROI() {
    try {
        // Get input values
        const basinLength = parseFloat(document.getElementById('basin-length').value) || 0;
        const basinWidth = parseFloat(document.getElementById('basin-width').value) || 0;
        const basinDepth = parseFloat(document.getElementById('basin-depth').value) || 0;
        const infiltrationRate = parseFloat(document.getElementById('infiltration-rate').value) || 0;
        const waterAvailability = parseFloat(document.getElementById('water-availability').value) || 0;
        const waterCost = parseFloat(document.getElementById('water-cost').value) || 0;
        const pumpingRate = parseFloat(document.getElementById('pumping-rate').value) || 0;
        const excavationCost = parseFloat(document.getElementById('excavation-cost').value) || 0;
        const pipelineCost = parseFloat(document.getElementById('pipeline-cost').value) || 0;
        const pipelineLength = parseFloat(document.getElementById('pipeline-length').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
        const loanTerm = parseFloat(document.getElementById('loan-term').value) || 0;

        // Validate required inputs
        if (!basinLength || !basinWidth || !basinDepth) {
            alert('Please enter basin dimensions (length, width, and depth).');
            return;
        }

        if (!infiltrationRate) {
            alert('Please enter infiltration rate or select a soil type.');
            return;
        }

        // Calculate basin volume in cubic feet
        const basinVolumeCubicFeet = basinLength * basinWidth * basinDepth;
        
        // Convert to acre-feet (1 acre-foot = 43,560 cubic feet)
        const basinVolumeAcreFeet = basinVolumeCubicFeet / 43560;

        // Calculate excavation cost
        const excavationVolumeCubicYards = basinVolumeCubicFeet / 27; // 1 cubic yard = 27 cubic feet
        const excavationCostTotal = excavationVolumeCubicYards * excavationCost;

        // Calculate pipeline cost
        const pipelineCostTotal = pipelineLength * pipelineCost;

        // Total construction cost
        const totalConstructionCost = excavationCostTotal + pipelineCostTotal;

        // Calculate potential recharge volume per day
        const basinAreaSquareFeet = basinLength * basinWidth;
        const basinAreaAcres = basinAreaSquareFeet / 43560;
        
        // Convert infiltration rate from inches/hour to feet/day
        const infiltrationRateFeetPerDay = (infiltrationRate / 12) * 24;
        
        // Maximum recharge per day (limited by infiltration rate)
        const maxRechargePerDayAcreFeet = basinAreaAcres * infiltrationRateFeetPerDay;
        
        // Calculate annual recharge potential
        const annualRechargePotential = maxRechargePerDayAcreFeet * waterAvailability;

        // Calculate water savings
        const annualWaterSavings = annualRechargePotential * waterCost;

        // Calculate payback period
        let paybackPeriod = 0;
        if (annualWaterSavings > 0) {
            paybackPeriod = totalConstructionCost / annualWaterSavings;
        }

        // Calculate ROI over 10 years
        const totalSavings10Years = annualWaterSavings * 10;
        const netProfit10Years = totalSavings10Years - totalConstructionCost;
        const roi10Years = totalConstructionCost > 0 ? (netProfit10Years / totalConstructionCost) * 100 : 0;

        // Display results
        document.getElementById('basin-volume').textContent = basinVolumeAcreFeet.toFixed(2) + ' acre-feet';
        document.getElementById('construction-cost').textContent = '$' + totalConstructionCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('water-savings').textContent = '$' + annualWaterSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('payback-period').textContent = paybackPeriod.toFixed(1) + ' years';
        document.getElementById('roi').textContent = roi10Years.toFixed(1) + '%';

        // Show results section
        document.getElementById('results').style.display = 'block';
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Calculation error:', error);
        alert('An error occurred during calculation. Please check your inputs and try again.');
    }
}

// Add some default values for testing
function loadSampleData() {
    document.getElementById('basin-length').value = '200';
    document.getElementById('basin-width').value = '150';
    document.getElementById('basin-depth').value = '8';
    document.getElementById('soil-type').value = 'sandy-loam';
    document.getElementById('water-availability').value = '120';
    document.getElementById('water-cost').value = '150';
    document.getElementById('pumping-rate').value = '500';
    document.getElementById('excavation-cost').value = '15';
    document.getElementById('pipeline-cost').value = '25';
    document.getElementById('pipeline-length').value = '500';
    document.getElementById('interest-rate').value = '5.5';
    document.getElementById('loan-term').value = '15';
}

// Add sample data button (for testing)
document.addEventListener('DOMContentLoaded', function() {
    // Create a sample data button
    const sampleButton = document.createElement('button');
    sampleButton.textContent = 'Load Sample Data';
    sampleButton.className = 'sample-btn';
    sampleButton.style.cssText = `
        background: #95a5a6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        font-size: 0.9rem;
    `;
    sampleButton.onclick = loadSampleData;
    
    // Insert before calculate button
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.parentNode.insertBefore(sampleButton, calculateBtn);
});

