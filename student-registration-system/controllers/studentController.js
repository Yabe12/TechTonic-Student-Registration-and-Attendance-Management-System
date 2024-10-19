const Student = require('../models/student');
const { verifyQRCode } = require('../service/qrCodeService'); 
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');


const { google } = require('googleapis');
const sheets = google.sheets('v4');
require('dotenv').config(); // Ensure you require dotenv to load .env variables

// Use the SPREADSHEET_ID from environment variables
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Initialize Google Sheets client
async function getSheetsClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: '../student-registration-system/config/credentials.json', // Path to your service account key file
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return await auth.getClient();
}
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
exports.markAttendance = async (req, res) => {
    const { idNumber, qrCode } = req.body; 

    try {
        let student;

       
        if (idNumber) {
            student = await Student.findOne({ idNumber: idNumber });
        }

       
        if (!student && qrCode) {
            const decodedIdNumber = await decodeQRCode(qrCode);
            student = await Student.findOne({ idNumber: decodedIdNumber });
        }

        if (!student) {
            console.log('Student not found in the database');
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create attendance entry
        const attendanceEntry = {
            status: 'Present',
            date: new Date(),
        };

        student.attendance.push(attendanceEntry);
        await student.save();

        res.json({ message: 'Attendance marked successfully', attendance: attendanceEntry });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.saveToGoogleSheets = async (req, res) => {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const attendanceType = req.body.attendanceType; // Expecting attendance type in request body (e.g., "Present", "Absent", "Permission")

    try {
        // Fetch all students from the database
        const students = await Student.find(); // Fetch all student records

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        // Prepare data for Google Sheets
        const attendanceData = students.map(student => [
            student.idNumber,
            student.email,
            attendanceType, // Assuming you want to mark all as the same attendance type for this save
            date,
            ...student.attendance.map(att => att.date), // Only include the `date` as a string (remove the object structure)
            // If you want to include the attendance type, use `att.type` instead or add another column for it
        ]);

        // Prepare the data to be added to the Google Sheet
        const resource = {
            values: attendanceData,
        };

        const authClient = await getSheetsClient();
        const request = {
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A1', // Adjust this range as needed
            valueInputOption: 'RAW',
            resource,
            auth: authClient,
        };

        // Append data to Google Sheets
        await sheets.spreadsheets.values.append(request);

        res.json({ message: 'Data saved to Google Sheets', attendanceData });
    } catch (error) {
        console.error('Error saving data to Google Sheets:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearGoogleSheet = async (req, res) => {
    try {
        const authClient = await getSheetsClient();
        const clearRequest = {
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A2:Z',
            auth: authClient,
        };

        await sheets.spreadsheets.values.clear(clearRequest);

        res.json({ message: 'All student data cleared from Google Sheets' });
    } catch (error) {
        console.error('Error clearing data from Google Sheets:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
