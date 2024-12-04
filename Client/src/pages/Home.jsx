import React, { useState } from 'react';
import './pagesCss/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import HowItWorks from '../components/HowItWorksComponent';
import GoogleMapsIntegration from "../components/GoogleMapsIntegration";
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import logo from '../images/Mi-InfraLogo.png'; // Adjust the path based on your file structure

const defaultCenter = {
  lat: 43.019387852838754,
  lng: -83.6894584432078,
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(defaultCenter);
  const [reportMarkers, setReportMarkers] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  return (
    <div>
      <div className="Scontent-container mt-5">
        {/* Logo Section */}
        <div className="row justify-content-center mt-4">
          <div className="logo-container col-auto text-center">
            <img 
              src={logo} 
              alt="MI-Infrastructure Logo" 
              style={{height: 'auto', marginBottom: '30px', marginTop: '50px' }} 
            />
          </div>
        </div>

{/* Combined Tagline and Action Buttons Section */}
<div className="row justify-content-center mt-4 mb-3">
  <div className="col-10">
    <div className="text-center p-4">
      <h1 className="display-4"><b>A Better Way To Report Issues</b></h1>
      <h3>Moving infrastructure reporting into the future</h3>
      <div className="d-flex justify-content-center mt-4">
        <Link to="/viewreports" className="btn btn-primary btn-lg me-2">
          Want to view reports?
        </Link>
        <Link to="/form" className="btn btn-secondary btn-lg ms-2">
          Want to submit a report?
        </Link>
      </div>
    </div>
  </div>
</div>



{/* Mission Statement Section */}
<div className="row justify-content-center mt-4">
  <div className="col-10 text-center">
    <div className="mission-statement mx-auto" style={{ maxWidth: '800px' }}>
      <h4>Our Mission Statement</h4>
      <p>
        At MI-Infrastructure, our mission is to empower residents to enhance their communities by providing an easy-to-use platform for reporting infrastructure issues.
        We strive to simplify the process of submitting reports, allowing users to include GPS locations and photos, describe problems, and track the progress of their submissions.
        By fostering transparency and accessibility, we connect users directly with the Federal Department of Transport, MDOT, and the City of Flint, ensuring that every voice is heard without
        requiring specialized knowledge of local authorities. Together, we can create safer, more resilient infrastructure for all.
      </p>
    </div>
  </div>
</div>



        {/* How It Works Section */}
        <div className="row justify-content-center mt-4">
          <div className="col-10">
            <div className="custom-card-container">
            
              <HowItWorks />
            </div>
          </div>
        </div>

       {/* Product in Action Section */}
{/* Product in Action Section */}
<div className="row justify-content-center mt-4">
  <div className="col-10">
    <div className="custom-card-container text-center">
      <h4>Our Product in Action</h4>
      <div className="d-flex flex-column align-items-center">
        <div className="search-bar-container mb-4" style={{ width: '100%', maxWidth: '500px' }}>
          <SearchBar
            address={address}
            setAddress={setAddress}
            setLocation={setLocation}
          />
        </div>
        <div className="google-map-container">
  <GoogleMapsIntegration
    location={location}
    setLocation={setLocation}
    reportMarkers={reportMarkers}
    setReportMarkers={setReportMarkers}
    defaultCenter={defaultCenter}
    error={error}
    setError={setError}
    tab="nearby" // Pass 'nearby' to fetch nearby issues
  />
</div>

      </div>
    </div>
  </div>
</div>

{/* Future Partners Section */}
<div className="row justify-content-center mt-4">
  <div className="col-10">
    <div className="custom-card-container">
      <h5 className="text-center mb-4">Our Future Partners</h5> {/* Main card title */}
      <div className="row">
        {/* Subcard 1: Local Governments */}
        <div className="col-12 col-md-6 col-lg-4 p-3 d-flex">
          <div className="card p-3 w-100 h-100">
            <p><b>Local Governments</b></p>
            <p>Examples: City of Flint, Genesee County</p>
            <p><b>Role:</b> Collaborate for timely response and resolution of infrastructure issues; provide funding or grants.</p>
            <p><b>Benefits:</b> Builds trust and ensures actionable responses to reports.</p>
          </div>
        </div>
        {/* Subcard 2: State Departments of Transportation */}
        <div className="col-12 col-md-6 col-lg-4 p-3 d-flex">
          <div className="card p-3 w-100 h-100">
            <p><b>State Departments of Transportation</b></p>
            <p>Examples: Michigan Department of Transportation (MDOT)</p>
            <p><b>Role:</b> Handle larger-scale infrastructure projects such as state highways, bridges, and inter-city infrastructure.</p>
            <p><b>Benefits:</b> Ensures seamless integration between local and state-level infrastructure management.</p>
          </div>
        </div>
        {/* Subcard 3: Federal Transportation Agencies */}
        <div className="col-12 col-md-6 col-lg-4 p-3 d-flex">
          <div className="card p-3 w-100 h-100">
            <p><b>Federal Transportation Agencies</b></p>
            <p>Examples: U.S. Department of Transportation, Federal Highway Administration</p>
            <p><b>Role:</b> Provide additional funding, technical support, and access to national infrastructure initiatives.</p>
            <p><b>Benefits:</b> Amplifies reach and impact; aligns the platform with national infrastructure goals.</p>
          </div>
        </div>
      </div>
      <div className="row">
        {/* Subcard 4: Private Sector Infrastructure Companies */}
        <div className="col-12 col-md-6 col-lg-4 p-3 d-flex">
          <div className="card p-3 w-100 h-100">
            <p><b>Private Sector Infrastructure Companies</b></p>
            <p>Examples: AECOM, Bechtel</p>
            <p><b>Role:</b> Execute repairs and projects based on user reports; potential sponsors for community projects.</p>
            <p><b>Benefits:</b> Facilitates quicker repair cycles and reduces public sector burden.</p>
          </div>
        </div>
        {/* Subcard 5: Technology Partners */}
        <div className="col-12 col-md-6 col-lg-4 p-3 d-flex">
          <div className="card p-3 w-100 h-100">
            <p><b>Technology Partners</b></p>
            <p>Examples: Google Maps, Microsoft, AWS</p>
            <p><b>Role:</b> Provide technology solutions, including cloud hosting, mapping tools, or data analytics.</p>
            <p><b>Benefits:</b> Enhances the platform's functionality and user experience.</p>
          </div>
        </div>
        {/* Subcard 6: Community Organizations and Nonprofits */}
        <div className="col-12 col-md-6 col-lg-4 p-3 d-flex">
          <div className="card p-3 w-100 h-100">
            <p><b>Community Organizations and Nonprofits</b></p>
            <p>Examples: Local community centers, Habitat for Humanity</p>
            <p><b>Role:</b> Help raise awareness about the platform; support local advocacy for better infrastructure.</p>
            <p><b>Benefits:</b> Strengthens community engagement and mobilization.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}