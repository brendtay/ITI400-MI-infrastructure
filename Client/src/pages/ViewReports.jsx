import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { isUserLoggedIn } from "../config/authConfig";
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagesCss/ViewIssues.css';

const ViewIssues = () => {
  // State variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState('nearby'); // 'nearby', 'myReports', 'byId'
  const [coordinates, setCoordinates] = useState(null);
  const [nearbyIssues, setNearbyIssues] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [issueIdInput, setIssueIdInput] = useState('');
  const [issueById, setIssueById] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null); // Reference to the Google Map instance

  // Check if user is logged in
  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isUserLoggedIn();
      if (!loggedIn) {
        alert("You must log in to use this feature.");
        window.location.href = "/login";
      }
      setIsLoggedIn(loggedIn);
    };
    checkLogin();
  }, []);

  // Set minimum height
  useEffect(() => {
    const setMinHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--min-height", `${vh * 110}px`);
    };
    setMinHeight(); // Set height on load
    window.addEventListener("resize", setMinHeight);
    return () => window.removeEventListener("resize", setMinHeight); // Cleanup on unmount
  }, []);

  // Fetch nearby issues when coordinates are set
  useEffect(() => {
    if (coordinates) {
      fetchNearbyIssuesAt(coordinates.lat, coordinates.lng, 10); // Default radius of 10 km
    }
  }, [coordinates]);

  // Fetch user's issues when tab is 'myReports' and user is logged in
  useEffect(() => {
    if (tab === 'myReports' && isLoggedIn) {
      const fetchMyIssues = async () => {
        try {
          const response = await axios.get('/api/issues/user', { withCredentials: true });
          setMyIssues(response.data);
        } catch (error) {
          console.error('Error fetching user issues:', error);
          setError('Failed to fetch your issues.');
        }
      };
      fetchMyIssues();
    }
  }, [tab, isLoggedIn]);

  // Functions
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
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
      fetchNearbyIssuesAt(lat, lng, radius);
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

  const fetchNearbyIssuesAt = async (lat, lng, radius) => {
    try {
      const response = await axios.get(
        `/api/location/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      setNearbyIssues(response.data);
    } catch (error) {
      console.error('Error fetching nearby issues:', error);
      setError('Failed to fetch issues in the current area.');
    }
  };

  const handleIssueIdInputChange = (e) => {
    setIssueIdInput(e.target.value);
  };

  const handleIssueIdLookup = async () => {
    try {
      const response = await axios.get(`/api/issues/${issueIdInput}`);
      setIssueById(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching issue by ID:', error);
      setError('Issue not found.');
      setIssueById(null);
    }
  };

  // Render functions
  const renderNearbyIssues = () => (
    <div>
      <div className="text-center">
        <button className="btn btn-primary mb-3" onClick={getUserLocation}>
          Use My Location
        </button>
        <button className="btn btn-primary mb-3" onClick={handleSearchArea}>
          Search this area
        </button>
      </div>
      {coordinates && (
        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '100%' }}
          center={coordinates}
          zoom={12}
          onLoad={(map) => (mapRef.current = map)}
          onUnmount={() => (mapRef.current = null)}
        >
          {nearbyIssues.map((issue) => {
            const [lat, lng] = issue.gps_coords
              ? issue.gps_coords.split(',').map(Number)
              : [null, null];
            if (lat && lng) {
              return (
                <Marker
                  key={issue.issue_id}
                  position={{ lat, lng }}
                  onClick={() => setSelectedIssue(issue)}
                />
              );
            }
            return null;
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
                <h6>Issue ID: {selectedIssue.issue_id}</h6>
                <p>Type: {selectedIssue.issue_name}</p>
                <p>Description: {selectedIssue.description}</p>
                <p>Status: {selectedIssue.status_name}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );

  const renderMyIssues = () => {
    if (!isLoggedIn) {
      return (
        <p className="text-center">
          Please <a href="/login">log in</a> to view your reported issues.
        </p>
      );
    }
    return (
      <div>
        <h3 className="text-center">Your Reported Issues</h3>
        {myIssues.length === 0 ? (
          <p className="text-center">You have not reported any issues.</p>
        ) : (
          <ul className="list-group">
            {myIssues.map((issue) => (
              <li key={issue.issue_id} className="list-group-item">
                <h5>Issue ID: {issue.issue_id}</h5>
                <p>Type: {issue.issue_name}</p>
                <p>Description: {issue.description}</p>
                <p>Status: {issue.status_name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderIssueById = () => (
    <div>
      <div className="mb-3 text-center">
        <label htmlFor="issueId" className="form-label">
          Enter Issue ID:
        </label>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            id="issueId"
            className="form-control"
            style={{ maxWidth: '300px' }}
            value={issueIdInput}
            onChange={handleIssueIdInputChange}
          />
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-primary mb-3" onClick={handleIssueIdLookup}>
          Lookup Issue
        </button>
      </div>
      {error && <p className="text-danger text-center">{error}</p>}
      {issueById && (
        <div>
          <h5 className="text-center">Issue ID: {issueById.issue_id}</h5>
          <p className="text-center">Type: {issueById.issue_name}</p>
          <p className="text-center">Description: {issueById.description}</p>
          <p className="text-center">Status: {issueById.status_name}</p>
          {issueById.gps_coords && (
            <GoogleMap
              mapContainerStyle={{ height: '400px', width: '100%' }}
              center={{
                lat: parseFloat(issueById.gps_coords.split(',')[0]),
                lng: parseFloat(issueById.gps_coords.split(',')[1]),
              }}
              zoom={15}
            >
              <Marker
                position={{
                  lat: parseFloat(issueById.gps_coords.split(',')[0]),
                  lng: parseFloat(issueById.gps_coords.split(',')[1]),
                }}
              />
            </GoogleMap>
          )}
        </div>
      )}
    </div>
  );

  // Main return
  return (
    <div
      className="d-flex align-items-center justify-content-center view-issues-container"
      style={{ minHeight: '100vh' }}
    >
      <div className="container p-4 border rounded" style={{ maxWidth: '800px' }}>
        <h2 className="text-center mb-4">View Reported Issues</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        {!isLoggedIn && (
          <div className="alert alert-warning text-center mb-4">
            <p>
              You are not logged in. <a href="/login">Log in</a> to access all features.
            </p>
          </div>
        )}
        <div className="mb-4 text-center">
          <button
            className={`btn btn-outline-primary mx-1 ${tab === 'nearby' ? 'active' : ''}`}
            onClick={() => setTab('nearby')}
          >
            View Nearby Issues
          </button>
          <button
            className={`btn btn-outline-primary mx-1 ${tab === 'myReports' ? 'active' : ''}`}
            onClick={() => setTab('myReports')}
          >
            View My Reports
          </button>
          <button
            className={`btn btn-outline-primary mx-1 ${tab === 'byId' ? 'active' : ''}`}
            onClick={() => setTab('byId')}
          >
            Look Up Issue by ID
          </button>
        </div>
        {tab === 'nearby' && renderNearbyIssues()}
        {tab === 'myReports' && renderMyIssues()}
        {tab === 'byId' && renderIssueById()}
      </div>
    </div>
  );
};

export default ViewIssues;