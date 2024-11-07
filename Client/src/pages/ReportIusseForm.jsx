import React, { useState } from 'react';
import './pagesCss/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // For Google Maps integration

const ReportIssueForm = () => {
  const [issueType, setIssueType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coordinates, setCoordinates] = useState(null); // For storing coordinates

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Issue Type:', issueType);
    console.log('Location:', location);
    console.log('Coordinates:', coordinates);
    console.log('Description:', description);
    console.log('Photo:', photo);
    console.log('Name:', name);
    console.log('Email:', email);
  };

  const handleLocationSelection = (lat, lng) => {
    setCoordinates({ lat, lng });
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '160vh' }}>
      <div className="container p-4 border rounded" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Report an Issue</h2>
        <form onSubmit={handleSubmit}>
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
              <option value="pothole">Pothole</option>
              <option value="broken sidewalk">Broken Sidewalk</option>
              <option value="street light issue">Street Light Issue</option>
              <option value="drainage problem">Drainage Problem</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              className="form-control"
              value={location}
              onChange={handleLocationChange}
              placeholder="Enter address"
              required
            />
            {/* Google Maps component (just for simplicity, showing map to pick location) */}
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                id="example-map"
                mapContainerStyle={{ height: '300px', width: '100%' }}
                center={coordinates || { lat: 42.962, lng: -83.687 }}
                zoom={15}
              >
                {coordinates && <Marker position={coordinates} />}
              </GoogleMap>
            </LoadScript>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description of the Issue</label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
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
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name (Optional)</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email (Optional)</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueForm;
