const express = require('express');
const router = express.Router();
const {
    registerStudent, approveStudent, markAttendance,
    getAllStudents, getStudentById, saveToGoogleSheets
} = require('../controllers/studentController');
const { authMiddleware } = require('../controllers/authController');

// Student Routes
router.post('/register', registerStudent);
router.put('/approve/:studentId', authMiddleware, approveStudent);
router.put('/attendance/:studentId', authMiddleware, markAttendance);
router.get('/', authMiddleware, getAllStudents);
router.get('/:studentId', authMiddleware, getStudentById);
router.post('/save-sheet/:studentId', authMiddleware, saveToGoogleSheets);

module.exports = router;
