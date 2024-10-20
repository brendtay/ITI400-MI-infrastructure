const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

//Middleware to authenticate JWT tokens.

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 

    const cookieToken = req.cookies && req.cookies['token'];

    const jwtToken = token || cookieToken;

    if (!jwtToken) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next(); 
    });
};

//Authorize users based on role

const isRole = (requiredRole) => (req, res, next) => {
    try {
        // Check if the user's role matches the required role
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Access denied. ${requiredRole} only.` });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during role verification.' });
    }
};

module.exports = {
    authenticateToken,
    isRole
};