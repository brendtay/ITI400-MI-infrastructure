import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/componentCss/googleMapInt.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const issueTypeColors = {
  'Pothole': 'red',
  'Damaged streetlight': 'yellow',
  'Damaged road': 'blue',
  'Damaged sidewalk': 'green',
  'Drainage issue': 'purple',
  'Other': 'orange'
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
    if (location && (tab === 'nearby' || tab === 'home')) {
      fetchReports(location);
    }
  }, [location, tab]);

  useEffect(() => {
    // Fetch pre-signed URL when an issue with an image is selected
    if (selectedIssue && selectedIssue.image_url) {
      fetchPreSignedUrl(selectedIssue.image_url);
    } else {
      setPreSignedImageUrl(null);
    }
  }, [selectedIssue]);

  const fetchReports = async (center, radius = 10) => {
    try {
      const response = await axios.get('/api/location/nearby', {
        params: {
          lat: center.lat,
          lng: center.lng,
          radius: radius, // Use the passed radius
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
    console.log('[DEBUG] Selected Marker Details:', issue);
    setSelectedIssue(issue);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error obtaining location:", error.message);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access was denied. Please enable it in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get your location timed out.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSearchArea = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const lat = center.lat();
      const lng = center.lng();

      const bounds = mapRef.current.getBounds();
      const ne = bounds.getNorthEast();

      const radius = computeRadius(lat, lng, ne.lat(), ne.lng());
      fetchReports({ lat, lng }, radius);
      // Update location to new center
      setLocation({ lat, lng });
    } else {
      alert('Map is not ready yet.');
    }
  };

  const computeRadius = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // Distance in km
  };

  return (
    <div className="google-map-container">
      {tab === 'nearby' && (
        <div className="text-center mb-3">
          <button className="btn btn-primary mx-1" onClick={getUserLocation}>
            Use My Location
          </button>
          <button className="btn btn-primary mx-1" onClick={handleSearchArea}>
            Search this area
          </button>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || defaultCenter}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
        onUnmount={() => (mapRef.current = null)}
      >
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
            <div className="info-window-container">
              {/* Text Content */}
              <div className="info-window-text">
                <div className="info-window-header">
                  <h5 className="info-window-id">Issue ID: {selectedIssue.issue_id}</h5>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="info-window-close"
                  >
                  </button>
                </div>
                <p className="info-window-detail"><strong>Type:</strong> {selectedIssue.issue_name}</p>
                <p className="info-window-detail"><strong>Status:</strong> {selectedIssue.status_name}</p>
                <p className="info-window-detail"><strong>Description:</strong> {selectedIssue.description}</p>
                <p className="info-window-detail"><strong>Reporter:</strong> {selectedIssue.reported_by}</p>
              </div>
              {/* Image Content */}
              {preSignedImageUrl && (
                <div className="info-window-image">
                  <img
                    src={preSignedImageUrl}
                    alt="Issue"
                    className="info-window-img"
                  />
                </div>
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
  error: PropTypes.string,
  setError: PropTypes.func.isRequired,
  defaultCenter: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
};