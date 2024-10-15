const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAllUsers, isEmailTaken, getUserByEmail, createUser } = require('../db/userQueries');
const { authenticateToken, isRole } = require('../middleware/auth');

const router = express.Router();

// Route: Get all users (admin-only)
router.get('/', authenticateToken, isRole('Admin'), async (req, res) => {
    try {
        const users = await getAllUsers();
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
        if (await isEmailTaken(email)) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await createUser({ name, email, password_hash });

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
        const user = await getUserByEmail(email);
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

        // Store the token in an HTTP-only, secure cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent client-side JS access to the cookie
            secure: process.env.SECURE_COOKIES === 'true', // Send over HTTPS only in production
            sameSite: 'Strict', 
            maxAge: 3600000 // 1 hour (in ms)
        });

        res.json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login.' });
    }
});

// Route: User logout (clear the token cookie)
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.SECURE_COOKIES === 'true',
            sameSite: 'Strict',
        });
        res.json({ message: 'Logout successful.' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Failed to logout.' });
    }
});


module.exports = router;