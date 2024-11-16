import React, { useState } from "react";
import axios from "axios";
import "./pagesCss/Login.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration
  const [name, setName] = useState(""); // For registration
  const [email, setEmail] = useState(""); // Common for login and registration
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering
      ? '/api/users/register'
      : '/api/users/login';
    const payload = isRegistering
      ? { name, email, password }
      : { email, password };

      try {
        const response = await axios.post(endpoint, payload, { withCredentials: true });
  
        if (isRegistering) {
          setSuccess("Registration successful! You can now log in.");
        } else {
          setSuccess("Login successful!");
          // Add logic for handling successful login (e.g., storing token, redirecting)
        }
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
        setSuccess(null);
      }
    };

  return (
    <div className="d-flex align-items-center justify-content-center login-background" style={{ minHeight: "100vh" }}>
      <div className="container p-4 border rounded" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">{isRegistering ? "Register" : "Login"}</h2>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login here."
              : "Don't have an account? Register here."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;