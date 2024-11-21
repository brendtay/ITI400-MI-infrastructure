import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './pagesCss/ReportIssueForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import ReCAPTCHA from 'react-google-recaptcha';
import { isUserLoggedIn } from "../config/authConfig";
import logo from '../images/Mi-InfraLogo.png'; // Adjust the path based on your file structure

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ReportIssueForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [issueTypes, setIssueTypes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const autocompleteRef = useRef(null);
  const fileInputRef = useRef(null);

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

    const setMinHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--min-height", `${vh * 110}px`);
    };

    setMinHeight();
    window.addEventListener("resize", setMinHeight);
    return () => window.removeEventListener("resize", setMinHeight);
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

    const issueData = {
      issueType,
      description,
      gpsCoords: coordinates ? `${coordinates.lat},${coordinates.lng}` : null,
      location,
      captchaToken,
    };

    try {
      const issueResponse = await axios.post('/api/issues', issueData, {
        withCredentials: true,
      });

      const issueId = issueResponse.data.issue.issue_id;

      if (photo) {
        const formData = new FormData();
        formData.append("image", photo);

        await axios.post(`/api/images/upload/${issueId}`, formData, {
          withCredentials: true,
        });
      }

      setSuccess("Issue reported successfully!");
      setError(null);

      setIssueType("");
      setLocation("");
      setDescription("");
      setPhoto(null);
      setCoordinates(null);
      setCaptchaToken(null);

      // Reset file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error("Error reporting issue:", err);
      setError(err.response?.data?.error || "An error occurred. Please try again.");
      setSuccess(null);
    }
  };

  const useDeviceLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setLocation("");
          console.log("Location obtained:", latitude, longitude);
        },
        (error) => {
          console.error("Error obtaining location:", error.message);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access was denied. Please enable it in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get your location timed out.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const onPlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      setCoordinates({ lat: lat(), lng: lng() });
      setLocation(place.formatted_address);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center report-issue-container" style={{ minHeight: "100vh" }}>
      <div className="container p-4 border rounded" style={{ maxWidth: "600px" }}>
         {/* Logo */}
         <div className="text-center mb-4">
          <img
            src={logo}
            alt="MI-Infrastructure Logo"
            style={{ maxWidth: "400px" }}
          />
        </div>
        {!isLoggedIn && (
          <div className="alert alert-warning text-center mb-4">
            <p>You are not logged in. <a href="/login">Log in</a> to track your reports or <strong>continue as a guest</strong>.</p>
          </div>
        )}
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
          <h2 className="text-center mb-4">Report an Issue</h2>
            {error && <p className="text-danger">{error}</p>} 
            {success && <p className="text-success">{success}</p>}

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
          <div className="mb-5">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={useDeviceLocation}>
              Use My Current Location
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
          <div className="mb-4 mt-3">
            <label htmlFor="photo" className="form-label">Upload Photo</label>
            <input
              type="file"
              id="photo"
              className="form-control"
              onChange={handlePhotoChange}
              accept="image/*"
              ref={fileInputRef}
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
          <button type="submit" className="btn btn-primary w-100 mt-2">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueForm;
