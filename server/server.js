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
  origin: [
    "http://localhost:5173", // Allow requests from your *local* frontend
    process.env.PUBLIC_IP,
    process.env.PUBLIC_DNS,
  ],
  optionsSuccessStatus: 200
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

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});