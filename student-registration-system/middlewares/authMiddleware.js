const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authMiddleware = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token after 'Bearer'

    // If no token is provided, deny access
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.adminId; // Attach the adminId to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' }); // Handle token verification errors
    }
};

module.exports = authMiddleware;
