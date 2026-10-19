import React from 'react';
// Import Routes and Route from react-router-dom
import { Routes, Route } from 'react-router-dom';

// Import Page Components - CORRECTED FILENAME
import HomePage from './pages/Homepage'; // Corrected: Lowercase 'p' in Homepage
import CalculatorPage from './pages/CalculatorPage';

// Import Layout Components (remain outside Routes)
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';

// Remove component imports that are now inside HomePage
// import AboutProblem from './components/AboutProblem';
// import AboutSolution from './components/AboutSolution';
// import FindROI from './components/FindROI';
// import Calculator from './components/Calculator';
// import Results from './components/Results';
// import AboutCWI from './components/AboutCWI';

function App() {
  // State is now managed within CalculatorPage
  return (
    <div className="app">
      <Header /> {/* Header appears on all pages */}
      <main className="main-content">
        {/* Define the routes */}
        <Routes>
          {/* Ensure the path and element components are correct */}
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          {/* Add more routes here if needed */}
        </Routes>
      </main>
      <Disclaimer /> {/* Disclaimer appears on all pages */}
      <Footer /> {/* Footer appears on all pages */}
    </div>
  );
}

export default App;
