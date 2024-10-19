const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Student-related routes
router.post('/register', studentController.registerStudent);
router.post('/approve', studentController.approveStudent);
router.post('/attendance', studentController.markAttendance);
router.delete('/clear-sheet', studentController.clearGoogleSheet);
router.post('/api/save-attendance',studentController.saveToGoogleSheets);
// router.post('/save-sheet/:studentId', studentController.saveToGoogleSheets);

module.exports = router;
