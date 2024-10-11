import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Corrected the typo

import '../components/componentCss/custom.css'

// Import the background image properly
import background from '../images/background-image.jpg'; // Ensure the correct path to the image

// Import Container from react-bootstrap if you're using it
import { Container } from 'react-bootstrap'; 


export default function BackgroundImage() {
    return (
        <div
        className="masthead"
        style={{
          backgroundImage: `url(${background})`, // Background image
          backgroundSize: 'cover', // Ensure it covers the full width and height
          backgroundPosition: 'top center', // Position the image at the top center
          width: '100vw', // 100% of the viewport width
          height: '80vh', // Adjust this value to set how much height the image should take (e.g., 50% of viewport height)
          position: 'relative', // Positioning for the overlay
          top: 0, // Stick to the top of the viewport
          zIndex: 1, // Set z-index lower than navbar
        }}
      >
        <div className='color-overlay d-flex flex-column justify-content-center align-items-center'>  
        
          {/* Centered Text Above Buttons */}
          <h1 className="text-white mb-4 text-center">Report Public Infrastructure Issues</h1>
          
          {/* Wrapper for limiting text width */}
          <div style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h3 className="text-white mb-4">Help us keep our community safe and well-maintained by reporting issues like potholes, broken sidewalks, and more. Your input makes a difference!</h3>
          </div>
          
          {/* Button Container with side-by-side buttons */}
          <div className="button-container d-flex justify-content-center">
            <button className="btn btn-primary btn-lg mx-2">Report An Issue Now</button>
            <button className="btn btn-secondary btn-lg mx-2">Check In On A Report</button>
          </div>

        </div>
      </div>
    );
}
