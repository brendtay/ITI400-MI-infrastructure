const express = require('express');
const multer = require('multer');
const { uploadImageToS3, getImagesByIssueId, getImagesByUserId, getImageById, deleteImageFromS3 } = require('../db/s3Queries');
const { authenticateToken, isRole } = require('../middleware/auth');

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
// Route to get all images for a specific issue
router.get('/issue/:issueId', authenticateToken, async (req, res) => {
    try {
      const { issueId } = req.params;
      const images = await getImagesByIssueId(issueId);
      res.status(200).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve images' });
    }
  });
  
  // Route to get all images uploaded by a specific user
  router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const images = await getImagesByUserId(userId);
      res.status(200).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve images' });
    }
  });
  
  // Route to get a single image by image ID
  router.get('/:imageId', authenticateToken, async (req, res) => {
    try {
        const { imageId } = req.params;
        const image = await getImageById(imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        console.error('Error fetching image by ID:', error);
        res.status(500).json({ error: 'Failed to fetch image.' });
    }
});

  // Route for Admins to delete image from S3
  router.delete('/:imageId', authenticateToken, isRole('Admin'), async (req, res) => {
    try {
        const { imageId } = req.params;
        const image = await getImageById(imageId);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Only allow Admins to delete the image
        await deleteImageFromS3(imageId);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});


module.exports = router;