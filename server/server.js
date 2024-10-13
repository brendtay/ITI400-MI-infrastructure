// Import necessary packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const issuesRouter = require('./routes/issues');
const usersRouter = require('./routes/users');

// Load environment variables from .env file
dotenv.config();

// Import the database connection pool
const pool = require("./db");

// Set up Express app
const app = express();

// Configure CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173", // Allowing requests from your *local* frontend running on Vite
    process.env.PUBLIC_IP, 
    process.env.PUBLIC_DNS    
  ], 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Parse JSON requests
app.use(express.json());

// Test API route
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "ornage", "banana"] });
});

// Serve index.html for any unknown route (React Router support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use('/api/issues', issuesRouter);
app.use('/api/users', usersRouter);

// Serve static files from the Vite build folder (dist/)
app.use(express.static(path.join(__dirname, "dist")));

// Start the server
const port = process.env.PORT;

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});
