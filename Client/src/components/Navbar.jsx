import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { username, fetchUserInfo, setUsername } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate (); 
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, { withCredentials: true });
      setUsername(null); 
      navigate.push('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
      <div className="container-fluid px-3">
        <Link className="navbar-brand p-3" to="/">MI-Infrastructure</Link>
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active p-1" aria-current="page" to="/form">Report An Issue</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link p-1" to="/viewreports">View Reports</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link p-1" to="/about">About Us</Link>
            </li>
            
            {username ? (
              <>
                <li className="nav-item">
                  <span className="nav-link p-1">Welcome, {username}!</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link p-1" onClick={handleLogout} style={{ textDecoration: 'none' }}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link p-1" to="/login">Log In</Link>
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
}

export default Navbar;
