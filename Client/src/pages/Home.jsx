import React from 'react'
import './pagesCss/Home.css'
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from '../components/Navbar';
import BackgroundImage from '../components/backgroundImage';


export default function Home() {
  return (
    <div>
        <div>
        {/* Main Container for the Title */}
        <div className="container text-center my-4">
          <div style={{ color: 'white', fontSize: '40px' }}>
            <b>Report Public Infrastructure Issues</b>
          </div>
        </div>
        <div style={{ margin: 0, padding: 0 }}>
        <BackgroundImage />
        {/* Other components or content */}
      </div>
        </div>
        {/* Main Container for Navbar*/}
        <div className="container"> {/* Bootstrap container for alignment */}
          <div className="row justify-content-center"> {/* Bootstrap row for flex layout */}
            <div className="col-auto"> {/* Column for Navbar with automatic width */}
              <Navbar />
          </div>
        </div>
      </div>
    </div>
  )
}
