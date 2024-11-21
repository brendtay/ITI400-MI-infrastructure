import React from 'react';
import "./componentCss/howItWorks.css";
import examplePhoto1 from "../images/userTakingPhotoOfPothole.jpg";
import examplePhoto2 from "../images/userUploadingData.jpg";
import examplePhoto3 from "../images/userTrackingProgress.jpg";

export default function HowItWorks() {
  return (
    <div className="text-center my-3">
      <h1><b>How It Works</b></h1>
      <div id="howItWorksCarousel" className="carousel slide my-3" data-bs-ride="carousel">
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#howItWorksCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Step 1"></button>
          <button type="button" data-bs-target="#howItWorksCarousel" data-bs-slide-to="1" aria-label="Step 2"></button>
          <button type="button" data-bs-target="#howItWorksCarousel" data-bs-slide-to="2" aria-label="Step 3"></button>
        </div>

        {/* Carousel Items */}
        <div className="carousel-inner">
          {/* Step 1 */}
          <div className="carousel-item active">
            <div className="card shadow-sm h-100 mx-auto" style={{ maxWidth: "500px" }}>
              <div className="card-body">
                <img
                  src={examplePhoto1}
                  alt="User taking photo of pothole"
                  className="img-fluid card-img-top"
                />
                <p className="text-below-image">1. Upload A Photo From Device</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="carousel-item">
            <div className="card shadow-sm h-100 mx-auto" style={{ maxWidth: "500px" }}>
              <div className="card-body">
                <img
                  src={examplePhoto2}
                  alt="User uploading data"
                  className="img-fluid card-img-top"
                />
                <p className="text-below-image">2. Add Description / Location</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="carousel-item">
            <div className="card shadow-sm h-100 mx-auto" style={{ maxWidth: "500px" }}>
              <div className="card-body">
                <img
                  src={examplePhoto3}
                  alt="User tracking progress"
                  className="img-fluid card-img-top"
                />
                <p className="text-below-image">3. Track Your Progress Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#howItWorksCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#howItWorksCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
