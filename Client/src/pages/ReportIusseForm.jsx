import React, { useState, useEffect } from 'react';
import './pagesCss/ReportIusseForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';



const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ReportIssueForm = () => {
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
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
        const response = await fetch("/api/issues/types");
        if (!response.ok) {
          throw new Error("Failed to fetch issue types");
        }
        const data = await response.json();
        setIssueTypes(data);
      } catch (err) {
        console.error(err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const issueData = {
      issueType,
      description,
      gpsCoords: coordinates ? `${coordinates.lat},${coordinates.lng}` : null,
      location,
    };

    try {
      // Submit issue data to the backend
      const issueResponse = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issueData),
      });

      if (!issueResponse.ok) {
        throw new Error("Failed to report issue");
      }

      const issueResult = await issueResponse.json();
      const issueId = issueResult.issue.issue_id;

      // Upload photo if provided
      if (photo) {
        const formData = new FormData();
        formData.append("image", photo);

        const photoResponse = await fetch(`/api/s3/upload/${issueId}`, {
          method: "POST",
          body: formData,
        });

        if (!photoResponse.ok) {
          throw new Error("Failed to upload photo");
        }
      }

      setSuccess("Issue reported successfully!");
      setError(null);
      // Reset form
      setIssueType("");
      setLocation("");
      setDescription("");
      setPhoto(null);
      setCoordinates(null);
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred. Please try again.");
      setSuccess(null);
    }
  };

  const useDeviceLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setLocation(""); // Clear manual location entry if device location is used
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center report-issue-container" style={{ minHeight: "100vh" }}>
      <div className="container p-4 border rounded" style={{ maxWidth: "600px" }}>
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
          <div className="container-fluid mb-3">
            <div className="card bg-light p-3 mb-3">
              <div className="card-body">
                <h5 className="card-title">Enter Address</h5>
                <input
                  type="text"
                  id="location"
                  className="form-control form-control-lg mb-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="text-center mb-3">
              <strong>or</strong>
            </div>
            <div className="card bg-light p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Use My Location</h5>
                <button type="button" className="btn btn-outline-secondary w-100" onClick={useDeviceLocation}>
                  Use My Location
                </button>
              </div>
            </div>
          </div>

          {/* Map */}
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={{ height: "280px", width: "100%" }}
              center={coordinates || { lat: 42.962, lng: -83.687 }}
              zoom={15}
            >
              {coordinates && <Marker position={coordinates} />}
            </GoogleMap>
          </LoadScript>

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

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueForm;
