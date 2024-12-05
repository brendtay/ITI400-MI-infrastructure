import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isUserLoggedIn } from "../config/authConfig";
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagesCss/ViewIssues.css';
import GoogleMapsIntegration from '../components/GoogleMapsIntegration';
import logo from '../images/Mi-InfraLogo.png';

const ViewIssues = () => {
  // Default center coordinates
  const defaultCenter = {
    lat: 43.019387852838754,
    lng: -83.6894584432078,
  };

  // State variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState(defaultCenter);
  const [tab, setTab] = useState('nearby');
  const [reportMarkers, setReportMarkers] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [issueIdInput, setIssueIdInput] = useState('');
  const [issueById, setIssueById] = useState(null);
  const [error, setError] = useState(null);

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

  // Fetch nearby issues
  useEffect(() => {
    if (tab === 'nearby' && location) {
      const fetchNearbyIssues = async () => {
        try {
          const response = await axios.get('/api/location/nearby', {
            params: {
              lat: location.lat,
              lng: location.lng,
              radius: 10,
            },
          });

          const markers = response.data.map((issue) => ({
            ...issue,
            lat: parseFloat(issue.gps_coords.split(',')[0]),
            lng: parseFloat(issue.gps_coords.split(',')[1]),
          }));

          setReportMarkers(markers);
          setError(null);
        } catch (error) {
          console.error('Error fetching nearby issues:', error);
          setError('Failed to fetch nearby issues.');
        }
      };

      fetchNearbyIssues();
    }
  }, [tab, location]);

  // Fetch user's issues
  useEffect(() => {
    if (tab === 'myReports' && isLoggedIn) {
      const fetchMyIssues = async () => {
        try {
          const response = await axios.get('/api/issues/user');
          const issues = response.data;

          // For each issue, fetch the pre-signed URL if image_url exists
          const issuesWithImages = await Promise.all(issues.map(async (issue) => {
            if (issue.image_url) {
              try {
                const key = issue.image_url.split('/').pop();
                const presignedResponse = await axios.get('/api/images/presigned-url', {
                  params: { key }
                });
                issue.preSignedImageUrl = presignedResponse.data.url;
              } catch (err) {
                console.error('Failed to fetch image for issue', issue.issue_id);
                issue.preSignedImageUrl = null;
              }
            }
            return issue;
          }));

          setMyIssues(issuesWithImages);
          setError(null);
        } catch (error) {
          console.error('Error fetching user issues:', error);
          setError('Failed to fetch your reported issues.');
        }
      };

      fetchMyIssues();
    }
  }, [tab, isLoggedIn]);

  // Functions
  const handleIssueIdInputChange = (e) => {
    setIssueIdInput(e.target.value);
  };

  const handleIssueIdLookup = async () => {
    try {
      const response = await axios.get(`/api/issues/${issueIdInput}`);
      const issue = response.data;

      // Fetch pre-signed URL if image_url exists
      if (issue.image_url) {
        try {
          const key = issue.image_url.split('/').pop();
          const presignedResponse = await axios.get('/api/images/presigned-url', {
            params: { key }
          });
          issue.preSignedImageUrl = presignedResponse.data.url;
        } catch (err) {
          console.error('Failed to fetch image for issue', issue.issue_id);
          issue.preSignedImageUrl = null;
        }
      }

      setIssueById(issue);
      setError(null);
    } catch (error) {
      console.error('Error fetching issue by ID:', error);
      setError('Issue not found.');
      setIssueById(null);
    }
  };

  // Helper function to format date as yyyy-mm-dd
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Render functions
  const renderNearbyIssues = () => (
    <div className="google-maps-container mb-3">
  <GoogleMapsIntegration
    location={location}
    setLocation={setLocation}
    reportMarkers={reportMarkers}
    setReportMarkers={setReportMarkers}
    error={error}
    setError={setError}
    defaultCenter={defaultCenter}
    tab="nearby"
  />
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
                <div className="info-window-container">
                  <div className="info-window-text">
                    <div className="info-window-header">
                      <h5 className="info-window-id">Issue ID: {issue.issue_id}</h5>
                    </div>
                    <p className="info-window-detail"><strong>Type:</strong> {issue.issue_name}</p>
                    <p className="info-window-detail"><strong>Status:</strong> {issue.status_name}</p>
                    <p className="info-window-detail"><strong>Description:</strong> {issue.description}</p>
                    <p className="info-window-detail">
                      <strong>Reported on:</strong> {formatDate(issue.created_time)}
                    </p>
                    <p className="info-window-detail">
                      <strong>Updated on:</strong> {formatDate(issue.updated_time)}
                    </p>
                  </div>
                  {issue.preSignedImageUrl && (
                    <div className="info-window-image">
                      <img
                        src={issue.preSignedImageUrl}
                        alt="Issue"
                        className="info-window-img"
                      />
                    </div>
                  )}
                </div>
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
        <div className="list-group-item">
          <div className="info-window-container">
            <div className="info-window-text">
              <div className="info-window-header">
                <h5 className="info-window-id">Issue ID: {issueById.issue_id}</h5>
              </div>
              <p className="info-window-detail"><strong>Type:</strong> {issueById.issue_name}</p>
              <p className="info-window-detail"><strong>Status:</strong> {issueById.status_name}</p>
              <p className="info-window-detail"><strong>Description:</strong> {issueById.description}</p>
              <p className="info-window-detail">
                <strong>Reported on:</strong> {formatDate(issueById.created_time)}
              </p>
              <p className="info-window-detail">
                <strong>Updated on:</strong> {formatDate(issueById.updated_time)}
              </p>
              <p className="info-window-detail">
                <strong>Reporter:</strong> {issueById.reported_by}
              </p>
            </div>
            {issueById.preSignedImageUrl && (
              <div className="info-window-image">
                <img
                  src={issueById.preSignedImageUrl}
                  alt="Issue"
                  className="info-window-img"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
  // Main return
  return (
    <div className="report-issue-container">
      <div className="container p-4 border rounded" style={{ maxWidth: '800px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="MI-Infrastructure Logo"
            style={{ maxWidth: '400px' }}
          />
        </div>
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
  