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
        { method: 'POST', path: '/students/attendance', description: 'Mark attendance for a student' },
        { method: 'POST', path: '/students/api/save-attendance', description: 'Save student data to Google Sheets' },
        { method: 'POST', path: '/admins/login', description: 'Admin login' },
        { method: 'delete', path: '/students/clear-sheet', description: 'Admin login' },
        { method: 'POST', path: '/admins/register', description: 'Register a new admin' },
    ];
    res.json(routesList);
});

module.exports = router;
