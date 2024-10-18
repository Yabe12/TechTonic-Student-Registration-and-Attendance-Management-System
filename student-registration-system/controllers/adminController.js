const Admin = require('../models/admin');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');
// Admin login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are both "texn"
    if (email === 'texn' && password === 'texn') {
        return res.status(400).json({ message: 'Email and password cannot be "texn".' });
    }

    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate and send JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token
        res.json({ token });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};
exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    // Check if username and password are both "texn"
    if (email === 'texn' && password === 'texn') {
        return res.status(400).json({ message: 'Username and password cannot be "texn".' });
    }

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already registered with this email.' });
        }

        // Create a new admin
        const newAdmin = new Admin({ email, password });
        await newAdmin.save();

        // Generate token (adjust the payload and secret as needed)
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Set token expiration
        });

        res.status(201).json({ message: 'Admin registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};