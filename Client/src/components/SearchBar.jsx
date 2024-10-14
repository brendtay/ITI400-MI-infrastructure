// src/components/SearchBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchBar = ({ address, onAddressChange, onSearch, onGetLocation }) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    onSearch(); // Call the search function
  };

  return (
    <div className="container" style={{ marginBottom: '4px', maxWidth: '400px' }}>
      <div className="card bg-light p-3 d-flex justify-content-center">
        <div className="card-body text-center"> {/* Center text within the card body */}
          <form onSubmit={handleSubmit}>
            {/* Large Search Bar */}
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem' }}>
              Enter An Address Or Zipcode To Search
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <input
                  type="text"
                  value={address}
                  onChange={onAddressChange}
                  placeholder="Enter an address"
                  className="form-control form-control-lg"
                  style={{ width: '100%' }}
                  aria-label="Address input" // Accessibility label
                />
              </div>
            </div>
            {/* Buttons Row - Full Width Below the Search Bar */}
            <div className="row">
              <div className="col-12 mb-2">
                <button type="submit" className="btn btn-primary btn-lg w-100" aria-label="Search button">
                  Search
                </button>
              </div>
              <div className="col-12 mb-2">
                <h2>OR</h2>
              </div>
              <div className="col-12">
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem' }}>
                  Press Use My Location To Use Your Device's Current Location
                </div>
                <button onClick={onGetLocation} className="btn btn-outline-secondary btn-lg w-100" aria-label="Use my location button">
                  Use My Location
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  address: PropTypes.string.isRequired,
  onAddressChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onGetLocation: PropTypes.func.isRequired,
};

export default SearchBar;
