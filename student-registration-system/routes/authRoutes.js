const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers'); // Importing from index.js
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as necessary

// Admin Routes
router.post('/login', adminController.adminLogin);
router.post('/register', adminController.registerAdmin);
// Example protected route (only accessible for authenticated admins)
// router.get('/protected', authMiddleware, adminController.someProtectedFunction);

module.exports = router;
