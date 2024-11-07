import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar'; // Assuming Navbar is a separate component
import Home from './pages/Home'; // Use correct relative paths
import About from './pages/About';
import Footer from  "./components/Footer"; 
import ReportIssueForm from './pages/ReportIusseForm';
import Login from './pages/Login';
import "../src/App.css"
import { FormText } from 'react-bootstrap';


function App() {
  const [array, setArray] = useState([]); // This will store the fetched fruits
  const [loading, setLoading] = useState(true); // Loading state to prevent render until data is fetched

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      console.log(response.data.fruits);
      setArray(response.data.fruits); // Update array with the fetched fruits
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching the API:", error);
      setLoading(false); // Stop loading in case of error
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return loading ? (
    <div>Loading...</div> // Show a loading state until data is fetched
  ) : (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Router>
        <Navbar/>
        <div className="flex-grow-1" style={{ overflowY: 'auto' }}> {/* Main content area */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/form" element={<ReportIssueForm />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
     
      </Router>
    </div>
  );
}

export default App;
