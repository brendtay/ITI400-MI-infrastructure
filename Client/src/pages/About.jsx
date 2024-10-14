import React from 'react';
import '../pages/pagesCss/About.css';
import "bootstrap/dist/css/bootstrap.min.css";

export default function About() {
  return (
    <div className="container custom-margin pt-5">
      <h1 className="text-center mb-5">About Us</h1> {/* Increased mb-4 to mb-5 for more space */}
      <div className="row">
        <div className="col-md-6">
          <h2>Our Mission</h2>
          <p>
          At MI-Infrastructure, our mission is to empower residents to enhance their communities by providing an easy-to-use platform for reporting infrastructure issues. 
          We strive to simplify the process of submitting reports, allowing users to include GPS locations and photos, describe problems, and track the progress of their submissions. 
          By fostering transparency and accessibility, we connect users directly with the Federal Department of Transport, MDOT, and the City of Flint, ensuring that every voice is heard without 
          requiring specialized knowledge of local authorities. Together, we can create safer, more resilient infrastructure for all.
          </p>
        </div>
        <div className="col-md-6">
          <h2>Our Vision</h2>
          <p>
          At MI-Infrastructure, we envision a community where every resident can easily report issues with public infrastructure, contributing to a safer and more efficient environment. 
          Our platform will empower users to submit detailed reports by providing photos and descriptions of issues, while automatically capturing GPS locations or allowing for manual entry to ensure accuracy. 
          We are committed to transparency, enabling users to track the status of their reports, scheduled repairs, and resolutions. Our responsive user interface will ensure seamless accessibility across all devices. 
          Additionally, we aim to foster a connected community by allowing users to view reports in their area and stay informed about the progress of repairs. Together, we strive to enhance public infrastructure through collaboration and innovation.
          </p>
        </div>
      </div>
      


  <h2 className="text-center mb-3">About Our Team</h2>
  <div className="row">
    <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Amanda</h5>
          <h6 className="card-subtitle mb-2 text-muted">Project Owner</h6>
          <p className="card-text">
            Amanda leads the team with a clear vision, ensuring our goals align with community needs.
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Matt</h5>
          <h6 className="card-subtitle mb-2 text-muted">Scrum Master</h6>
          <p className="card-text">
            Matt facilitates our agile process, keeping us organized and focused on delivering results efficiently.
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-6 mt-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Brendan</h5>
          <h6 className="card-subtitle mb-2 text-muted">Developer</h6>
          <p className="card-text">
            Brendan brings technical expertise to the project, turning our ideas into a functional and user-friendly platform.
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-6 mt-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Cameron</h5>
          <h6 className="card-subtitle mb-2 text-muted">Developer</h6>
          <p className="card-text">
            Cameron contributes his development skills to ensure our website is robust and effective in addressing infrastructure issues.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
