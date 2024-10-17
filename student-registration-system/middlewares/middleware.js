const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Middleware to authenticate JWT for Admin routes
exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.adminId; // Store admin ID in request for further processing
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to validate student registration input
exports.validateStudentRegistration = [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('idNumber').notEmpty().withMessage('ID number is required'),
    body('sex').isIn(['Male', 'Female', 'Other']).withMessage('Sex must be Male, Female, or Other'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive integer'),
    body('department').notEmpty().withMessage('Department is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('interests').optional().isArray().withMessage('Interests must be an array'),
    body('hasExperience').isBoolean().withMessage('Has experience must be a boolean'),
    body('yearsOfExperience').optional().isInt({ min: 0 }).withMessage('Years of experience must be a non-negative integer'),

    // Custom validation for the validation result
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware to authorize admin roles (if you plan to have role-based access in the future)
exports.authorizeAdmin = (req, res, next) => {
    // Implement your admin role checks here
    // For now, just allowing all authenticated admins
    if (!req.admin) return res.status(403).json({ message: 'Access denied' });

    next();
};
