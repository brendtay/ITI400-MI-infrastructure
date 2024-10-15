import React, { useState } from 'react';
import './pagesCss/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../components/Navbar';
import BackgroundImage from '../components/BackgroundImage';
import HowItWorks from '../components/HowItWorks';
import GoogleMapInt from "../components/GoogleMapsIntergration"; // Optional if you want to keep this component for rendering the map separately
import SearchBar from '../components/SearchBar'; // Import the SearchBar component
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%', // Make it responsive
  height: '400px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // New York City coordinates
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
      {/* Main Container for the Title */}
      <div>
        <BackgroundImage />
      </div>

      {/* Main Container for Navbar */}
      <div className="container"> 
        <div className="row justify-content-center">
          <div className="col-auto">
         
          </div>
        </div>

        <div>
          <HowItWorks />
        </div>

{/* Flexbox layout to ensure GoogleMap and SearchBar occupy 60% and 40% of the container */}
<div className="d-flex justify-content-between align-items-center" style={{ margin: '1rem 0' }}>
  <div className="flex-fill" style={{ flex: '0 0 60%', height: '400px' }}>
    {/* Google Map Container */}
    <LoadScript googleMapsApiKey={apiKey}>
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={13}
        >
          <Marker position={location} />
        </GoogleMap>
      </div>
    </LoadScript>
  </div>
  <div className="flex-fill" style={{ flex: '0 0 40%', maxWidth: '400px' }}> {/* Set a max width here too */}
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
  );
}
