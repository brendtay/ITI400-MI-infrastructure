import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div className="container-fluid">
      <a className="navbar-brand p-4" href="#">MI-Infrastructure</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active p-4" aria-current="page" href="#">Report An Issue</a>
          </li>
          <li className="nav-item">
            <a className="nav-link p-4" href="#">About Us</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active p-4" aria-current="page" href="#">Resources</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active p-4" aria-current="page" href="#">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
}

export default Navbar;
