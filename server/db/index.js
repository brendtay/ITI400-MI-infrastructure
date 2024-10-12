const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// Create PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, 
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database", err.stack);
  } else {
    client.query("SELECT NOW()", (err, result) => {
      release();
      if (err) {
        console.error("Error executing query", err.stack);
      } else {
        console.log("Connected to the database at:", result.rows[0].now);
      }
    });
  }
});

// Export the pool to use it in other parts of the app
module.exports = pool;