import React, { useState } from 'react';
import './pagesCss/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../components/Navbar';

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
      <div className="cScontent-container mt-5  " >
        {/* Welcome Section */}
        <div className="row justify-content-center mt-4">
          <div className="col-auto text-center">
            {/* Logo */}
            <img 
              src={logo} 
              alt="MI-Infrastructure Logo" 
              style={{ maxWidth: '600px', marginBottom: '20px' }} 
            />
            <h1><b>Welcome to MI-Infrastructure</b></h1>
            <p className="mt-3 mb-3">
              <b>Report infrastructure issues like potholes, broken sidewalks, or streetlights with ease.</b>
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
  <div className="button-container d-flex flex-column flex-md-row justify-content-center">
    <button className="btn btn-primary btn-lg mx-2 mb-2 mb-md-0" onClick={() => navigate('/form')}>
      Report An Issue Now
    </button>
    <button className="btn btn-secondary btn-lg mx-2" onClick={() => navigate('/viewreports')}>
      Check In On A Report
    </button>
  </div>
</div>

        {/* How It Works Section */}
<div className="custom-card-container mt-4">
  <HowItWorks />
</div>
{/* Google Maps and Search Bar Section */}
<div className="custom-card-container mt-4">
  <div className="card-body">
    <h5 className="card-title text-center"><b>View Nearby Issues</b></h5>

    {/* Search Bar */}
    <SearchBar
      address={address}
      setAddress={setAddress}
      setLocation={setLocation}
    />

    {/* Google Maps */}
    <div className="google-map-container mt-4">
      <GoogleMapsIntegration
        location={location}
        setLocation={setLocation}
        reportMarkers={reportMarkers}
        setReportMarkers={setReportMarkers}
        defaultCenter={defaultCenter}
        error={error}
        setError={setError}
      />
    </div>
  </div>
</div>

        
      </div>
    </div>
  );
}
