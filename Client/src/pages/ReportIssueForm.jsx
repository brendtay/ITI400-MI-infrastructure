import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { isUserLoggedIn } from "../config/authConfig";
import './pagesCss/ReportIssueForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import ReCAPTCHA from 'react-google-recaptcha';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ReportIssueForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationData, setLocationData] = useState({ city: null, zip: null });
  const [coordinates, setCoordinates] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [issueTypes, setIssueTypes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isUserLoggedIn();
      if (!loggedIn) {
        alert("You must log in to use this feature.");
        window.location.href = "/login";
      }
      setIsLoggedIn(loggedIn);
    };
  
    checkLogin();
  }, []);

  useEffect(() => {
    const setMinHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--min-height", `${vh * 110}px`);
    };
  
    setMinHeight(); // Set height on load
    window.addEventListener("resize", setMinHeight);
  
    return () => window.removeEventListener("resize", setMinHeight); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchIssueTypes = async () => {
      try {
        const response = await axios.get('/api/issues/types');
        setIssueTypes(response.data);
      } catch (err) {
        console.error("Error fetching issue types:", err);
        setIssueTypes([]);
      }
    };

    fetchIssueTypes();
  }, []);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!captchaToken) {
      setError("Please complete the CAPTCHA to submit the form.");
      return;
    }
  
    let imageId = null;
  
    try {
      // Step 1: Upload the image if available and get imageId
      if (photo) {
        const formData = new FormData();
        formData.append("image", photo);
  
        const imageResponse = await axios.post('/api/images/upload', formData, {
          withCredentials: true,
        });
  
        imageId = imageResponse.data.image_id;
      }
  
      // Step 2: Create the issue with all data
      const issueData = {
        issueType,
        description,
        gpsCoords: coordinates ? `${coordinates.lat},${coordinates.lng}` : null,
        location,
        city: locationData.city || null,
        zip: locationData.zip || null,
        captchaToken,
        imageId, 
      };
  
      const issueResponse = await axios.post('/api/issues', issueData, {
        withCredentials: true,
      });
  
      setSuccess("Issue reported successfully!");
      setError(null);
  
      // Reset form fields
      setIssueType("");
      setLocation("");
      setDescription("");
      setPhoto(null);
      setCoordinates(null);
      setCaptchaToken(null);
    } catch (err) {
      console.error("Error reporting issue:", err);
      setError(err.response?.data?.error || "An error occurred. Please try again.");
      setSuccess(null);
    }
  };

  const useDeviceLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
  
          // Reverse geocode to get city and zip
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json`,
              {
                params: {
                  latlng: `${latitude},${longitude}`,
                  key: apiKey,
                },
              }
            );
  
            if (response.data.status === "OK") {
              const addressComponents =
                response.data.results[0].address_components;
  
              const cityComponent = addressComponents.find((comp) =>
                comp.types.includes("locality")
              );
              const zipComponent = addressComponents.find((comp) =>
                comp.types.includes("postal_code")
              );
  
              const city = cityComponent ? cityComponent.long_name : null;
              const zip = zipComponent ? zipComponent.long_name : null;
  
              setLocationData({ city, zip });
            }
          } catch (error) {
            console.error("Error during reverse geocoding:", error.message);
          }
        },
        (error) => {
          console.error("Error obtaining location:", error.message);
          // Handle error cases (as in your existing code)
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const onPlaceSelected = async () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      setCoordinates({ lat: lat(), lng: lng() });
      setLocation(place.formatted_address);
  
      // Fetch city and zip from place details
      const addressComponents = place.address_components;
      const cityComponent = addressComponents.find((comp) =>
        comp.types.includes('locality')
      );
      const zipComponent = addressComponents.find((comp) =>
        comp.types.includes('postal_code')
      );
  
      const city = cityComponent ? cityComponent.long_name : null;
      const zip = zipComponent ? zipComponent.long_name : null;
  
      // Add city and zip to state
      setLocationData({ city, zip });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center report-issue-container" style={{ minHeight: "100vh" }}>
      <div className="container p-4 border rounded" style={{ maxWidth: "600px" }}>
        {!isLoggedIn && (
          <div className="alert alert-warning text-center mb-4">
            <p>You are not logged in. <a href="/login">Log in</a> to track your reports or <strong>continue as a guest</strong>.</p>
          </div>
        )}
        <h2 className="text-center mb-4">Report an Issue</h2>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <form onSubmit={handleSubmit}>
          {/* Issue Type Dropdown */}
          <div className="mb-3">
            <label htmlFor="issueType" className="form-label">Issue Type</label>
            <select
              id="issueType"
              className="form-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              required
            >
              <option value="">Select Issue</option>
              {issueTypes.map((type) => (
                <option key={type.issue_id} value={type.issue_id}>
                  {type.issue_name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Location Section */}
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceSelected}
            >
              <input
                type="text"
                id="location"
                className="form-control"
                value={location}
                onChange={handleLocationChange}
                placeholder="Enter address"
              />
            </Autocomplete>
          </div>
          <div className="text-center my-3">
            <strong>or</strong>
          </div>
          <div className="mb-3">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={useDeviceLocation}>
              Use My Location
            </button>
          </div>

          {/* Map */}
          <GoogleMap
            mapContainerStyle={{ height: "280px", width: "100%" }}
            center={coordinates || { lat: 43.019387852838754, lng: -83.6894584432078 }}
            zoom={15}
          >
            {coordinates && <Marker position={coordinates} />}
          </GoogleMap>

          {/* Photo Upload */}
          <div className="mb-3">
            <label htmlFor="photo" className="form-label">Upload Photo</label>
            <input
              type="file"
              id="photo"
              className="form-control"
              onChange={handlePhotoChange}
              accept="image/*"
            />
          </div>

          {/* reCAPTCHA */}
          <div className="mb-3 d-flex justify-content-center">
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={handleCaptchaChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueForm;
