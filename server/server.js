// Import necessary packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");

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

// Load SSL certificate and private key
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/mi-infrastructure.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/mi-infrastructure.com/fullchain.pem"),
};

// Serve the app over HTTPS
https.createServer(options, app).listen(443, "0.0.0.0", () => {
  console.log("HTTPS server started on https://mi-infrastructure.com");
});

// Redirect HTTP traffic to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, "0.0.0.0", () => {
  console.log("Redirecting HTTP traffic to HTTPS");
});