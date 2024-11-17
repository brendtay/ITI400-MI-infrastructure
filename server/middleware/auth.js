const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Middleware to authenticate JWT tokens.
const authenticateToken = (req, res, next) => {
    try {
        // Retrieve the token from cookies or Authorization header
        const authHeader = req.headers['authorization']; 
        const headerToken = authHeader && authHeader.split(' ')[1]; 
        const cookieToken = req.cookies && req.cookies['token'];

        const jwtToken = headerToken || cookieToken;

        if (!jwtToken) {
            console.error("No token provided in request.");
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify the token
        jwt.verify(jwtToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("Invalid or expired token:", err.message);
                return res.status(403).json({ error: 'Invalid or expired token.' });
            }
            console.log("Verified User:", user); // Debugging
            req.user = user; // Attach user data to the request object
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        console.error("Error in authenticateToken middleware:", error.message);
        res.status(500).json({ error: 'Internal server error during authentication.' });
    }
};

// Middleware to authorize users based on role
const isRole = (requiredRole) => (req, res, next) => {
    try {
        if (!req.user) {
            console.error("No user data in request. Ensure the token is valid.");
            return res.status(401).json({ error: 'Unauthorized access.' });
        }

        if (req.user.role !== requiredRole) {
            console.error(`Access denied. User role: ${req.user.role}, Required role: ${requiredRole}`);
            return res.status(403).json({ error: `Access denied. ${requiredRole} only.` });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in isRole middleware:", error.message);
        res.status(500).json({ error: 'Internal server error during role verification.' });
    }
};

module.exports = {
    authenticateToken,
    isRole,
};