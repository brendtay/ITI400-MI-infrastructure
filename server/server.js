// Import necessary packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const issuesRouter = require('./routes/issues');
const usersRouter = require('./routes/users');

// Initialize the Express app
const app = express();

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173", // Allow requests from your *local* frontend
      process.env.FRONTEND_URL, 
      process.env.PUBLIC_DNS,   
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200,
};

// Apply middlewares
app.use(cors(corsOptions)); // CORS middleware
app.use(express.json()); // Parse JSON requests

// Define API routes
app.use('/api/issues', issuesRouter);
app.use('/api/users', usersRouter);

// Serve static assets from the dist folder
app.use(express.static(path.join(__dirname, "../Client/dist")));

// Catch-all route to serve the React app for any route not matched
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/dist/index.html"));
});

// Test API route
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Run server on port 8080
const PORT = process.env.PORT || 8080; // Default to port 3000 if not specified in environment variables
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});