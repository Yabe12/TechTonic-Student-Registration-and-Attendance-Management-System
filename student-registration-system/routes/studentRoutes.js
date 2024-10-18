const express = require('express');
const router = express.Router();
const studentController = require('../controllers/index');
// const authMiddleware = require('../middlewares/authMiddleware');

// Student-related routes
router.post('/register', studentController.registerStudent);
router.put('/approve/:studentId', studentController.approveStudent);
router.put('/attendance/:studentId', studentController.markAttendance);
router.get('/', studentController.getAllStudents);
router.get('/:studentId', studentController.getStudentById);
router.post('/save-sheet/:studentId', studentController.saveToGoogleSheets);

module.exports = router;
