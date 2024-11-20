import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/googleMapInt.css';
import SearchBar from './SearchBar';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%', 
  height: '100%' 
};

const defaultCenter = {
  lat: 43.019387852838754,
  lng: -83.6894584432078,
};

export default function GoogleMapsIntegration() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(defaultCenter);
  const [reportMarkers, setReportMarkers] = useState([]); // State to hold nearby report markers
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        () => console.warn('Geolocation unavailable, using default center.')
      );
    }
  }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSearch = () => {
    if (!window.google?.maps) {
      alert('Google Maps API not loaded');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, async (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        const newLocation = { lat: lat(), lng: lng() };
        setLocation(newLocation);
        await fetchReports(newLocation); // Fetch local reports based on new location
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const handleGetLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          await fetchReports(newLocation); // Fetch local reports based on new location
        },
        (error) => {
          alert('Unable to retrieve your location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const fetchReports = async (center) => {
    try {
      const radius = 10; // Adjust search radius as needed (in km)
      const response = await axios.get(`/api/issues/search`, {
        params: {
          lat: center.lat,
          lng: center.lng,
          radius,
        },
      });
      setReportMarkers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching local reports:', err);
      setError('Failed to fetch reports.');
    }
  };

  return (
    <div className="map-container" style={{ textAlign: 'center', height: '100%' }}>
      <SearchBar 
        address={address} 
        onAddressChange={handleAddressChange} 
        onSearch={handleSearch} 
        onGetLocation={handleGetLocation} 
      />
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={13}
        >
          <Marker position={location} />
          {reportMarkers.map((issue) => (
            <Marker 
              key={issue.issue_id} 
              position={{ 
                lat: parseFloat(issue.gps_coords.split(',')[0]), 
                lng: parseFloat(issue.gps_coords.split(',')[1])
              }} 
            />
          ))}
        </GoogleMap>
      </div>
      {error && <p className="text-danger text-center mt-3">{error}</p>}
    </div>
  );
}
