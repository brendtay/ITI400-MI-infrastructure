// Import necessary packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const locationRouter = require('./routes/location');
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

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply global security measures
app.disable("x-powered-by"); // Removes framework version headers
app.use(express.static("public", { dotfiles: "deny" }));

// Apply global middlewares
app.use(cors(corsOptions)); // CORS middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Cookie monster

// Sanitize and detailed log of incoming requests
app.use((req, res, next) => {
  const startTime = Date.now();

  // Get client IP address (support for proxies)
  const clientIp = req.headers["x-forwarded-for"]?.split(",").shift() || req.ip;

  // Capture request details
  console.log(`[${new Date().toISOString()}] Incoming Request:`);
  console.log(`  Method: ${req.method}`);
  console.log(`  URL: ${req.url}`);
  console.log(`  Client IP: ${clientIp}`);
  console.log(`  User-Agent: ${req.headers["user-agent"]}`);
  console.log(`  Content-Type: ${req.headers["content-type"] || "N/A"}`);

  // Check for directory traversal patterns
  if (/(\.\.|%2e%2e)/i.test(req.url)) {
    console.log(`  Blocked potential directory traversal attempt: ${req.url}`);
    return res.status(400).send("Bad Request");
  }

  // Hook into response to log response status and processing time
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`  Response Status: ${res.statusCode}`);
    console.log(`  Processing Time: ${duration}ms`);
  });

  next();
});

// Define API routes
app.use('/api/users', usersRouter);
app.use('/api/location', locationRouter);
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
app.get("*", (req, res) => {
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