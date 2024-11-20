import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
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
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [preSignedImageUrl, setPreSignedImageUrl] = useState(null);

  useEffect(() => {
    if (location) {
      fetchReports(location);
    }
  }, [location]);

  useEffect(() => {
    // Fetch pre-signed URL when an issue with an image is selected
    if (selectedIssue && selectedIssue.image_url) {
    
      fetchPreSignedUrl(selectedIssue.image_url);
    } else {
      setPreSignedImageUrl(null);
    }
  }, [selectedIssue]);

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
      setError('Failed to fetch reports.');
    }
  };

  const fetchPreSignedUrl = async (imageUrl) => {
    try {
      // Extract key from the full URL
      const key = imageUrl.split('/').pop(); 
      const response = await axios.get('/api/images/presigned-url', {
        params: { key }
      });
  
      setPreSignedImageUrl(response.data.url);
    } catch (error) {
      setError('Failed to load image.');
    }
  };

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
  };

  return (
    <div className="google-map-container">
      <GoogleMap mapContainerStyle={containerStyle} center={location || defaultCenter} zoom={13}>
        {location && <Marker position={location} />}
        {reportMarkers && reportMarkers.map((issue) => {
          const markerColor = issueTypeColors[issue.issue_name] || 'gray';
          let lat, lng;

          try {
            [lat, lng] = issue.gps_coords.split(',').map(Number);
            if (isNaN(lat) || isNaN(lng)) {
              throw new Error('Invalid GPS coordinates');
            }
          } catch (error) {
            console.error('[ERROR] Error parsing GPS coordinates:', error.message);
            return null; // Skip rendering this marker if there’s an error
          }

          return (
            <Marker
              key={issue.issue_id}
              position={{ lat, lng }}
              icon={{
                url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`,
              }}
              onClick={() => handleMarkerClick(issue)}
            />
          );
        })}
        {selectedIssue && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedIssue.gps_coords.split(',')[0]),
              lng: parseFloat(selectedIssue.gps_coords.split(',')[1]),
            }}
            onCloseClick={() => setSelectedIssue(null)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>ID: {selectedIssue.issue_id}</span>
                <button 
                  onClick={() => setSelectedIssue(null)} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '1.2rem', 
                    lineHeight: '1',
                    padding: 0 
                  }}
                >
                  &times;
                </button>
              </div>
              <p><strong>Type:</strong> {selectedIssue.type_name}</p>
              <p><strong>Status:</strong> {selectedIssue.status_name}</p>
              <p><strong>Description:</strong> {selectedIssue.description}</p>
              {preSignedImageUrl && (
                <>
                  <p><strong>Image Preview:</strong></p>
                  <img src={preSignedImageUrl} alt="Issue" style={{ width: '200px', height: 'auto' }} />
                </>
              )}
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
};