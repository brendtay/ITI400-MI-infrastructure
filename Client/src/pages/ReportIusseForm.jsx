import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagesCss/ReportIusseForm.css'; // Import the CSS file

const ReportIssueForm = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    location: '',
    description: '',
    photo: null,
    contactName: '',
    contactEmail: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to the server
    console.log(formData);
  };

  return (
    <div className="container custom-margin pt-2">
      <h1 className="about-heading text-center mb-4">Report an Issue - YYY Infrastructure</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="issue-type" className="form-label">Issue Type:</label>
          <select
            id="issue-type"
            name="issueType"
            className="form-select"
            value={formData.issueType}
            onChange={handleChange}
            required
          >
            <option value="">Select an issue</option>
            <option value="pothole">Pothole</option>
            <option value="sidewalk">Broken Sidewalk</option>
            <option value="streetlight">Streetlight Issue</option>
            <option value="drainage">Drainage Problem</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location (Address or GPS Coordinates):</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description of the Issue:</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Upload Photo:</label>
          <input
            type="file"
            id="photo"
            name="photo"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact-name" className="form-label">Your Name (Optional):</label>
          <input
            type="text"
            id="contact-name"
            name="contactName"
            className="form-control"
            value={formData.contactName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact-email" className="form-label">Your Email (Optional):</label>
          <input
            type="email"
            id="contact-email"
            name="contactEmail"
            className="form-control"
            value={formData.contactEmail}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ReportIssueForm;
