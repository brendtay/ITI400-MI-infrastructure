import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/googleMapInt.css';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%', // Make it responsive
  height: '400px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // New York City coordinates
};

export default function GoogleMapsIntegration() {
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
    <div className="map-container" style={{ textAlign: 'center' }}>
      {/* Search Bar Container */}
      <div className="search-bar" style={{ marginBottom: '10px', padding: '10px' }}>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter an address"
          className="form-control"
          style={{ display: 'inline-block', width: '300px', marginRight: '10px' }} // Margin right for spacing
        />
        <button onClick={handleSearch} className="btn btn-primary">Search</button>
        <button onClick={handleGetLocation} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Use My Location</button>
      </div>

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
  );
}
