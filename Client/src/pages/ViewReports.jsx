import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagesCss/ViewIssues.css';

const ViewIssues = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState('nearby'); // 'nearby', 'myReports', 'byId'
  const [coordinates, setCoordinates] = useState(null);
  const [nearbyIssues, setNearbyIssues] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [issueIdInput, setIssueIdInput] = useState('');
  const [issueById, setIssueById] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/check-login', { withCredentials: true });
        setIsLoggedIn(response.data.status === 'logged_in');
      } catch (err) {
        console.error("Error checking login status:", err);
      }
    };
    checkLoginStatus();
  }, []);

  // Function to get user's device location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          console.log("Location obtained:", latitude, longitude);
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

  // Fetch nearby issues when coordinates are set
  useEffect(() => {
    if (coordinates) {
      const fetchNearbyIssues = async () => {
        try {
          const radius = 10; // Radius in km
          const response = await axios.get(`/api/issues/nearby?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${radius}`);
          setNearbyIssues(response.data);
        } catch (error) {
          console.error('Error fetching nearby issues:', error);
          setError('Failed to fetch nearby issues.');
        }
      };
      fetchNearbyIssues();
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

  // Handle issue ID lookup
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

  const renderNearbyIssues = () => {
    return (
      <div>
        <button className="btn btn-primary mb-3" onClick={getUserLocation}>Use My Location</button>
        {coordinates && (
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            center={coordinates}
            zoom={12}
          >
            {nearbyIssues.map(issue => {
              const [lat, lng] = issue.gps_coords ? issue.gps_coords.split(',').map(Number) : [null, null];
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
  };

  const renderMyIssues = () => {
    if (!isLoggedIn) {
      return <p>Please <a href="/login">log in</a> to view your reported issues.</p>;
    }
    return (
      <div>
        <h3>Your Reported Issues</h3>
        {myIssues.length === 0 ? (
          <p>You have not reported any issues.</p>
        ) : (
          <ul className="list-group">
            {myIssues.map(issue => (
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

  const renderIssueById = () => {
    return (
      <div>
        <div className="mb-3">
          <label htmlFor="issueId" className="form-label">Enter Issue ID:</label>
          <input
            type="text"
            id="issueId"
            className="form-control"
            value={issueIdInput}
            onChange={(e) => setIssueIdInput(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mb-3" onClick={handleIssueIdLookup}>Lookup Issue</button>
        {error && <p className="text-danger">{error}</p>}
        {issueById && (
          <div>
            <h5>Issue ID: {issueById.issue_id}</h5>
            <p>Type: {issueById.issue_name}</p>
            <p>Description: {issueById.description}</p>
            <p>Status: {issueById.status_name}</p>
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
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">View Reported Issues</h2>
      <div className="mb-4">
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
  );
};

export default ViewIssues;
