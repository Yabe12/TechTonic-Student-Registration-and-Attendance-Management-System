const express = require('express');
const router = express.Router();

// Import route modules
const studentRoutes = require('./student');
const adminRoutes = require('./admin');

// Use route modules with their base paths
router.use('/students', studentRoutes); // Base path for student routes
router.use('/admins', adminRoutes); // Base path for admin routes

// List of all available routes
router.get('/routes', (req, res) => {
    const routesList = [
        { method: 'POST', path: '/students/register', description: 'Register a new student' },
        { method: 'PUT', path: '/students/approve/:studentId', description: 'Approve a student (Admin only)' },
        { method: 'PUT', path: '/students/attendance/:studentId', description: 'Mark student attendance (Admin only)' },
        { method: 'GET', path: '/students', description: 'Get all students (Admin only)' },
        { method: 'GET', path: '/students/:studentId', description: 'Get student details (Admin only)' },
        { method: 'POST', path: '/students/save-sheet/:studentId', description: 'Save student data to Google Sheets (Admin only)' },

        { method: 'POST', path: '/admins/login', description: 'Admin login' },
        { method: 'POST', path: '/admins/register', description: 'Register a new admin' },
        // Example of a protected admin route (uncomment if you create one)
        // { method: 'GET', path: '/admins/protected', description: 'Protected admin route' },
    ];
    res.json(routesList);
});

module.exports = router;
