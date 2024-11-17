const express = require('express');
const {
    insertIssue,
    updateIssueStatus,
    getAllIssueTypes,
    insertLocation,
    getIssuesByUser,
    getIssuesByLocation,
    addImageToIssue
} = require('../db/issueQueries');
const { uploadImageToS3 } = require('../db/imageQueries');
const { authenticateToken, isRole } = require('../middleware/auth');

const router = express.Router();

// Route: Get issues by user (now accessible to authenticated users)
router.get('/user', authenticateToken, async (req, res) => {
    const userId = req.user.user_id;
    try {
        const issues = await getIssuesByUser(userId);
        res.json(issues);
    } catch (error) {
        console.error('Error fetching user issues:', error);
        res.status(500).json({ error: 'Failed to fetch user issues.' });
    }
});

// Route: Get issues near a location (public access)
router.get('/nearby', async (req, res) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng || !radius) {
        return res.status(400).json({ error: 'Please provide latitude, longitude, and radius in km.' });
    }

    try {
        const issues = await getIssuesNearLocation(Number(lat), Number(lng), Number(radius));
        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues near location:', error);
        res.status(500).json({ error: 'Failed to fetch issues near location.' });
    }
});

// Route: Get all issue types (public access)
router.get('/types', async (req, res) => {
    try {
        const issueTypes = await getAllIssueTypes();
        res.json(issueTypes);
    } catch (error) {
        console.error('Error fetching issue types:', error);
        res.status(500).json({ error: 'Failed to fetch issue types.' });
    }
});

// Route: Get issue by ID (public access)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const issue = await getIssueById(id);
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found.' });
        }
        res.json(issue);
    } catch (error) {
        console.error('Error fetching issue by ID:', error);
        res.status(500).json({ error: 'Failed to fetch issue.' });
    }
});


// Route: Add a new issue (requires login)
router.post('/', authenticateToken, async (req, res) => {
    const { captchaToken, issueType, description, gpsCoords, city, county, photo } = req.body;
    const userId = req.user.user_id || null; // Set userID to null if not logged in
      // Step 1: Verify reCAPTCHA token
      try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken,
            },
        });

        if (!response.data.success) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return res.status(500).json({ error: 'reCAPTCHA verification failed.' });
    }

    // Continue with the existing issue handling logic...
    try {
        // Insert issue, upload photo if present, etc.
        // (Existing code for handling the issue creation)
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ error: 'Failed to create issue.' });
    }

    try {
        // Step 1: Insert location if location data is provided
        let locationId = null;
        if (gpsCoords || city || county) {
            const locationData = {
                gpsCoords: gpsCoords || null,
                city: city || null,
                county: county || null
            };
            locationId = await insertLocation(locationData);
        }

        // Step 2: Insert the issue in the infrastructure_issue table
        const issueData = {
            userId,
            issueType,
            statusType: 'Pending', // Set default status
            description,
            locationId,
            createdTime: new Date(),
            updatedTime: new Date(),
        };
        const issue = await insertIssue(issueData);

        // Step 3: If a photo is provided, upload to S3 and associate it with the issue
        if (photo) {
            const imageRecord = await uploadImageToS3(photo, userId, issue.issue_id);
            issue.image = imageRecord;
        }

        res.status(201).json({ message: 'Issue created successfully.', issue });
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ error: 'Failed to create issue.' });
    }
});

// Route: Update issue status (MDOT Employee or Admin only)
router.put('/:id/status', authenticateToken, isRole('Admin'), isRole('MDOT Employee'), async (req, res) => {
    const { id } = req.params;
    const { status_type } = req.body;
    try {
        await updateIssueStatus(id, status_type);
        res.json({ message: 'Issue status updated successfully.' });
    } catch (error) {
        console.error('Error updating issue status:', error);
        res.status(500).json({ error: 'Failed to update issue status.' });
    }
});

// Route: Get issues by user (MDOT Employee or Admin only)
router.get('/user', authenticateToken, isRole('Admin'), isRole('MDOT Employee'), async (req, res) => {
    const userId = req.user.user_id;
    try {
        const issues = await getIssuesByUser(userId);
        res.json(issues);
    } catch (error) {
        console.error('Error fetching user issues:', error);
        res.status(500).json({ error: 'Failed to fetch user issues.' });
    }
});

// Route: Get issues by location (public access)
router.get('/location/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const issues = await getIssuesByLocation(id);
        res.json(issues);
    } catch (error) {
        console.error('Error fetching location issues:', error);
        res.status(500).json({ error: 'Failed to fetch location issues.' });
    }
});

// Route: Add an image to an existing issue (requires login)
router.post('/:id/image', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id;
    const { photo } = req.body;

    try {
        if (!photo) {
            return res.status(400).json({ error: 'No image provided.' });
        }

        const imageRecord = await uploadImageToS3(photo, userId, id);
        const linkedImage = await addImageToIssue(imageRecord.image_url, id, userId);

        res.status(201).json({ message: 'Image added successfully.', linkedImage });
    } catch (error) {
        console.error('Error adding image to issue:', error);
        res.status(500).json({ error: 'Failed to add image to issue.' });
    }
});

module.exports = router;