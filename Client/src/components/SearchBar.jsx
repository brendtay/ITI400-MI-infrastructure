// src/components/SearchBar.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Autocomplete } from '@react-google-maps/api';

const SearchBar = ({ address, onAddressChange, onSearch, onGetLocation }) => {
  const autocompleteRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    onSearch(); // Call the search function
  };

  const onPlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      onAddressChange({ target: { value: place.formatted_address } });
    }
  };

  return (
    <div className="container-fluid" style={{ marginBottom: '4px', padding: 0 }}>
      <div className="row d-flex align-items-stretch">
        
        {/* Input for Enter Address and Search */}
        <div className="col-md-6 col-12 mb-2">
          <div className="p-3 h-100">
            <h5 className="mb-3 text-center">Enter An Address Or Zipcode To Search</h5> {/* Centered text */}
            <form onSubmit={handleSubmit}>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={onPlaceSelected}
              >
                <input
                  type="text"
                  value={address}
                  onChange={onAddressChange}
                  placeholder="Enter an address"
                  className="form-control form-control-lg mb-2"
                  aria-label="Address input" // Accessibility label
                />
              </Autocomplete>
              <button type="submit" className="btn btn-primary btn-lg w-100" aria-label="Search button">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Button for Use My Location */}
        <div className="col-md-6 col-12 mb-2">
          <div className="p-3 h-100 text-center">
            <h5 className="mb-3">Use My Location</h5>
            <div style={{ marginBottom: '1rem' }}>
              Press the button below to use your device's current location.
            </div>
            <button onClick={onGetLocation} className="btn btn-outline-secondary btn-lg w-100" aria-label="Use my location button">
              Use My Location
            </button>
          </div>
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
