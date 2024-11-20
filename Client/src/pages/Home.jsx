import React, { useState } from 'react';
import './pagesCss/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../components/Navbar';
import BackgroundImage from '../components/BackgroundImage';
import HowItWorks from '../components/HowItWorksComponent';
import GoogleMapsIntegration from "../components/GoogleMapsIntegration"; 
import SearchBar from '../components/SearchBar'; 

const defaultCenter = {
  lat: 43.019387852838754,
  lng: -83.6894584432078,
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(defaultCenter);
  const [reportMarkers, setReportMarkers] = useState([]);
  const [error, setError] = useState(null); // Add error state
  // If you have a 'tab' state, you can define it here. For home page, we can set it to 'nearby'.
  const tab = 'home';

  return (
    <div>
      <div className="background-image">
        <BackgroundImage />
      </div>

      <div className="container content-container">
        <div className="row justify-content-center">
          <div className="col-auto">
            <Navbar />
          </div>
        </div>

        <div>
          <HowItWorks />
        </div>

        <div className="row justify-content-center mt-4">
          {/* Adjusted column classes for different screen sizes */}
          <div className="col-12 col-md-12 col-lg-12 col-xl-12">
            {/* Card for Google Maps and Search Bar */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center"><b>Nearby Issues</b></h5>

                {/* Search Bar Section */}
                <SearchBar
                  address={address}
                  setAddress={setAddress}
                  setLocation={setLocation}
                />

                {/* Google Maps Integration Component */}
                <div className="google-map-container mt-4" style={{ height: '100%' }}>
                  <GoogleMapsIntegration
                    location={location}
                    setLocation={setLocation}
                    reportMarkers={reportMarkers}
                    setReportMarkers={setReportMarkers}
                    defaultCenter={defaultCenter} 
                    tab={tab} 
                    error={error}
                    setError={setError}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>   
    </div>
  );
}