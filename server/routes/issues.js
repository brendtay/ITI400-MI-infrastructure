const express = require('express');
const { addNewIssue, updateIssueStatus, getAllIssueTypes } = require('../db/issueQueries');
const { authenticateToken, isRole } = require('../middleware/auth');

const router = express.Router();

// Route: Get all issue types (public access)
router.get('/types', async (req, res) => {
    try {
        const issueTypes = await getAllIssueTypes();
        res.json(issueTypes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch issue types.' });
    }
});

// Route: Add a new issue (requires login)
router.post('/', authenticateToken, async (req, res) => {
    const issue = { ...req.body, user_id: req.user.user_id };
    try {
        await addNewIssue(issue);
        res.status(201).json({ message: 'Issue created successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create issue.' });
    }
});

// Route: Update issue status (MDOT Employee or Admin only)
router.put('/:id/status', authenticateToken, isRole('MDOT Employee'), async (req, res) => {
    const { id } = req.params;
    const { status_type } = req.body;
    try {
        await updateIssueStatus(id, status_type);
        res.json({ message: 'Issue status updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update issue status.' });
    }
});

module.exports = router;