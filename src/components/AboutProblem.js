import React from 'react';

const AboutProblem = () => {
  return (
    <section className="about-problem">
      <div className="content-wrapper">
        <h2>About the Problem</h2>
        <div className="problem-content">
          <div className="problem-text">
            <h3>Water Scarcity in California's Central Valley</h3>
            <p>
              California's Central Valley faces increasing water scarcity due to climate change, 
              prolonged droughts, and growing agricultural demands. Groundwater levels have been 
              declining for decades, threatening the sustainability of one of the world's most 
              productive agricultural regions.
            </p>
            <p>
              Traditional water management practices are no longer sufficient to meet the needs 
              of valley farmers. The region requires innovative solutions to recharge groundwater 
              aquifers and ensure long-term water security for agricultural operations.
            </p>
          </div>
          <div className="problem-stats">
            <div className="stat-card">
              <h4>Groundwater Depletion</h4>
              <p className="stat-number">-2.5 ft/year</p>
              <p className="stat-desc">Average groundwater level decline</p>
            </div>
            <div className="stat-card">
              <h4>Agricultural Impact</h4>
              <p className="stat-number">$2.2B</p>
              <p className="stat-desc">Annual economic losses from drought</p>
            </div>
            <div className="stat-card">
              <h4>Water Demand</h4>
              <p className="stat-number">80%</p>
              <p className="stat-desc">Of California's water used for agriculture</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProblem;
