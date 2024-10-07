// Import necessary packages
const express = require("express");
const cors = require("cors");
const pkg = require('pg');
const dotenv = require('dotenv');

// Destructure Pool from the default import for pg
const { Pool } = pkg;

// Load environment variables from .env file
dotenv.config();

// Create PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,  // For self-signed certificates
  },
});

// Test the connection when the server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        console.error('Error executing query', err.stack);
      } else {
        console.log('Connected to the database at:', result.rows[0].now);
      }
    });
  }
});

// Set up Express app
const app = express();

// Configure CORS options
const corsOptions = {
  origin: ["http://localhost:5173"],  // Allowing requests from your frontend running on Vite
};

app.use(cors(corsOptions));

// Define API route
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "ornage", "banana"] });
});

// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
