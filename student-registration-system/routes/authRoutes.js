const express = require('express');
const router = express.Router();
const { adminLogin, registerAdmin } = require('../controllers/index');
// const authMiddleware = require('../middleware/authMiddleware');

// Admin Routes
router.post('/login', adminLogin);
router.post('/register', registerAdmin);

module.exports = router;
