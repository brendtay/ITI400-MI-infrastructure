import React from 'react';
import "./componentCss/footer.css";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-2 pb-3 mt-4">
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col-lg-5 col-md-6 mb-2">
          </div>

          {/* Column 2 - Right-aligned on large screens */}
          <div className="col-lg-4 col-md-6 mb-2 ms-lg-auto text-lg-end">
            <h5 className="footer-heading">Contact Info</h5>
            <ul className="list-unstyled footer-list">
              <li><i className="bi bi-geo-alt"></i> 303 E Kearsley St, Flint, MI 48502</li>
              <li><i className="bi bi-envelope"></i> infrastructuremi@gmail.com</li>
              <li><i className="bi bi-phone"></i> (810) 867-5309</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-2 border-top">
          © 2024 MI-Infrastructure. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
