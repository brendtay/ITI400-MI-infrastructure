import React from 'react';
import "./componentCss/howItWorks.css";
import examplePhoto1 from "../images/userTakingPhotoOfPothole.jpg";
import examplePhoto2 from "../images/userUploadingData.jpg";
import examplePhoto3 from "../images/userTrackingProgress.jpg";

export default function HowItWorks() {
  return (
    <div className="container text-center my-5">
      <h1>How It Works</h1>
      <div className="row align-items-start my-5">
        {/* Responsive columns for each step */}
        <div className="col-12 col-md-4 my-3">
          <div className="card shadow-sm h-100"> {/* Card container */}
            <div className="card-body">
              <p className="text-above-image"><b>1. Upload A Photo</b></p>
              <img 
                src={examplePhoto1}
                alt="User taking photo of pothole" 
                className="img-fluid img-hover-zoom card-img-top" 
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 my-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-above-image"><b>2. Add Description And Location</b></p>
              <img 
                src={examplePhoto2}
                alt="User uploading data" 
                className="img-fluid img-hover-zoom card-img-top" 
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 my-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-above-image"><b>3. Track Your Progress</b></p>
              <img 
                src={examplePhoto3}
                alt="User tracking progress" 
                className="img-fluid img-hover-zoom card-img-top" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
