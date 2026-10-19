import React, { useState } from 'react';
import Calculator from '../components/Calculator';
import Results from '../components/Results';

const CalculatorPage = () => {
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  // Add state for calculation errors
  const [calculationError, setCalculationError] = useState('');

  const handleCalculate = (calculationResults) => {
    // Clear previous error when starting calculation
    setCalculationError('');
    if (calculationResults) {
      setResults(calculationResults);
      setShowResults(true);
      // Optional: Scroll to results after calculation
      setTimeout(() => {
          const resultsSection = document.getElementById('results-section');
          if (resultsSection) {
              resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }, 100);
    } else {
        // If calculator function indicates an error (e.g., returns null)
        setResults(null);
        setShowResults(false);
        setCalculationError('An error occurred during calculation. Please check your inputs.');
    }
  };

  // Function to clear errors when inputs change in Calculator
  const handleInputChangeWithErrorClear = () => {
      if (calculationError) {
          setCalculationError(''); // Clear calculation error on input change
      }
       // We might need to pass this down if Calculator doesn't have access
       // Or handle input changes directly here if state is lifted
  };


  return (
    <>
      {/* Pass the error clearing function if needed, or handle input changes here */}
      <Calculator onCalculate={handleCalculate} onInputChange={handleInputChangeWithErrorClear} />

      {/* Display Calculation Error Message */}
      {calculationError && (
        <div className="calculation-error-message">
           <p>⚠️ {calculationError}</p>
        </div>
      )}

      {/* Conditionally render results. Add an id for scrolling */}
      {showResults && results && <div id="results-section"><Results results={results} /></div>}
    </>
  );
};

export default CalculatorPage;
