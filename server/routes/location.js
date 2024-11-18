const express = require('express');
const {     
    getIssuesByZipCode,
    getIssuesNearLocation, 
} = require('../db/locationQueries');

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

// Route: Get issues by zipcode (public access)
router.get('/zip/:zip', async (req, res) => {
    const { zip } = req.params;
    try {
        const issues = await getIssuesByZipCode(zip);
        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues by zip code:', error);
        res.status(500).json({ error: 'Failed to fetch issues by zip code.' });
    }
});

module.exports = router;