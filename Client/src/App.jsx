import axios from "axios";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Footer from "./components/Footer";
import ReportIssueForm from './pages/ReportIssueForm';
import Login from './pages/Login';
import GoogleMapsIntegration from './components/GoogleMapsIntegration';
import "../src/App.css";
import ViewReports from './pages/ViewReports';

// Error Boundary Component to handle and display errors gracefully
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong: {this.state.errorMessage}</h2>;
    }
    return this.props.children;
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Configure Axios defaults
  axios.defaults.baseURL = "https://www.mi-infrastructure.com";
  axios.defaults.withCredentials = true;

  // Fetch API Status
  const fetchAPIStatus = async () => {
    try {
      const response = await axios.get('/api/status'); 
      const { status, message, timestamp } = response.data; 
      console.log(`API connection successful: Status - ${status}, Message - ${message}, Timestamp - ${timestamp}`);
    } catch (error) {
      console.error("Error connecting to the API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPIStatus();
  }, []);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <ErrorBoundary>
      <LoadScript
        googleMapsApiKey={key}
        libraries={['places']} // Ensure 'places' library is loaded for Autocomplete
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
                <Route path="/viewreports" element={<ViewReports />} /> 
              </Routes>
            </div>
           
          </Router>
        </div>
      </LoadScript>
    </ErrorBoundary>
  );
}

export default App;
