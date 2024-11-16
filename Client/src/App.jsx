import axios from "axios";
// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL; // Set the base API URL from .env
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
import { LoadScript } from '@react-google-maps/api';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar'; // Assuming Navbar is a separate component
import Home from './pages/Home'; // Use correct relative paths
import About from './pages/About';
import Footer from  "./components/Footer"; 
import ReportIssueForm from './pages/ReportIssueForm';
import Login from './pages/Login';
import GoogleMapsIntegration from './components/GoogleMapsIntegration';
import "../src/App.css"
import { FormText } from 'react-bootstrap';

function App() {
  const [loading, setLoading] = useState(true); // For loading state
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  console.log("Google Maps API Key:", key);

  // Fetch API Status
  const fetchAPIStatus = async () => {
    try {
        const response = await axios.get('/status'); 
        const { status, message, timestamp } = response.data; 
        console.log(`API connection successful: Status - ${status}, Message - ${message}, Timestamp - ${timestamp}`);
    } catch (error) {
        console.error("Error connecting to the API:", error);
    } finally {
        setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
      fetchAPIStatus(); // Check API connection on load
  }, []);


  return loading ? (
    <div>Loading...</div> // Show a loading state until data is fetched
  ) : (
    <LoadScript
      googleMapsApiKey={key} // Inject Google Maps API key globally
      onLoad={() => console.log('Google Maps API Loaded Successfully')}
      onError={(error) => console.error('Error loading Google Maps API:', error)}
    >
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Router>
          <Navbar />
          <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
            {/* Main content area */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/form" element={<ReportIssueForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/maps" element={<GoogleMapsIntegration />} />
            </Routes>
          </div>
        </Router>
      </div>
    </LoadScript>
  );
};

export default App;
