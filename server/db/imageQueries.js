const { s3, pool } = require('./index');

// Upload images to S3
const uploadImageToS3 = async (file, userId, issueId) => {
  if (!file || !userId || !issueId) {
    throw new Error('Missing required parameters for uploading image');
  }

  const params = {
    Bucket: 'mi-infrastructure-images',
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Upload image to S3
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location;

    // Store the image metadata in the database
    const query = `
      INSERT INTO images (issue_id, image_url, uploaded_by)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [issueId, imageUrl, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image');
  }
};

// Get all images for a specific issue
const getImagesByIssueId = async (issueId, limit = 10, offset = 0) => {
  try {
    const query = `
      SELECT * FROM images
      WHERE issue_id = $1
      ORDER BY created_time DESC
      LIMIT $2 OFFSET $3;
    `;
    const values = [issueId, limit, offset];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching images by issue ID:', error);
    throw new Error('Failed to fetch images for the issue');
  }
};

// Get all images uploaded by a specific user
const getImagesByUserId = async (userId, limit = 10, offset = 0) => {
  try {
    const query = `
      SELECT * FROM images
      WHERE uploaded_by = $1
      ORDER BY created_time DESC
      LIMIT $2 OFFSET $3;
    `;
    const values = [userId, limit, offset];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching images by user ID:', error);
    throw new Error('Failed to fetch user images');
  }
};

// Get image metadata by image_id
const getImageById = async (imageId) => {
  try {
    const query = `
      SELECT * FROM images
      WHERE image_id = $1;
    `;
    const values = [imageId];
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      throw new Error('Image not found');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching image metadata:', error);
    throw new Error('Failed to fetch image metadata');
  }
};

// Delete image from S3
const deleteImageFromS3 = async (imageId) => {
  try {
    // Fetch image URL from the database
    const query = `DELETE FROM images WHERE image_id = $1 RETURNING image_url;`;
    const values = [imageId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new Error('Image not found');
    }

    const imageUrl = result.rows[0].image_url;
    const s3Key = imageUrl.split('/').pop(); // Extract the S3 key from the URL

    // Delete the image from S3
    const params = {
      Bucket: 'mi-infrastructure-images',
      Key: s3Key
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting image from S3 or database:', error);
    throw new Error('Failed to delete image');
  }
};

module.exports = { 
  uploadImageToS3,
  getImagesByIssueId,
  getImagesByUserId, 
  getImageById,
  deleteImageFromS3 };