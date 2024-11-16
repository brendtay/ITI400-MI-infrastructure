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
const imagesRouter = require('./routes/images');

// Initialize the Express app
const app = express();

// Configure CORS options
const allowedOrigins = [
  "http://localhost:5173",                // Local development frontend URL
  process.env.FRONTEND_URL,               // Production frontend URL (e.g., https://mi-infrastructure.com)
  process.env.PUBLIC_DNS,                 // AWS public DNS if applicable
];

const corsOptions = {
  origin: "*", // Temporarily allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
};

/*const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`); // Log blocked origins for debugging
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
*/

// Middleware to log origins
app.use((req, res, next) => {
  const origin = req.headers.origin || "No Origin Header";
  console.log(`Request Origin: ${origin}`);
  next();
});

// Apply middlewares
app.use(cors(corsOptions)); // CORS middleware
app.use(express.json()); // Parse JSON requests

// Define API routes
app.use('/api/issues', issuesRouter);
app.use('/api/users', usersRouter);
app.use('/api/images', imagesRouter);

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
