import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isUserLoggedIn, logoutUser } from '../config/authConfig';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [username, setUsername] = useState(null); 
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        if (loggedIn) {
          const response = await axios.get('/api/users/me', { withCredentials: true });
          setUsername(response.data.username);
        } else {
          setUsername(null);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setUsername(null);
      }
    };

    fetchUserInfo();
  }, [location]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUsername(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
      <div className="container-fluid px-3">
        {/* Home Icon */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="fas fa-home me-2"></i> {/* Font Awesome home icon */}
        </Link>
  
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-Aligned Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
  <li className="nav-item">
    <Link className="nav-link p-1" aria-current="page" to="/form">Report An Issue</Link>
  </li>
  <span className="text-light mx-2">|</span> {/* Separator */}
  <li className="nav-item">
    <Link className="nav-link p-1" to="/viewreports">View Reports</Link>
  </li>
  <span className="text-light mx-2">|</span> {/* Separator */}
  <li className="nav-item">
    <Link className="nav-link p-1" to="/about">About Us</Link>
  </li>
</ul>
  
          {/* Right-Aligned User Login/Logout Section */}
          <ul className="navbar-nav ms-auto">
            {username ? (
              <>
                <li className="nav-item d-flex align-items-center">
                  <span className="navbar-text me-2">Welcome, {username}!</span>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Want To Logout?
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm" to="/login">Log In</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert" style={{ margin: 0 }}>
          {error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
