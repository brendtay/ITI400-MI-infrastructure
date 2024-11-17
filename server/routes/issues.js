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

// Route: Add a new issue (requires login)
router.post('/', authenticateToken, async (req, res) => {
    const { issueType, description, gpsCoords, city, county, photo } = req.body;
    const userId = req.user.user_id || null; // Set userID to null if not logged in

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