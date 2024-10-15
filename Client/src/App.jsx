import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar'; // Assuming Navbar is a separate component
import Home from './pages/Home'; // Use correct relative paths
import About from './pages/About';
import Footer from  "./components/Footer"; 
import ReportIssueForm from './pages/ReportIusseForm';

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]); // This will store the fetched fruits

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      console.log(response.data.fruits);
      setArray(response.data.fruits); // Update array with the fetched fruits
    } catch (error) {
      console.error("Error fetching the API:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="app-container">
        <Router>
            <Navbar /> {/* Ensure the Navbar is rendered */}
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/form" element={<ReportIssueForm />} />
                </Routes>
            </div>
            <Footer /> {/* Ensure the Footer is rendered */}
        </Router>
    </div>
);
}

export default App;
