import React from 'react'
import examplePhoto1 from "../images/userTakingPhotoOfPothole.jpg"
import examplePhoto2 from "../images/userUploadingData.jpg"
import examplePhoto3 from "../images/userTrackingProgress.jpg"

export default function howItWorks() {
  return (
    <div className="container text-center my-5">
    <h1>How It Works</h1>
    <div className="row align-items-start">
      <div className="col">
      <p>1. Upload A Photo</p>
        <img 
        
          src = {examplePhoto1}
          alt="Description for photo 1" 
          className="img-fluid" // Bootstrap class to make the image responsive
        />
        
      </div>
      <div className="col">
      <p>2. Add Description And Location</p>
        <img 
          src = {examplePhoto2}
          alt="Description for photo 2" 
          className="img-fluid"
        />
        
      </div>
      <div className="col">
        <p>3. Track Your Progress</p>
      <img 
        
        src = {examplePhoto3}
        alt="Description for photo 1" 
        className="img-fluid" // Bootstrap class to make the image responsive
      />
        
      </div>
    </div>
  </div>
  )
}
