import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/googleMapInt.css';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '800px',
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

  return (
    <div className="map-container" style={{ position: 'relative', textAlign: 'center' }}>
      {/* Search Bar */}
      <div className="search-bar" style={{ position: 'absolute', top: '10px', left: '50%', bottom: '50px', transform: 'translateX(-50%)', zIndex: 10 }}>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter an address"
          className="form-control"
          style={{ display: 'inline-block', width: '300px', marginRight: '10px' }} // Add margin-right for spacing
        />
        <button onClick={handleSearch} className="btn btn-primary">Search</button>
      </div>
      
      {/* Gap Between Search Bar and Map */}
      <div style={{ height: '70px' }} /> {/* Adjust height for desired gap */}
      
      {/* Google Map */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={13}
        >
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
