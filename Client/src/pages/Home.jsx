import React, { useState } from 'react';
import './pagesCss/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../components/Navbar';
import BackgroundImage from '../components/BackgroundImage';
import HowItWorks from '../components/HowItWorksComponent';
import GoogleMapsIntegration from "../components/GoogleMapsIntegration"; 
import SearchBar from '../components/SearchBar'; 
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 43.019387852838754,
  lng: -83.6894584432078,
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(defaultCenter);
  const [reportMarkers, setReportMarkers] = useState([]);

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
