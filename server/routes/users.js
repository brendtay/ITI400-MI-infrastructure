const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    getAllUsers,
    isEmailTaken,
    getUserByEmail,
    getUserById,
    createUser,
    assignRoleToUser,
    getAllRoles,
    searchUsers,
    deleteUserById
} = require('../db/userQueries');
const { authenticateToken, isRole } = require('../middleware/auth');

const router = express.Router();

// Route: Get all users (admin-only)
router.get('/', authenticateToken, isRole('Admin'), async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.SECURE_COOKIES === 'true',
            sameSite: 'Strict',
            maxAge: 3600000
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

// Route: Get user by ID (admin or the user themselves)
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Allow users to fetch their own data or admins to fetch any user's data
        if (req.user.user_id !== parseInt(id) && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Admins only or the user themselves.' });
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
});

// Route: Assign a role to a user (admin-only)
router.put('/:id/role', authenticateToken, isRole('Admin'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const updatedUser = await assignRoleToUser(id, role);
        res.json({ message: 'Role updated successfully.', updatedUser });
    } catch (error) {
        console.error('Error assigning role:', error);
        res.status(500).json({ error: 'Failed to assign role.' });
    }
});

// Route: Get all roles (admin-only)
router.get('/roles', authenticateToken, isRole('Admin'), async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Failed to fetch roles.' });
    }
});

// Route: Search for users by name or email (admin-only)
router.get('/search', authenticateToken, isRole('Admin'), async (req, res) => {
    const { searchTerm } = req.query;

    try {
        if (!searchTerm) {
            return res.status(400).json({ error: 'Search term is required.' });
        }

        const users = await searchUsers(searchTerm);
        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Failed to search users.' });
    }
});

// Route: Delete a user (admin-only)
router.delete('/:id', authenticateToken, isRole('Admin'), async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await deleteUserById(id);
        res.json({ message: 'User deleted successfully.', deletedUser });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});

module.exports = router;