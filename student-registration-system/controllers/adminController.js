const Admin = require('../models/admin');
const jwt = require('jsonwebtoken'); 
// Admin login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate and send JWT token (implement JWT signing here)
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
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