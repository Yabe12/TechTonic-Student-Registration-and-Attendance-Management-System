const Student = require('../models/student');

// Register a new student
exports.registerStudent = async (req, res) => {
    const studentData = req.body;

    try {
        const newStudent = new Student(studentData);
        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve a student
exports.approveStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.isApproved = true;
        student.approvedDate = Date.now();
        await student.save();
        res.json({ message: 'Student approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
    const { studentId } = req.params;
    const { status } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.attendance.push({ status });
        await student.save();
        res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Save student data to Google Sheets
exports.saveToGoogleSheets = async (req, res) => {
    // Implement Google Sheets saving logic here
    res.json({ message: 'Data saved to Google Sheets' });
};
