const Admin = require('../models/admin');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (email === 'texn' && password === 'texn') {
        return res.status(400).json({ message: 'Email and password cannot be "texn".' });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Server error' });
    }
};
exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (email === 'texn' && password === 'texn') {
        return res.status(400).json({ message: 'Username and password cannot be "texn".' });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already registered with this email.' });
        }
        const newAdmin = new Admin({ email, password });
        await newAdmin.save();
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Set token expiration
        });

        res.status(201).json({ message: 'Admin registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};