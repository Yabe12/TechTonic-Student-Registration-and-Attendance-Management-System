const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: 'Admin not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin registration (Only for first-time setup)
exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const admin = new Admin({ email, password });
        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to authenticate JWT for protected routes
exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.adminId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
