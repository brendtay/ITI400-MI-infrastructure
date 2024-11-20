const { Pool } = require("pg");
const AWS = require('aws-sdk');
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

// Configure AWS S3 connection
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: 'us-east-2' 
});

// Helper function to generate pre-signed URL
const generatePresignedUrl = (bucketName, key, expiresInSeconds = 60) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiresInSeconds,
  };
  return s3.getSignedUrl('getObject', params);
};

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

// Export the pool and s3 to use it in other parts of the app
module.exports = { pool, s3, generatePresignedUrl };