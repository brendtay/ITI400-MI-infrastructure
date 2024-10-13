import React from 'react';
import "./componentCss/howItWorks.css"
import examplePhoto1 from "../images/userTakingPhotoOfPothole.jpg";
import examplePhoto2 from "../images/userUploadingData.jpg";
import examplePhoto3 from "../images/userTrackingProgress.jpg";

export default function HowItWorks() {
  return (
    <div className="container text-center my-5">
      <h1>How It Works</h1>
      <div className="row align-items-start">
        <div className="col">
          <p className="text-above-image">1. Upload A Photo</p>
          <img 
            src={examplePhoto1}
            alt="User taking photo of pothole" 
            className="img-fluid img-hover-zoom" 
          />
        </div>
        <div className="col">
          <p className="text-above-image">2. Add Description And Location</p>
          <img 
            src={examplePhoto2}
            alt="User uploading data" 
            className="img-fluid img-hover-zoom" 
          />
        </div>
        <div className="col">
          <p className="text-above-image">3. Track Your Progress</p>
          <img 
            src={examplePhoto3}
            alt="User tracking progress" 
            className="img-fluid img-hover-zoom" 
          />
        </div>
      </div>
    </div>
  );
}
