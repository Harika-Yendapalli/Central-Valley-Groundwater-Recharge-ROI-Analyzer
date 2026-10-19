import React from 'react';
import AboutProblem from '../components/AboutProblem';
import AboutSolution from '../components/AboutSolution';
import FindROI from '../components/FindROI';
import AboutCWI from '../components/AboutCWI';

const HomePage = () => {
  return (
    <>
      <AboutProblem />
      <AboutSolution />
      <FindROI />
      {/* Note: AboutCWI might fit better here or in the Footer/Layout */}
      <AboutCWI />
    </>
  );
};

export default HomePage;
