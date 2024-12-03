// Updated GoogleMapsIntegration.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/googleMapInt.css';

const containerStyle = {
  width: '100%', // Fully responsive width
  height: '40vh', // Consistent height
};

const issueTypeColors = {
  'Pothole': 'red',
  'Damaged streetlight': 'yellow',
  'Damaged road': 'blue',
  'Damaged sidewalk': 'green',
  'Drainage issue': 'purple',
  'Other': 'orange',
};

export default function GoogleMapsIntegration({
  location,
  setLocation,
  reportMarkers,
  setReportMarkers,
  error,
  setError,
  defaultCenter,
  tab,
}) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [preSignedImageUrl, setPreSignedImageUrl] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (location) {
      fetchReports(location);
    }
  }, [location]);

  const fetchReports = async (center, radius = 10) => {
    try {
      const response = await axios.get('/api/location/nearby', {
        params: {
          lat: center.lat,
          lng: center.lng,
          radius,
        },
      });
      const markers = response.data.map((issue) => ({
        ...issue,
        lat: parseFloat(issue.gps_coords.split(',')[0]),
        lng: parseFloat(issue.gps_coords.split(',')[1]),
      }));
      setReportMarkers(markers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports.');
    }
  };

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
  };

  return (
    <div className="google-map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || defaultCenter}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
        onUnmount={() => (mapRef.current = null)}
      >
        {reportMarkers.map((issue) => (
          <Marker
            key={issue.issue_id}
            position={{ lat: issue.lat, lng: issue.lng }}
            icon={{
              url: `http://maps.google.com/mapfiles/ms/icons/${
                issueTypeColors[issue.issue_name] || 'gray'
              }-dot.png`,
            }}
            onClick={() => handleMarkerClick(issue)}
          />
        ))}
        {selectedIssue && (
          <InfoWindow
            position={{ lat: selectedIssue.lat, lng: selectedIssue.lng }}
            onCloseClick={() => setSelectedIssue(null)}
          >
            <div>
              <h5>Issue ID: {selectedIssue.issue_id}</h5>
              <p>Type: {selectedIssue.issue_name}</p>
              <p>Status: {selectedIssue.status_name}</p>
              <p>Description: {selectedIssue.description}</p>
            </div>
          </InfoWindow>
        )}
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
  error: PropTypes.string,
  setError: PropTypes.func.isRequired,
  defaultCenter: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
};
