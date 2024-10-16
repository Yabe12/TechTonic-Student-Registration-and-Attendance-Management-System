const express = require('express');
const router = express.Router();
const studentRoutes = require('./studentRoutes');
const adminRoutes = require('./authRoutes');

// Use route modules with their base paths
router.use('/students', studentRoutes);
router.use('/admins', adminRoutes);

// List of all available routes
router.get('/routes', (req, res) => {
    const routesList = [
        { method: 'POST', path: '/students/register', description: 'Register a new student' },
        { method: 'PUT', path: '/students/approve/:studentId', description: 'Approve a student (Admin only)' },
        { method: 'PUT', path: '/students/attendance/:studentId', description: 'Mark attendance for a student' },
        { method: 'GET', path: '/students', description: 'Get all students' },
        { method: 'GET', path: '/students/:studentId', description: 'Get student by ID' },
        { method: 'POST', path: '/students/save-sheet/:studentId', description: 'Save student data to Google Sheets' },
        { method: 'POST', path: '/admins/login', description: 'Admin login' },
        { method: 'POST', path: '/admins/register', description: 'Register a new admin' },
    ];
    res.json(routesList);
});

module.exports = router;
