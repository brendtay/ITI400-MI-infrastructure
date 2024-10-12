// Import necessary packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

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

// Define API route
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "ornage", "banana"] });
});

// Start the server
const port = process.env.PORT;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
});
