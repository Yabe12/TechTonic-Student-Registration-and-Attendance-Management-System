const express = require('express');
const router = express.Router();
const { studentController } = require('../controllers'); // Importing from index.js
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as necessary

// Student Routes
router.post('/register', studentController.registerStudent); // Public route for registration
router.put('/approve/:studentId', authMiddleware, studentController.approveStudent); // Admin-only route
router.put('/attendance/:studentId', authMiddleware, studentController.markAttendance); // Admin-only route
router.get('/', authMiddleware, studentController.getAllStudents); // Admin-only route
router.get('/:studentId', authMiddleware, studentController.getStudentById); // Admin-only route
router.post('/save-sheet/:studentId', authMiddleware, studentController.saveToGoogleSheets); // Admin-only route

module.exports = router;
