import React from 'react';

const AboutCWI = () => {
  return (
    <section className="about-cwi">
      <div className="content-wrapper">
        <h2>About CWI</h2>
        <div className="cwi-content">
          <div className="cwi-intro">
            <h3>Central Valley Water Institute</h3>
            <p>
              The Central Valley Water Institute (CWI) is dedicated to advancing sustainable 
              water management practices in California's Central Valley. We work with farmers, 
              water districts, and researchers to develop innovative solutions for groundwater 
              recharge and water conservation.
            </p>
          </div>
          <div className="cwi-mission">
            <h4>Our Mission</h4>
            <p>
              To provide valley farmers with the tools, knowledge, and resources needed to 
              implement sustainable water management practices that ensure long-term agricultural 
              viability and environmental stewardship.
            </p>
          </div>
          <div className="cwi-services">
            <h4>Our Services</h4>
            <div className="services-grid">
              <div className="service-item">
                <h5>Technical Consulting</h5>
                <p>Expert guidance on recharge basin design and implementation</p>
              </div>
              <div className="service-item">
                <h5>Financial Analysis</h5>
                <p>ROI calculations and funding assistance for water projects</p>
              </div>
              <div className="service-item">
                <h5>Research & Development</h5>
                <p>Cutting-edge research on groundwater recharge technologies</p>
              </div>
              <div className="service-item">
                <h5>Education & Training</h5>
                <p>Workshops and training programs for sustainable water management</p>
              </div>
            </div>
          </div>
          <div className="cwi-contact">
            <h4>Contact Information</h4>
            <div className="contact-info">
              <p><strong>Central Valley Water Institute</strong></p>
              <p>1234 Water Management Drive</p>
              <p>Fresno, CA 93721</p>
              <p>Phone: (559) 555-0123</p>
              <p>Email: info@cwi.org</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCWI;


