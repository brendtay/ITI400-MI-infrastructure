import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [username, setUsername] = useState(null); // State to hold the logged-in username

  useEffect(() => {
    // Function to fetch user info
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/check-login', { withCredentials: true });
        if (response.data.status === 'logged_in') {
          setUsername(response.data.user.username); // Assuming the response has `user` object with `username`
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

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
              <Link className="nav-link p-1" to="/viewreports">Veiw Reports</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link p-1" to="/about">About Us</Link>
            </li>
            
            {username ? (
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle p-1" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {username}
                </Link>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/logout">Log Out</Link></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link p-1" to="/login">Log In</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
