const Student = require('../models/student');

const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525, // Use the port number provided by Mailtrap
    auth: {
        user: process.env.MAILTRAP_USER, // Your Mailtrap SMTP user
        pass: process.env.MAILTRAP_PASSWORD // Your Mailtrap SMTP password
    }
});

exports.registerStudent = async (req, res) => {
    const studentData = req.body;

    try {

        const existingStudent = await Student.findOne({ email: studentData.email });
        
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }

       
        const newStudent = new Student(studentData);
        await newStudent.save();
        
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Server error' });
    }
};


exports.approveStudent = async (req, res) => {
    const { idNumber } = req.body; // Expecting idNumber in the request body

    try {
        const student = await Student.findOne({ idNumber });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Approve the student
        student.isApproved = true;
        student.approvedDate = Date.now(); // Set the approval date
        await student.save();

        // Generate a QR code for the student's ID number
        const qrCodeUrl = await QRCode.toDataURL(student.idNumber);

        // Send an email with the QR code
        const mailOptions = {
            from: process.env.EMAIL_FROM, // Use the environment variable
            to: student.email,
            subject: 'Your Registration Approved',
            html: `<h1>Your Registration is Approved</h1>
                   <p>Use this QR code for your student ID:</p>
                   <img src="${qrCodeUrl}" alt="QR Code" />`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Student approved successfully and notified via email.' });
    } catch (error) {
        console.error(error);
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
