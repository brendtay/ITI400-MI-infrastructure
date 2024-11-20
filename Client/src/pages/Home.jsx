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
  lng: -83.6894584432078
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(defaultCenter);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ lat: lat(), lng: lng() });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          alert('Unable to retrieve your location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

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
                
                {/* Google Maps Integration Component */}
                <div className="google-map-container mt-4" style={{ height: '500px' }}>
                  <GoogleMapsIntegration />
                </div>

                {/* Search Bar Section */}
                <div className="search-bar-container mt-3">
                  <SearchBar
                    address={address}
                    onAddressChange={handleAddressChange}
                    onSearch={handleSearch}
                    onGetLocation={handleGetLocation}
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
