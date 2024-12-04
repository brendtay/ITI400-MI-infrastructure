import React from 'react';
import '../pages/pagesCss/About.css';
import "bootstrap/dist/css/bootstrap.min.css";
import groupImage from '../images/groupPage.jpg';
import logo from '../images/Mi-InfraLogo.png'; // Adjust the path based on your file structure

export default function About() {
  return (
    <div className="custom-margin" style={{ paddingTop: '80px' }}> {/* Increased padding top */}

      <div className="card mb-5 limited-width-card"> {/* Main card with limited width */}
        <div className="card-body text-center"> {/* Center text within the card */}
          {/* Logo Section */}
          <div className="text-center mb-5 about-logo-container">
  <img
    src={logo}
    alt="MI-Infrastructure Logo"
    className="img-fluid"
  />
</div>


          <h2 className="card-title mb-4">Our Mission</h2>
          <p className="card-text">
            At MI-Infrastructure, our mission is to empower residents to enhance their communities by providing an easy-to-use platform for reporting infrastructure issues. 
            We strive to simplify the process of submitting reports, allowing users to include GPS locations and photos, describe problems, and track the progress of their submissions. 
            By fostering transparency and accessibility, we connect users directly with the Federal Department of Transport, MDOT, and the City of Flint, ensuring that every voice is heard without 
            requiring specialized knowledge of local authorities. Together, we can create safer, more resilient infrastructure for all.
          </p>

          <h2 className="card-title mt-5 mb-4">Our Team</h2>
          <div className="d-flex justify-content-center mb-4">
            <img 
              src={groupImage} 
              alt="Group Image" 
              className="img-fluid" 
              style={{ maxWidth: '50%', height: 'auto' }} 
            />
          </div>

          <h2 className="card-title mt-5 mb-4">Our Vision</h2>
          <p className="card-text">
            At MI-Infrastructure, we envision a community where every resident can easily report issues with public infrastructure, contributing to a safer and more efficient environment. 
            Our platform will empower users to submit detailed reports by providing photos and descriptions of issues, while automatically capturing GPS locations or allowing for manual entry to ensure accuracy. 
            We are committed to transparency, enabling users to track the status of their reports, scheduled repairs, and resolutions. Our responsive user interface will ensure seamless accessibility across all devices. 
            Additionally, we aim to foster a connected community by allowing users to view reports in their area and stay informed about the progress of repairs. Together, we strive to enhance public infrastructure through collaboration and innovation.
          </p>

          <h2 className="card-title mt-5 mb-4">Our History</h2>
          <p className="card-text">
            Founded in 2024, MI-Infrastructure emerged from a pressing need to enhance public infrastructure reporting and management within Michigan. 
            Recognizing the challenges faced by citizens in reporting issues such as potholes, broken sidewalks, and damaged street lights, a group of college students came together to create a user-friendly platform that streamlines the reporting process.
          </p>

          <h2 className="text-center mb-3 mt-5">About Our Team</h2>
          <div className="row mt-4"> {/* Team member cards within the main card */}
            <div className="col-md-6">
              <div className="card limited-width-card text-center"> {/* Added text-center */}
                <div className="card-body">
                  <h5 className="card-title">Amanda</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Project Owner</h6>
                  <p className="card-text">
                    Amanda leads the team with a clear vision, ensuring our goals align with community needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card limited-width-card text-center"> {/* Added text-center */}
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
              <div className="card limited-width-card text-center"> {/* Added text-center */}
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
              <div className="card limited-width-card text-center"> {/* Added text-center */}
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
      </div>
    </div>
  );
}
