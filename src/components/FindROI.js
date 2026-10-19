import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

// CSS for Leaflet Maps
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for missing Leaflet marker icons (common issue in React)
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const FindROI = () => {
  const navigate = useNavigate();
  
  // State for the text input
  const [problemStatement, setProblemStatement] = useState("");
  
  // Ref to access drawn layers on the map
  const featureGroupRef = useRef(); 

  // --- ANALYZE FUNCTION ---
  const handleAnalyze = async () => {
    // 1. Get layers from the map
    const layers = featureGroupRef.current.getLayers();

    if (layers.length === 0) {
      alert("Please draw a rectangle on the map to select your area!");
      return;
    }

    if (!problemStatement.trim()) {
      alert("Please describe the problem statement.");
      return;
    }

    // 2. Get bounds from the first drawn shape
    const bounds = layers[0].getBounds(); 

    // 3. Prepare data payload
    const payload = {
      problemStatement: problemStatement,
      bounds: bounds, 
      extraData: { date: new Date().toISOString() } 
    };

    try {
      console.log("Sending data to backend...");
      
      // 4. Send to Node Backend
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("Results received:", data);

      // 5. Navigate to Results page with the data
      navigate('/results', { state: { report: data } });

    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Failed to connect to the server. Is the backend running on port 5000?");
    }
  };

  return (
    <section className="find-roi">
      <h2>Find Your ROI</h2>
      <div className="roi-content">
        
        {/* --- INTRO SECTION (Kept from your original code) --- */}
        <div className="roi-intro">
          <h3>Calculate Your Recharge Basin Investment</h3>
          <p>
            Our comprehensive calculator helps you determine the financial viability
            of a recharge basin investment. Input your parameters below and select 
            your area on the map.
          </p>
        </div>

        {/* --- FEATURES LIST (Kept from your original code) --- */}
        <div className="feature-list" style={{ marginBottom: '40px' }}>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-text">
              <h4>Financial Analysis</h4>
              <p>Complete ROI, NPV, and payback period calculations</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🏗️</div>
            <div className="feature-text">
              <h4>Construction Costs</h4>
              <p>Detailed earthwork and infrastructure estimates</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">💧</div>
            <div className="feature-text">
              <h4>Water Modeling</h4>
              <p>Infiltration rates and recharge capacity analysis</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📈</div>
            <div className="feature-text">
              <h4>Long-term Benefits</h4>
              <p>10-year financial projections</p>
            </div>
          </div>
        </div>

        {/* --- NEW: MAP & FORM INTERFACE --- */}
        <div className="roi-cta" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>Step 1: Define the Problem</h3>
          <textarea 
            placeholder="Describe the problem or project goals here..."
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
          />

          <h3>Step 2: Select Area on Map</h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
            Use the square icon on the top-right of the map to draw your project boundaries.
          </p>

          <div style={{ height: '400px', marginBottom: '20px', border: '2px solid #ddd', borderRadius: '4px' }}>
            {/* Centered on Fresno/Central Valley by default */}
            <MapContainer center={[36.7378, -119.7871]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <FeatureGroup ref={featureGroupRef}>
                <EditControl 
                  position="topright" 
                  draw={{
                    rectangle: true,
                    polygon: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false
                  }} 
                />
              </FeatureGroup>
            </MapContainer>
          </div>

          <button className="cta-button" onClick={handleAnalyze} style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }}>
            Analyze Soil & Calculate ROI
          </button>
        </div>

      </div>
    </section>
  );
};

export default FindROI;
