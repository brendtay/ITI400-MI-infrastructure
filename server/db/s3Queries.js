const { s3, pool } = require('./index');

// Upload images to S3
const uploadImageToS3 = async (file, userId, issueId) => {
  const params = {
    Bucket: 'mi-infrastructure-images', 
    Key: `${Date.now()}_${file.originalname}`, 
    Body: file.buffer, 
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  try {
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location;

    // Store the image metadata in RDS
    const query = `
      INSERT INTO images (issue_id, image_url, uploaded_by)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [issueId, imageUrl, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

// Get all images for a specific issue
const getImagesByIssueId = async (issueId) => {
  const query = `
    SELECT * FROM images
    WHERE issue_id = $1;
  `;
  const values = [issueId];
  const result = await pool.query(query, values);
  return result.rows;
};

// Get all images uploaded by a specific user
const getImagesByUserId = async (userId) => {
  const query = `
    SELECT * FROM images
    WHERE uploaded_by = $1;
  `;
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
};

// Get image metadata by image_id
const getImageById = async (imageId) => {
  const query = `
    SELECT * FROM images
    WHERE image_id = $1;
  `;
  const values = [imageId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete image from S3
const deleteImageFromS3 = async (imageId) => {
  // Fetch image URL from database to determine the S3 key
  const query = `DELETE FROM images WHERE image_id = $1 RETURNING image_url;`;
  const values = [imageId];
  const result = await pool.query(query, values);
  
  if (result.rowCount === 0) {
    throw new Error('Image not found');
  }
  
  const imageUrl = result.rows[0].image_url;
  const s3Key = imageUrl.split('/').pop(); // Extract the S3 key from the URL

  // Delete from S3
  const params = {
    Bucket: 'mi-infrastructure-images', // replace with your bucket name
    Key: s3Key
  };

  await s3.deleteObject(params).promise();
};

module.exports = { 
  uploadImageToS3,
  getImagesByIssueId,
  getImagesByUserId, 
  getImageById,
  deleteImageFromS3 };