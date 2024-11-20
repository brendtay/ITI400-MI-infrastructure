const express = require('express');
const {     
    getIssuesByZipCode,
    getIssuesNearLocation, 
} = require('../db/locationQueries');
const router = express.Router();

// Route: Get issues near a location (public access)
router.get('/nearby', async (req, res) => {
    const { lat, lng, radius } = req.query;

    // Validate latitude, longitude, and radius parameters
    if (!lat || !lng || !radius) {
        return res.status(400).json({ error: 'Please provide latitude, longitude, and radius in km.' });
    }

    try {
        const latitude = Number(lat);
        const longitude = Number(lng);
        const searchRadius = Number(radius);

        // Validate that latitude, longitude, and radius are valid numbers
        if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
            return res.status(400).json({ error: 'Latitude, longitude, and radius must be valid numbers.' });
        }

        // Fetch issues near the given location
        const issues = await getIssuesNearLocation(latitude, longitude, searchRadius);
        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues near location:', error);
        res.status(500).json({ error: 'Failed to fetch issues near location.' });
    }
});

// Route: Get issues by zip code (public access)
router.get('/nearby/:zip', async (req, res) => {
    const { zip } = req.params;

    // Validate the zip code format before proceeding
    if (!/^\d{5}$/.test(zip)) {
        return res.status(400).json({ error: 'Invalid zip code format. Please provide a 5-digit zip code.' });
    }

    try {
        // Fetch the issues by zip code using the existing function
        const issues = await getIssuesByZipCode(zip);

        // Check if any issues were found
        if (issues.length === 0) {
            return res.status(404).json({ message: 'No issues found for the provided zip code.' });
        }

        // Return the issues if found
        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues by zip code:', error);
        res.status(500).json({ error: 'Failed to fetch issues by zip code.' });
    }
});

module.exports = router;