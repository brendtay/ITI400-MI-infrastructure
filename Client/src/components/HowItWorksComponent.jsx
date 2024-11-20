import React from 'react';
import "./componentCss/howItWorks.css";
import examplePhoto1 from "../images/userTakingPhotoOfPothole.jpg";
import examplePhoto2 from "../images/userUploadingData.jpg";
import examplePhoto3 from "../images/userTrackingProgress.jpg";

export default function HowItWorks() {
  return (
    <div className="text-center my-3">
      <h1><b>How It Works</b></h1>
      <div className="row align-items-start my-3">
        {/* Responsive columns for each step */}
        <div className="col-12 col-md-4 my-3">
          <div className="card shadow-sm h-100"> {/* Single card for Step 1 */}
            <div className="card-body">
              <p className="text-above-image"><b>1. Upload A Photo From Device</b></p>
              <img 
                src={examplePhoto1}
                alt="User taking photo of pothole" 
                className="img-fluid img-hover-zoom card-img-top" 
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 my-3">
          <div className="card shadow-sm h-100"> {/* Single card for Step 2 */}
            <div className="card-body">
              <p className="text-above-image"><b>2. Add Description / Location</b></p>
              <img 
                src={examplePhoto2}
                alt="User uploading data" 
                className="img-fluid img-hover-zoom card-img-top" 
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 my-3">
          <div className="card shadow-sm h-100"> {/* Single card for Step 3 */}
            <div className="card-body">
              <p className="text-above-image"><b>3. Track Your Progress Online</b></p>
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
