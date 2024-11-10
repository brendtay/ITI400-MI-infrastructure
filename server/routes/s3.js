const express = require('express');
const multer = require('multer');
const { uploadImageToS3, getImagesByIssueId, getImagesByUserId, getImageById, deleteImageFromS3 } = require('../db/s3Queries');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer();

// Endpoint to upload an image to S3 and save metadata to the database
router.post('/upload/:issueId', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { issueId } = req.params;
    const userId = req.user.id; 
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageRecord = await uploadImageToS3(file, userId, issueId);
    res.status(201).json(imageRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Route to get all images for a specific issue
router.get('/issue/:issueId', authMiddleware, async (req, res) => {
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
  router.get('/user/:userId', authMiddleware, async (req, res) => {
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
  router.get('/:imageId', authMiddleware, async (req, res) => {
    try {
      const { imageId } = req.params;
      const image = await getImageById(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      res.status(200).json(image);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve image' });
    }
  });

  // Route to delete image from S3
  router.delete('/:imageId', authMiddleware, async (req, res) => {
    try {
      const { imageId } = req.params;
  
      // Only allow the user who uploaded the image or an admin to delete it
      const image = await getImageById(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      if (image.uploaded_by !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to delete this image' });
      }
  
      await deleteImageFromS3(imageId);
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete image' });
    }
  });

module.exports = router;