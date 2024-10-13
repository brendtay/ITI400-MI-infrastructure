import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-4 mt-4">
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col-lg-5 col-md-6 mb-4">
            <h5>About Us</h5>
            <p>
            At MI-Infrastructure, we provide a user-friendly platform that empowers communities to report and track infrastructure issues like potholes, broken streetlights, and damaged sidewalks, fostering collaboration with local authorities to improve public spaces.
            </p>
          </div>

            {/* Column 2 - Right-aligned */}
            <div className="col-lg-4 col-md-6 mb-4 ms-auto">
            <h5>Contact Info</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt"></i> 303 E Kearsley St, Flint, MI 48502</li>
              <li><i className="bi bi-envelope"></i> infrastructuremi@gmail.com</li>
              <li><i className="bi bi-phone"></i> (810) 867-5309</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-3">
          © 2024 Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
