const Student = require('../models/student');
const { google } = require('googleapis');
const QRCode = require('qrcode');

// Register a new student
exports.registerStudent = async (req, res) => {
    const {
        fullName, idNumber, sex, age, department, email, phoneNumber, interests, hasExperience, yearsOfExperience
    } = req.body;

    try {
        // Check if student already exists
        const existingStudent = await Student.findOne({ idNumber });
        if (existingStudent) return res.status(400).json({ message: 'Student already registered' });

        // Create a new student
        const student = new Student({
            fullName, idNumber, sex, age, department, email, phoneNumber,
            interests,
            experience: { hasExperience, yearsOfExperience },
            isApproved: false  // Initially set to false
        });

        // Save the student to the database
        await student.save();

        res.status(201).json({ message: 'Student registered successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve a student by admin
exports.approveStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.isApproved = true;
        student.approvedDate = new Date();

        // Save changes
        await student.save();

        // Generate and send a QR code as a response (could be used for attendance later)
        const qrCode = await QRCode.toDataURL(student.idNumber);
        res.json({ message: 'Student approved', student, qrCode });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark student attendance
exports.markAttendance = async (req, res) => {
    const { studentId } = req.params;
    const { status } = req.body; // 'Present' or 'Absent'

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const attendanceRecord = { date: new Date(), status };
        student.attendance.push(attendanceRecord);

        // Save the updated attendance
        await student.save();

        res.json({ message: 'Attendance marked successfully', attendance: student.attendance });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all students (admin view)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get individual student details
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

// Integrate student data with Google Sheets
exports.saveToGoogleSheets = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

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
                ]
            },
        };

        await sheets.spreadsheets.values.append(request);

        res.json({ message: 'Student saved to Google Sheets' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
