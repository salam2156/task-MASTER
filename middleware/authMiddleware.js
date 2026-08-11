// TaskMaster - Authentication Middleware
// PHASE 4: Authentication Backend
// Protects private routes - only authenticated users can access them

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token and attach the user to the request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;