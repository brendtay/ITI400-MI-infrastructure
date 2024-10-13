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

// Serve static files from appropriate directories
app.use('/css', express.static(path.join(__dirname, "../Client/css")));
app.use('/public', express.static(path.join(__dirname, "../Client/public")));
app.use('/src/assets', express.static(path.join(__dirname, "../Client/src/assets")));
app.use('/src/images', express.static(path.join(__dirname, "../Client/src/images")));

// Serve the React app for all other routes (catch-all route)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/index.html"));
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