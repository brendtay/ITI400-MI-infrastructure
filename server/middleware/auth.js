const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Middleware to authenticate JWT tokens.
const authenticateToken = (req, res, next) => {
    try {
        // Retrieve the token from cookies or Authorization header
        const authHeader = req.headers['authorization'];
        const headerToken = authHeader ? authHeader.split(' ')[1] : null;
        const cookieToken = req.cookies ? req.cookies['auth_token'] : null;

        // Prefer token from cookies for better security
        const jwtToken = cookieToken || headerToken;

        // If no token is provided, log and return unauthorized
        if (!jwtToken) {
            console.warn("No token provided.");
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("Token verification failed:", err.message);
                return res.status(403).json({ error: "Invalid or expired token." });
            }

        console.log("Token verified. User:", user); // Debug user payload
        req.user = user;
        next();
    });
} catch (error) {
    console.error("Error in authenticateToken:", error.message);
    res.status(500).json({ error: "Internal server error during authentication." });
}
};

// Middleware to authorize users based on role
const isRole = (requiredRole) => (req, res, next) => {
    try {
        // Ensure the user is authenticated
        if (!req.user) {
            console.warn("No user data in request. Ensure the token is valid.");
            return res.status(401).json({ error: 'Unauthorized access.' });
        }

        // Check if the user's role matches the required role
        if (req.user.role !== requiredRole) {
            console.warn(`Access denied. User role: ${req.user.role}, Required role: ${requiredRole}`);
            return res.status(403).json({ error: `Access denied. ${requiredRole} only.` });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in isRole middleware:", error.message);
        res.status(500).json({ error: 'Internal server error during role verification.' });
    }
};

// Utility function to generate JWT tokens
const generateToken = (user) => {
    try {
        const payload = {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
        };
        const options = { expiresIn: '1h' }; // Token expiration set to 1 hour
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);

        console.log("Token generated for user:", payload); // Debugging
        return token;
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw new Error('Token generation failed.');
    }
};

// Utility function to send a token as a cookie
const sendTokenAsCookie = (res, token) => {
    try {
        res.cookie('auth_token', token, {
            httpOnly: true, // Prevent access to the cookie from client-side scripts
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Cross-origin compatibility
            maxAge: 3600000, // Token expiration: 1 hour
        });
        console.log("Token sent as cookie.");
    } catch (error) {
        console.error("Error sending token as cookie:", error.message);
        throw new Error('Failed to set token cookie.');
    }
};

// Expose functions and middleware
module.exports = {
    authenticateToken,
    isRole,
    generateToken,
    sendTokenAsCookie,
};