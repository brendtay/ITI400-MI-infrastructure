const express = require('express');
const multer = require('multer');
const {
  uploadImageToS3,
  getImagesByIssueId,
  getImagesByUserId,
  getImageById,
  deleteImageFromS3
} = require('../db/imageQueries');
const { authenticateToken, isRole } = require('../middleware/auth');
const generatePresignedUrl = require('../index'); // Import the configured S3 instance

const router = express.Router();
const upload = multer();

// Endpoint to upload an image to S3 and save metadata to the database
router.post('/upload/:issueId', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { issueId } = req.params;
    const userId = req.user.user_id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageRecord = await uploadImageToS3(file, userId, issueId);
    res.status(201).json(imageRecord);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Route to get a pre-signed URL for an image by its key
router.get('/presigned-url', authenticateToken, async (req, res) => {
    const { key } = req.query;
  
    if (!key) {
      return res.status(400).json({ error: 'Missing "key" parameter in request' });
    }
  
    try {
      const bucketName = 'mi-infrastructure-images'; 
      const presignedUrl = generatePresignedUrl(bucketName, key);
      res.json({ url: presignedUrl });
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).json({ error: 'Failed to generate pre-signed URL' });
    }
  });

// Route to get all images for a specific issue
router.get('/issue/:issueId', authenticateToken, async (req, res) => {
  const { issueId } = req.params;
  const { limit = 10, offset = 0 } = req.query; // Pagination parameters

  try {
    const images = await getImagesByIssueId(issueId, parseInt(limit), parseInt(offset));
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images by issue ID:', error);
    res.status(500).json({ message: 'Failed to retrieve images' });
  }
});

// Route to get all images uploaded by a specific user
router.get('/user/:userId', authenticateToken, isRole('Admin'), isRole('MDOT Employee'), async (req, res) => {
  const { userId } = req.params;
  const { limit = 10, offset = 0 } = req.query; // Pagination parameters

  try {
    const images = await getImagesByUserId(userId, parseInt(limit), parseInt(offset));
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ message: 'Failed to retrieve images' });
  }
});

// Route: Get a single image by image ID
router.get('/:imageId', authenticateToken, async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await getImageById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    res.status(500).json({ message: 'Failed to fetch image' });
  }
});

// Route: Delete an image (restricted to Admin)
router.delete('/:imageId', authenticateToken, isRole('Admin'), async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await getImageById(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await deleteImageFromS3(imageId);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

module.exports = router;