const Student = require('../models/student');
const { google } = require('googleapis');
const QRCode = require('qrcode');

// Register a new student
exports.registerStudent = async (req, res) => {
    const {
        fullName, idNumber, sex, age, department, email, phoneNumber, interests, hasExperience, yearsOfExperience
    } = req.body;

    try {
        // Check if the student already exists
        const existingStudent = await Student.findOne({ idNumber });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already registered' });
        }

        // Create a new student instance
        const student = new Student({
            fullName,
            idNumber,
            sex,
            age,
            department,
            email,
            phoneNumber,
            interests,
            experience: {
                hasExperience,
                yearsOfExperience
            },
            isApproved: false, // Initially set to false
            attendance: [] // Initialize attendance array
        });

        // Save the student to the database
        await student.save();
        return res.status(201).json({ message: 'Student registered successfully', student });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Approve a student by admin
exports.approveStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update approval status
        student.isApproved = true;
        student.approvedDate = new Date();

        // Save changes to the student record
        await student.save();

        // Generate a QR code for the student (could be used for attendance later)
        const qrCode = await QRCode.toDataURL(student.idNumber);
        return res.json({ message: 'Student approved', student, qrCode });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Mark student attendance
exports.markAttendance = async (req, res) => {
    const { studentId } = req.params;
    const { status } = req.body; // 'Present' or 'Absent'

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Record attendance
        const attendanceRecord = { date: new Date(), status };
        student.attendance.push(attendanceRecord);

        // Save the updated attendance records
        await student.save();
        return res.json({ message: 'Attendance marked successfully', attendance: student.attendance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all students (admin view)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        return res.json(students);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get individual student details
exports.getStudentById = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.json(student);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Integrate student data with Google Sheets
exports.saveToGoogleSheets = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Set up Google Sheets API authentication
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Prepare the request to append student data
        const request = {
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A2:E',
            valueInputOption: 'RAW',
            resource: {
                values: [
                    [
                        student.fullName,
                        student.idNumber,
                        student.department,
                        student.email,
                        student.phoneNumber
                    ]
                ],
            },
        };

        // Append the student data to the Google Sheets
        await sheets.spreadsheets.values.append(request);
        return res.json({ message: 'Student saved to Google Sheets' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Export the functions for use in routes
module.exports = {
    registerStudent,
    approveStudent,
    markAttendance,
    getAllStudents,
    getStudentById,
    saveToGoogleSheets
};
