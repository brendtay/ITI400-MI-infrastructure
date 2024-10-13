const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require('../db/queries');
const { authenticateToken, isRole } = require('../middleware/auth');

const router = express.Router();

// Route: Get all users (admin-only)
router.get('/', authenticateToken, isRole('Admin'), async (req, res) => {
    try {
        const users = await queries.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error); // Improved error handling
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// Route: Register a new user (default role: User)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (await queries.isEmailTaken(email)) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await queries.createUser({ name, email, password_hash });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user.' });
    }
});

// Route: User login and token generation
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await queries.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login.' });
    }
});

module.exports = router;