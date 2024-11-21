import React, { useState } from 'react';
import './pagesCss/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import HowItWorks from '../components/HowItWorksComponent';
import GoogleMapsIntegration from "../components/GoogleMapsIntegration";
import SearchBar from '../components/SearchBar';

import { useNavigate } from 'react-router-dom';
import logo from '../images/Mi-InfraLogo.png'; // Adjust the path based on your file structure

const defaultCenter = {
  lat: 43.019387852838754,
  lng: -83.6894584432078,
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(defaultCenter);
  const [reportMarkers, setReportMarkers] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const tab = 'home'; // If you have a 'tab' state, you can define it here. For the home page, we set it to 'home'.
  const navigate = useNavigate();
  return (
    <div>
      {/* Main Content */}
      <div className="Scontent-container mt-5  " >
        {/* Welcome Section */}
        <div className="row justify-content-center mt-4">
          <div className="col-auto text-center">
            {/* Logo */}
            <img 
  src={logo} 
  alt="MI-Infrastructure Logo" 
  style={{ maxWidth: '60%', height: 'auto', marginBottom: '30px', marginTop: '30px' }} 
/>
           
            <p className="mt-3 mb-3">
              <h3>Report infrastructure issues like potholes, broken sidewalks, or streetlights with ease.</h3>
            </p>
            
          </div>
        </div>

       {/* New Section */}
<div className="custom-card-container text-center">
  <h2 className="mb-4 mt-4"><b>Want To Report Public Infrastructure Issues?</b></h2>
  <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
    <h4 className="mb-4 custom-h3">
      
        Help us keep our community safe and well-maintained by reporting issues like potholes, broken sidewalks, and more. Your input makes a difference!
      
    </h4>
  </div>
  <div className="mb-3 button-container">
  <Link to="/form" className="action-button action-button-primary">
    Report an Issue Now
  </Link>
  <Link to="/viewreports" className="action-button action-button-secondary">
    Check on a Report
  </Link>
</div>
</div>

        {/* How It Works Section */}
<div className="custom-card-container mt-4">
  <HowItWorks />
</div>
{/* Google Maps and Search Bar Section */}
<div className="custom-card-container mt-4">
  <h5 className="card-title text-center"><b>Search Nearby Issues</b></h5>
  <div className="d-flex flex-wrap align-items-start justify-content-between">
    {/* Search Bar */}
    <div className="search-bar-container me-4" style={{ flex: '1' }}>
      <SearchBar
        address={address}
        setAddress={setAddress}
        setLocation={setLocation}
      />
    </div>
    
    {/* Google Maps */}
    <div className="google-map-container" style={{ flex: '2', height:"300px" }}>
      <GoogleMapsIntegration
        location={location}
        setLocation={setLocation}
        reportMarkers={reportMarkers}
        setReportMarkers={setReportMarkers}
        defaultCenter={defaultCenter}
        error={error}
        setError={setError}
        tab={tab}
      />
    </div>
  </div>
</div>



        
      </div>
    </div>
  );
}