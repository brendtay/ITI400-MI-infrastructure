import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Autocomplete } from '@react-google-maps/api';
import './componentCss/searchBar.css'
export default function SearchBar({ address, setAddress, setLocation }) {
  const autocompleteRef = useRef(null);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSearch = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const formattedAddress = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const newLocation = { lat, lng };

      setAddress(formattedAddress);
      setLocation(newLocation);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
        },
        (error) => {
          alert('Unable to retrieve your location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="search-bar-container mt-3">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handleSearch}
        >
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter an address"
            className="form-control form-control-lg mb-2"
            aria-label="Address input"
          />
        </Autocomplete>
        <button type="submit" className="btn btn-primary btn-lg" aria-label="Search button">
          Search
        </button>
      </form>
      <button onClick={handleGetLocation} className="btn btn-outline-secondary btn-lg" aria-label="Use my location button">
        Use My Current Location
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  address: PropTypes.string.isRequired,
  setAddress: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
};
