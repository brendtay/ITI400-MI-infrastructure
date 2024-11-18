// Import necessary packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');

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
  process.env.FRONTEND_URL,               // Production frontend URL
  process.env.FRONTEND_URL_ALT,           // Alternate frontend URL
];

const normalizeOrigin = (origin) => (origin ? origin.replace(/\/$/, "") : origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.map(normalizeOrigin).includes(normalizeOrigin(origin)) || !origin) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply global middlewares
app.use(cors(corsOptions)); // CORS middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Cookie monster

// Middleware to log origins
app.use((req, res, next) => {
  const origin = req.headers.origin || "No Origin Header";
  console.log(`Request Origin: ${origin}`);
  next();
});

// Define API routes
app.use('/api/users', usersRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/images', imagesRouter);

// Serve static assets from the `dist` folder (React build)
app.use(express.static(path.join(__dirname, "../Client/dist")));

// Define utility/test routes
app.get("/api/status", (req, res) => {
  res.json({
    status: "success",
    message: "API is working properly",
    timestamp: new Date().toISOString(),
  });
});

// Catch-all route to serve the React app for any unmatched routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next(); // Skip React app serving for API requests
  }
  res.sendFile(path.join(__dirname, "../Client/dist/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});