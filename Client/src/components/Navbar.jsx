import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
      <div className="container-fluid px-2"> {/* Adjust padding as needed */}
        <Link className="navbar-brand p-2" to="/">MI-Infrastructure</Link> {/* Smaller padding */}
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
              <Link className="nav-link p-1" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link p-1" to="/resources">Resources</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link p-1" to="/login">Log In</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;
