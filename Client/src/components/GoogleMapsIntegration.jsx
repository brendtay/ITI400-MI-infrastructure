import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker } from '@react-google-maps/api';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/googleMapInt.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 43.019387852838754,
  lng: -83.6894584432078,
};

const issueTypeColors = {
  'Pothole': 'red',
  'Damaged streetlight': 'yellow',
  'Damaged road': 'blue',
  'Damaged sidewalk': 'green',
  'Drainage issue': 'purple',
  'Other': 'orange'
};

export default function GoogleMapsIntegration({ location, setLocation, reportMarkers, setReportMarkers }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      fetchReports(location);
    }
  }, [location]);

  const fetchReports = async (center) => {
    try {
      const response = await axios.get('/api/location/nearby', {
        params: {
          lat: center.lat,
          lng: center.lng,
          radius: 10, // Default radius of 10 km
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
    <div className="google-map-container">
      <GoogleMap mapContainerStyle={containerStyle} center={location || defaultCenter} zoom={13}>
        {location && <Marker position={location} />}
        {reportMarkers && reportMarkers.map((issue) => {
          const markerColor = issueTypeColors[issue.issue_name] || 'gray';
          return (
            <Marker
              key={issue.issue_id}
              position={{
                lat: parseFloat(issue.gps_coords.split(',')[0]),
                lng: parseFloat(issue.gps_coords.split(',')[1]),
              }}
              icon={{
                url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`,
              }}
            />
          );
        })}
      </GoogleMap>
      {error && <p className="text-danger text-center mt-3">{error}</p>}
    </div>
  );
}

GoogleMapsIntegration.propTypes = {
  location: PropTypes.object,
  setLocation: PropTypes.func.isRequired,
  reportMarkers: PropTypes.array.isRequired,
  setReportMarkers: PropTypes.func.isRequired,
};
