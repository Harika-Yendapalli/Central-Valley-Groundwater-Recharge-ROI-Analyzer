import React, { useState, useEffect } from 'react'; // Added useEffect

// Pass onInputChange from props if needed to clear errors
const Calculator = ({ onCalculate, onInputChange }) => {
  // 1. State only includes essential fields
  const [formData, setFormData] = useState({
    // Basin Size and Design (Required + Core)
    basinArea: '', longSide: '', shortSide: '', topOfLevee: '',
    // Soil Properties (Required)
    soilType: '', infiltrationRate: '',
    // Water Availability (Used in calculation)
    wetYearFrequency: '', durationWetYears: '',
    // Development Costs (Core)
    landCost: '', pipelineLength: '', earthworkCost: '', pipelineCost: '', engineeringContingency: '',
    // Financial Parameters (Core)
    interestRate: '', loanTerm: '',
    // Pipe Sizing (Inputs affecting selection)
    requiredFlow: '', recommendedPipe: '',
    // Water Costs & Value (Core)
    rechargeWaterCost: '', storedWaterValue: '', omCost: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // --- Keep soilInfiltrationRates and pipeSizeData ---
  const soilInfiltrationRates = {
    'sand': 1.0, 'sandy-with-fine': 0.7, 'loam': 0.6, 'loam-with-fine': 0.5,
    'silt-clay-loam': 0.4, 'silt-clay-fine': 0.3, 'clay-restrictive': 0.05
  };
  const pipeSizeData = {
    15: { q: 2.1 }, 18: { q: 3.6 }, 24: { q: 8.2 }, 30: { q: 15.9 }, 36: { q: 27.4 },
    42: { q: 43.5 }, 48: { q: 65.2 }, 54: { q: 82.5 }, 60: { q: 102.1 }, 66: { q: 123.6 },
    72: { q: 147.0 }, 78: { q: 172.3 }, 84: { q: 199.5 }
    // Removed other properties (n, v, a, r, sf) as they aren't used directly
  };

  // --- Keep handleInputChange ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    // If the error clearing function is passed from parent, call it
    if (onInputChange) {
        onInputChange();
    }
    // Validation runs via useEffect
  };

   // --- Update validateForm to only include remaining essential fields ---
    const validateForm = (data = formData) => {
     const errors = {};
     let isValid = true;
     // Define essential fields and their rules
     const fieldsToValidate = {
       basinArea: { required: true, numeric: true, min: 1, max: 10000, errorMsg: 'Basin area must be between 1 and 10,000 acres' },
       longSide: { required: true, numeric: true, min: 0.1 }, // Min 0.1 to avoid zero division issues later
       shortSide: { required: true, numeric: true, min: 0.1 },
       topOfLevee: { required: true, numeric: true, min: 0.1 },
       infiltrationRate: { required: true, numeric: true, min: 0.01, max: 10, errorMsg: 'Infiltration rate must be between 0.01 and 10 ft/day' },
       pipelineLength: { required: true, numeric: true },
       // Optional but need validation if entered (non-negative)
       landCost: { numeric: true, optional: true, min: 0 },
       earthworkCost: { numeric: true, optional: true, min: 0 },
       pipelineCost: { numeric: true, optional: true, min: 0 },
       engineeringContingency: { numeric: true, min: 0, max: 100, optional: true, errorMsg: 'Contingency must be between 0 and 100%' },
       interestRate: { numeric: true, min: 0, max: 50, optional: true, errorMsg: 'Interest rate must be between 0 and 50%' },
       loanTerm: { numeric: true, optional: true, min: 0 },
       wetYearFrequency: { numeric: true, min: 0, max: 100, optional: true, errorMsg: 'Frequency must be between 0 and 100%' },
       durationWetYears: { numeric: true, optional: true, min: 0 },
       requiredFlow: { numeric: true, optional: true, min: 0 },
       rechargeWaterCost: { numeric: true, optional: true, min: 0 },
       storedWaterValue: { numeric: true, optional: true, min: 0 },
       omCost: { numeric: true, optional: true, min: 0 },
     };

    let allRequiredFilled = true;

    Object.entries(fieldsToValidate).forEach(([field, rules]) => {
      const value = data[field];
      const hasValue = value !== null && value !== undefined && value !== '';

      // Required validation
      if (rules.required && !hasValue) {
        allRequiredFilled = false;
        if (touchedFields[field]) { errors[field] = 'This field is required'; isValid = false; }
      }

      // Numeric and Range validation (only if value exists)
      if (hasValue && rules.numeric) {
        const numValue = Number(value); // Use Number() for better NaN check
        const minVal = rules.min !== undefined ? rules.min : (rules.required ? 0.00001 : 0); // Use tiny positive for required to avoid zero issues, 0 for optional
        const checkValue = numValue >= minVal;
        const errorMsgPrefix = `Must be ${minVal > 0 ? 'positive' : 'zero or positive'}`;


        if (isNaN(numValue) || !checkValue) {
          // Provide specific min error if applicable
          if (!isNaN(numValue) && rules.min !== undefined && numValue < rules.min && rules.errorMsg) {
             errors[field] = rules.errorMsg;
          } else if (!isNaN(numValue) && rules.min !== undefined && numValue < rules.min) {
             errors[field] = `Must be at least ${rules.min}`;
          }
           else {
             errors[field] = isNaN(numValue) ? 'Must be a valid number' : errorMsgPrefix;
          }
          isValid = false;
        } else {
          // Max range check
          if (rules.max !== undefined && numValue > rules.max) {
            errors[field] = rules.errorMsg || `Must be no more than ${rules.max}`;
            isValid = false;
          }
        }
      }
    });

    setFormErrors(errors);
    // Form is valid if all required fields have values AND there are no errors
    const finalIsValid = allRequiredFilled && Object.keys(errors).length === 0;
    setIsFormValid(finalIsValid);
    return finalIsValid;
   };

    // --- Add useEffect to validate form whenever formData or touchedFields changes ---
    useEffect(() => {
        validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, touchedFields]); // Rerun validation, disable lint for dependency array


  // --- Keep handleSoilTypeChange ---
   const handleSoilTypeChange = (e) => {
    const soilType = e.target.value;
    const newInfiltrationRate = soilInfiltrationRates[soilType] || '';
    // Update form data state
    setFormData(prev => ({
        ...prev,
        soilType: soilType,
        infiltrationRate: newInfiltrationRate
    }));
    // Also mark infiltrationRate as touched if soilType changes it
    setTouchedFields(prev => ({
        ...prev,
        soilType: true,
        infiltrationRate: true
    }));
    // Validation runs automatically due to useEffect
  };

  // --- Update calculateROI ---
  const calculateROI = () => {
    // Touch all *required* fields first to ensure errors show if needed
    const requiredFields = ['basinArea', 'longSide', 'shortSide', 'topOfLevee', 'infiltrationRate', 'pipelineLength'];
    const touchedUpdates = {};
    requiredFields.forEach(field => { touchedUpdates[field] = true; });
    setTouchedFields(prev => ({ ...prev, ...touchedUpdates }));

    // Re-validate immediately after touching fields to update state/UI
    // We need to wait for state update before checking validity
    setTimeout(() => {
        const isValidNow = validateForm(); // Rerun validation which updates state

        if (!isValidNow) {
          console.error("Form validation failed", formErrors); // Log errors
          // Find the first element with an error and scroll to it
          const firstErrorField = Object.keys(formErrors).find(key => formErrors[key]);
          if (firstErrorField) {
            // Generate ID from camelCase name - ensure consistent IDs in JSX (e.g., id="basinArea")
            // const elementId = firstErrorField.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
            const element = document.getElementById(firstErrorField); // Use camelCase ID directly
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              try { element.focus({ preventScroll: true }); } catch (e) { console.warn("Could not focus on element:", firstErrorField, e); }
            } else {
                console.warn("Could not find element with ID:", firstErrorField);
            }
          }
          onCalculate(null); // Signal error to parent without alert
          return; // Stop calculation
        }

        // --- Proceed with calculation if valid ---
        setIsCalculating(true);

        try { // Add try...finally back for setting isCalculating false
            const {
                basinArea, longSide, shortSide, topOfLevee, infiltrationRate,
                wetYearFrequency, durationWetYears, landCost, pipelineLength,
                earthworkCost, interestRate, loanTerm,
                pipelineCost, engineeringContingency,
                rechargeWaterCost, storedWaterValue, omCost, requiredFlow, recommendedPipe
            } = formData;

            // Convert essential numbers (Use defaults explicitly)
            const area = Number(basinArea) || 0;
            const length = Number(longSide) || 0;
            const width = Number(shortSide) || 0;
            const leveeHeight = Number(topOfLevee) || 0;
            const infiltration = Number(infiltrationRate) || 0;
            const wetFreq = (Number(wetYearFrequency) || 0) / 100;
            const duration = Number(durationWetYears) || 0;
            const landCostPerAcre = Number(landCost) || 0;
            const pipelineLen = Number(pipelineLength) || 0;
            const earthworkCostPerYard = Number(earthworkCost) || 0;
            const interest = (Number(interestRate) || 0) / 100;
            const loanYears = Number(loanTerm) || 10; // Default loan term if not provided or 0
            const pipelineCostPerFoot = Number(pipelineCost) || 0;
            const contingency = (Number(engineeringContingency) || 0) / 100;
            const waterCost = Number(rechargeWaterCost) || 0;
            const waterValue = Number(storedWaterValue) || 0;
            const omCostPerAcreFoot = Number(omCost) || 0;
            const reqFlow = Number(requiredFlow) || 0; // Use 0 default

            // --- Calculations (Ensure checks before use) ---
            if (area <= 0 || length <= 0 || width <= 0 || leveeHeight <= 0 || infiltration <= 0 || pipelineLen <= 0) {
                console.error("One or more required numeric inputs resulted in zero or negative after parsing.");
                throw new Error("Invalid required inputs."); // Throw error to be caught by catch block
            }

            const perimeter = 2 * (length + width);
            const centerLeveeVolume = (length * width * leveeHeight) / 27;
            const insideLeveeVolume = centerLeveeVolume * 0.5;
            const outsideLeveeVolume = centerLeveeVolume * 0.25;
            const totalEarthwork = centerLeveeVolume + insideLeveeVolume + outsideLeveeVolume;
            const earthworkCostTotal = totalEarthwork * earthworkCostPerYard;
            const netInsideLength = Math.max(0, length - 16);
            const wettedArea = netInsideLength * width;
            const wettedAreaAcres = wettedArea / 43560;
            const landCostTotal = area * landCostPerAcre;
            const pipelineCostTotal = pipelineLen * pipelineCostPerFoot;
            const subtotal = landCostTotal + earthworkCostTotal + pipelineCostTotal;
            const contingencyCost = subtotal * contingency;
            const totalCost = subtotal + contingencyCost;

            let annualCapitalPayment = 0;
            const effLoanYears = Math.max(1, loanYears); // Ensure loanYears is at least 1 for calc
            if (interest > 0) {
                const factor = Math.pow(1 + interest, effLoanYears);
                if (factor !== 1) { // Avoid division by zero if factor is 1 (can happen with very small interest/years)
                     annualCapitalPayment = totalCost * (interest * factor) / (factor - 1);
                } else {
                    annualCapitalPayment = totalCost / effLoanYears; // Fallback or handle differently
                }
            } else { // interest is 0 or negative
                annualCapitalPayment = totalCost / effLoanYears;
            }

            const daysPerYearAvailable = Math.max(0, duration * 30.4);
            const netRecharge = Math.max(0, wettedAreaAcres * infiltration * daysPerYearAvailable * wetFreq);

            const annualizedCapitalCostPerAcreFoot = netRecharge > 0 ? annualCapitalPayment / netRecharge : 0;
            const totalAnnualizedCostPerAcreFoot = annualizedCapitalCostPerAcreFoot + waterCost + omCostPerAcreFoot;
            const netBenefitPerAcreFoot = waterValue - totalAnnualizedCostPerAcreFoot;

            const rechargeFlow = netRecharge > 0 && daysPerYearAvailable > 0 ? (netRecharge * 43560) / (daysPerYearAvailable * 24 * 3600) : 0;
            const fillRate = rechargeFlow * 1.5;

            let recommendedPipeSize = 30;
            let pipeFlowCapacity = pipeSizeData[30]?.q || 0;
            const flowToSize = reqFlow > 0 ? reqFlow : fillRate;

            if (recommendedPipe && pipeSizeData[recommendedPipe]) {
                recommendedPipeSize = parseInt(recommendedPipe);
                pipeFlowCapacity = pipeSizeData[recommendedPipe].q;
            } else if (flowToSize > 0) {
                let foundPipe = false;
                const sortedSizes = Object.keys(pipeSizeData).map(Number).sort((a, b) => a - b);
                for (const size of sortedSizes) {
                    if (pipeSizeData[size]?.q >= flowToSize) {
                        recommendedPipeSize = size;
                        pipeFlowCapacity = pipeSizeData[size].q;
                        foundPipe = true;
                        break;
                    }
                }
                if (!foundPipe && sortedSizes.length > 0) {
                    const largestSize = sortedSizes[sortedSizes.length - 1];
                    recommendedPipeSize = largestSize;
                    pipeFlowCapacity = pipeSizeData[largestSize]?.q || 0;
                }
            }

            const annualNetBenefits = netRecharge * netBenefitPerAcreFoot;
            const totalBenefits10Years = annualNetBenefits * 10;
            const totalOMCosts10Years = (omCostPerAcreFoot * netRecharge) * 10;
            const totalWaterCosts10Years = (waterCost * netRecharge) * 10;
            const totalOutlay10Years = totalCost + totalOMCosts10Years + totalWaterCosts10Years;
            const netBenefit10Years = totalBenefits10Years - totalOutlay10Years;
            const roi10Years = totalCost > 0 ? (netBenefit10Years / totalCost) * 100 : (netBenefit10Years > 0 ? Infinity : 0);

            const discountRate = interest;
            let pvTotalCosts = totalCost;
            let pvTotalBenefits = 0;
            const calculationHorizon = Math.max(10, effLoanYears);
            for (let year = 1; year <= calculationHorizon; year++) {
                const discountFactor = Math.pow(1 + discountRate, -year);
                const annualOMCost = omCostPerAcreFoot * netRecharge;
                const annualWaterCost = waterCost * netRecharge;
                pvTotalCosts += (annualOMCost + annualWaterCost) * discountFactor;
                pvTotalBenefits += (waterValue * netRecharge) * discountFactor;
            }
            const npv = pvTotalBenefits - pvTotalCosts;
            const bcRatio = pvTotalCosts > 0 ? pvTotalBenefits / pvTotalCosts : (pvTotalBenefits > 0 ? Infinity : 0);

            const results = {
                basinArea: area, areaSquareMiles: area / 640, perimeter: perimeter,
                totalEarthwork: totalEarthwork, earthworkCost: earthworkCostTotal,
                wettedArea: wettedAreaAcres, wettedAreaPercent: area > 0 ? (wettedAreaAcres / area) * 100 : 0,
                landCost: landCostTotal, pipelineCost: pipelineCostTotal,
                subtotal: subtotal, contingencyCost: contingencyCost, totalCost: totalCost,
                annualCapitalPayment: annualCapitalPayment,
                averageRechargeDepth: infiltration, // Display infiltration rate directly
                netRecharge: netRecharge,
                annualizedCapitalCostPerAcreFoot: annualizedCapitalCostPerAcreFoot,
                totalAnnualizedCostPerAcreFoot: totalAnnualizedCostPerAcreFoot,
                netBenefit: netBenefitPerAcreFoot,
                rechargeFlow: rechargeFlow, fillRate: fillRate,
                recommendedPipeSize: recommendedPipeSize, pipeFlowCapacity: pipeFlowCapacity,
                requiredFlow: reqFlow, // Use parsed value
                roi: roi10Years, npv: npv, bcRatio: bcRatio,
                annualBenefits: annualNetBenefits,
                totalBenefits10Years: totalBenefits10Years,
                totalOutlay10Years: totalOutlay10Years,
                netBenefit10Years: netBenefit10Years
            };

            // Final check for non-finite numbers before passing results
            for (const key in results) {
                if (typeof results[key] === 'number' && !isFinite(results[key])) {
                     console.error(`Calculation resulted in non-finite number for ${key}:`, results[key]);
                     throw new Error(`Calculation error: ${key} is not finite.`); // Throw error
                }
            }

            onCalculate(results); // Pass valid results

        } catch (error) {
            console.error('Calculation error:', error);
            onCalculate(null); // Signal error to parent
        } finally {
            setIsCalculating(false);
        }

    }, 0); // Use setTimeout to allow state update before validation check

  };


   // --- JSX (Removed Optional Input Fields) ---
   return (
     <main className="calculator" id="calculator-section">
       {/* --- Basin Size and Design (Simplified) --- */}
       <div className="form-section">
         <h2>Basin Size and Design</h2>
          {/* Use grid layout */}
         <div className="form-fields-grid">
           <div className="form-group">
             <label htmlFor="basinArea">Basin Area (acres)</label>
             <input type="number" id="basinArea" name="basinArea" value={formData.basinArea} onChange={handleInputChange} placeholder="Total acres for basin & levees" className={formErrors.basinArea ? 'input-error' : ''} />
             {formErrors.basinArea && <span className="error-message">{formErrors.basinArea}</span>}
           </div>
           {/* Removed Design Type */}
           <div className="form-group">
             <label htmlFor="longSide">Long Side (feet)</label>
             <input type="number" id="longSide" name="longSide" value={formData.longSide} onChange={handleInputChange} placeholder="Basin length" className={formErrors.longSide ? 'input-error' : ''} />
             {formErrors.longSide && <span className="error-message">{formErrors.longSide}</span>}
           </div>
           <div className="form-group">
             <label htmlFor="shortSide">Short Side (feet)</label>
             <input type="number" id="shortSide" name="shortSide" value={formData.shortSide} onChange={handleInputChange} placeholder="Basin width" className={formErrors.shortSide ? 'input-error' : ''} />
             {formErrors.shortSide && <span className="error-message">{formErrors.shortSide}</span>}
           </div>
           <div className="form-group">
             <label htmlFor="topOfLevee">Top of Levee Height (feet)</label>
             <input type="number" id="topOfLevee" name="topOfLevee" value={formData.topOfLevee} onChange={handleInputChange} placeholder="Levee height above ground" className={formErrors.topOfLevee ? 'input-error' : ''} />
              {formErrors.topOfLevee && <span className="error-message">{formErrors.topOfLevee}</span>}
           </div>
         </div>
       </div>

       {/* --- Soil Properties --- */}
       <div className="form-section">
         <h2>Soil Properties</h2>
          <div className="form-fields-grid">
           <div className="form-group">
             <label htmlFor="soilType">Soil Type</label>
             <select id="soilType" name="soilType" value={formData.soilType} onChange={handleSoilTypeChange} >
               <option value="">Select soil type (sets default rate)</option>
               <option value="sand">Sand (Group A)</option>
               <option value="sandy-with-fine">Sandy w/ fine layering (A')</option>
               <option value="loam">Loam (Group B)</option>
               <option value="loam-with-fine">Loam w/ fine layering (B')</option>
               <option value="silt-clay-loam">Silt or Clay Loam (C)</option>
               <option value="silt-clay-fine">Silt/Clay Loam w/ fine layering (C')</option>
               <option value="clay-restrictive">Clay or restrictive layers (D)</option>
             </select>
           </div>
           <div className="form-group">
             <label htmlFor="infiltrationRate">Infiltration Rate (ft/day)</label>
             <input type="number" id="infiltrationRate" name="infiltrationRate" value={formData.infiltrationRate} onChange={handleInputChange} step="0.01" placeholder="Enter rate or select soil type" className={formErrors.infiltrationRate ? 'input-error' : ''} />
             {formErrors.infiltrationRate && <span className="error-message">{formErrors.infiltrationRate}</span>}
             <small>This value overrides soil type selection.</small>
           </div>
         </div>
       </div>

       {/* --- Water Availability --- */}
       <div className="form-section">
         <h2>Water Availability</h2>
          <div className="form-fields-grid">
           <div className="form-group">
             <label htmlFor="wetYearFrequency">Wet Year Frequency (%)</label>
             <input type="number" id="wetYearFrequency" name="wetYearFrequency" value={formData.wetYearFrequency} onChange={handleInputChange} placeholder="e.g., 20" min="0" max="100" className={formErrors.wetYearFrequency ? 'input-error' : ''} />
              {formErrors.wetYearFrequency && <span className="error-message">{formErrors.wetYearFrequency}</span>}
              <small>Percent of years water is available.</small>
           </div>
           <div className="form-group">
             <label htmlFor="durationWetYears">Avg. Duration During Wet Years (months)</label>
             <input type="number" id="durationWetYears" name="durationWetYears" value={formData.durationWetYears} onChange={handleInputChange} placeholder="e.g., 3" min="0" className={formErrors.durationWetYears ? 'input-error' : ''} />
             {formErrors.durationWetYears && <span className="error-message">{formErrors.durationWetYears}</span>}
             <small>Avg. months available in those wet years.</small>
           </div>
         </div>
       </div>

       {/* --- Development Costs (Simplified) --- */}
       <div className="form-section">
         <h2>Development Costs</h2>
         <div className="form-fields-grid">
           <div className="form-group">
             <label htmlFor="landCost">Land Cost ($/acre)</label>
             <input type="number" id="landCost" name="landCost" value={formData.landCost} onChange={handleInputChange} placeholder="Cost per acre of land" min="0" className={formErrors.landCost ? 'input-error' : ''} />
              {formErrors.landCost && <span className="error-message">{formErrors.landCost}</span>}
           </div>
           <div className="form-group">
             <label htmlFor="earthworkCost">Earthwork Cost ($/cubic yard)</label>
             <input type="number" id="earthworkCost" name="earthworkCost" value={formData.earthworkCost} onChange={handleInputChange} placeholder="Cost per cubic yard" min="0" className={formErrors.earthworkCost ? 'input-error' : ''} />
              {formErrors.earthworkCost && <span className="error-message">{formErrors.earthworkCost}</span>}
           </div>
            <div className="form-group">
             <label htmlFor="pipelineLength">Pipeline Length (feet)</label>
             <input type="number" id="pipelineLength" name="pipelineLength" value={formData.pipelineLength} onChange={handleInputChange} placeholder="Total length needed" min="0" className={formErrors.pipelineLength ? 'input-error' : ''} />
             {formErrors.pipelineLength && <span className="error-message">{formErrors.pipelineLength}</span>}
           </div>
           <div className="form-group">
             <label htmlFor="pipelineCost">Pipeline Cost ($/foot)</label>
             <input type="number" step="0.01" id="pipelineCost" name="pipelineCost" value={formData.pipelineCost} onChange={handleInputChange} placeholder="Cost per foot installed" min="0" className={formErrors.pipelineCost ? 'input-error' : ''} />
              {formErrors.pipelineCost && <span className="error-message">{formErrors.pipelineCost}</span>}
           </div>
           <div className="form-group">
             <label htmlFor="engineeringContingency">Engineering & Contingency (%)</label>
             <input type="number" step="0.1" id="engineeringContingency" name="engineeringContingency" value={formData.engineeringContingency} onChange={handleInputChange} placeholder="e.g., 15" min="0" max="100" className={formErrors.engineeringContingency ? 'input-error' : ''} />
             {formErrors.engineeringContingency && <span className="error-message">{formErrors.engineeringContingency}</span>}
           </div>
         </div>
       </div>

        {/* --- Financial Parameters --- */}
        <div className="form-section">
         <h2>Financial Parameters</h2>
          <div className="form-fields-grid">
           <div className="form-group">
             <label htmlFor="interestRate">Interest Rate (%)</label>
             <input type="number" id="interestRate" name="interestRate" value={formData.interestRate} onChange={handleInputChange} step="0.01" placeholder="e.g., 6.5" min="0" max="50" className={formErrors.interestRate ? 'input-error' : ''} />
              {formErrors.interestRate && <span className="error-message">{formErrors.interestRate}</span>}
           </div>
           <div className="form-group">
             <label htmlFor="loanTerm">Loan Term (years)</label>
             <input type="number" id="loanTerm" name="loanTerm" value={formData.loanTerm} onChange={handleInputChange} placeholder="e.g., 20" min="0" className={formErrors.loanTerm ? 'input-error' : ''} />
             {formErrors.loanTerm && <span className="error-message">{formErrors.loanTerm}</span>}
           </div>
         </div>
       </div>

       {/* --- Pipe Sizing --- */}
       <div className="form-section">
         <h2>Pipe Sizing</h2>
          <div className="form-fields-grid">
           <div className="form-group">
             <label htmlFor="requiredFlow">Required Flow Rate (cfs)</label>
             <input type="number" step="0.1" id="requiredFlow" name="requiredFlow" value={formData.requiredFlow || ''} onChange={handleInputChange} placeholder="(Optional) Specific flow needed" min="0" className={formErrors.requiredFlow ? 'input-error' : ''} />
             {formErrors.requiredFlow && <span className="error-message">{formErrors.requiredFlow}</span>}
             <small>Leave blank to estimate based on basin size.</small>
           </div>
           <div className="form-group">
             <label htmlFor="recommendedPipe">Select Pipe Size (Diameter, inches)</label>
             <select id="recommendedPipe" name="recommendedPipe" value={formData.recommendedPipe || ''} onChange={handleInputChange} >
                <option value="">Auto-select based on flow</option>
                {Object.entries(pipeSizeData).map(([size, data]) => (
                  <option key={size} value={size}>{`${size}" (Up to ${data.q.toFixed(1)} cfs)`}</option>
                ))}
             </select>
             <small>Overrides auto-selection if chosen.</small>
           </div>
          </div>
       </div>

       {/* --- Water Costs & Value --- */}
       <div className="form-section">
         <h2>Water Costs & Value</h2>
         <div className="form-fields-grid">
           <div className="form-group">
             <label htmlFor="rechargeWaterCost">Recharge Water Cost ($/acre-foot)</label>
             <input type="number" step="0.01" id="rechargeWaterCost" name="rechargeWaterCost" value={formData.rechargeWaterCost} onChange={handleInputChange} placeholder="Cost of source water" min="0" className={formErrors.rechargeWaterCost ? 'input-error' : ''} />
             {formErrors.rechargeWaterCost && <span className="error-message">{formErrors.rechargeWaterCost}</span>}
           </div>
           <div className="form-group">
             <label htmlFor="storedWaterValue">Stored Water Value ($/acre-foot)</label>
             <input type="number" step="0.01" id="storedWaterValue" name="storedWaterValue" value={formData.storedWaterValue} onChange={handleInputChange} placeholder="Value of banked water" min="0" className={formErrors.storedWaterValue ? 'input-error' : ''} />
             {formErrors.storedWaterValue && <span className="error-message">{formErrors.storedWaterValue}</span>}
              <small>Avoided pumping cost or market value.</small>
           </div>
           <div className="form-group">
             <label htmlFor="omCost">Annual O&M Cost ($/acre-foot)</label>
             <input type="number" step="0.01" id="omCost" name="omCost" value={formData.omCost} onChange={handleInputChange} placeholder="Maintenance, etc." min="0" className={formErrors.omCost ? 'input-error' : ''} />
             {formErrors.omCost && <span className="error-message">{formErrors.omCost}</span>}
              <small>Cost per acre-foot recharged.</small>
           </div>
         </div>
       </div>

       {/* --- Calculate Button --- */}
       <button
         className={`calculate-btn ${!isFormValid || isCalculating ? 'disabled' : ''}`}
         onClick={calculateROI}
         disabled={!isFormValid || isCalculating}
       >
         {isCalculating ? 'Calculating...' : !isFormValid ? 'Fill required fields' : 'Calculate ROI'}
       </button>
     </main>
   );
};

export default Calculator;

