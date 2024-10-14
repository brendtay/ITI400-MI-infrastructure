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
      <div className="container text-center my-4">
        <div style={{ color: 'white', fontSize: '40px' }}>
          <b>Report Public Infrastructure Issues</b>
        </div>
      </div>

      <div style={{ margin: 0, padding: 0 }}>
        <BackgroundImage />
      </div>

      {/* Main Container for Navbar */}
      <div className="container"> 
        <div className="row justify-content-center">
          <div className="col-auto">
            <Navbar />
          </div>
        </div>

        <div>
          <HowItWorks />
        </div>

        {/* Flexbox layout to ensure GoogleMapInt and SearchBar are the same size */}
        <div className="d-flex justify-content-between">
  <div className="flex-fill" style={{ marginRight: '1rem' }}>
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
  <div className="flex-fill" style={{ maxWidth: '300' }}> {/* Set a max width here too */}
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
