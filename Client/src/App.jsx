import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar'; // Assuming Navbar is a separate component
import Home from './pages/Home'; // Use correct relative paths
import About from './pages/About';

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
    <Router>
      <Navbar /> {/* Ensure the Navbar is rendered */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
