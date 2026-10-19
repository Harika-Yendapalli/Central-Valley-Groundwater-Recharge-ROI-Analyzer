import React from 'react';

const AboutSolution = () => {
  return (
    <section className="about-solution">
      <div className="content-wrapper">
        <h2>About the Solution</h2>
        <div className="solution-content">
          <div className="solution-text">
            <h3>Water Recharge Basins: A Sustainable Solution</h3>
            <p>
              Water recharge basins are engineered structures designed to capture and store 
              surface water during wet periods, allowing it to percolate into groundwater 
              aquifers. This innovative approach helps restore groundwater levels while 
              providing multiple benefits to valley farmers.
            </p>
            <div className="solution-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">💧</div>
                <h4>Groundwater Recharge</h4>
                <p>Directly replenishes depleted aquifers during wet years</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🌱</div>
                <h4>Water Security</h4>
                <p>Provides reliable water storage for dry periods</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <h4>Economic Benefits</h4>
                <p>Reduces water costs and increases crop yields</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🌍</div>
                <h4>Environmental</h4>
                <p>Supports ecosystem health and water quality</p>
              </div>
            </div>
          </div>
          <div className="solution-diagram">
            <h4>How Recharge Basins Work</h4>
            <div className="diagram-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Water Capture</h5>
                  <p>Surface water is diverted to the basin during wet periods</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Infiltration</h5>
                  <p>Water percolates through soil layers into groundwater</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Storage</h5>
                  <p>Water is stored in aquifers for future use</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSolution;


