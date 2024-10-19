const mongoose = require('mongoose');

// Define the schema for experience
const experienceSchema = new mongoose.Schema({
    hasExperience: {
        type: Boolean,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        default: 0
    }
});

// Define the schema for attendance
const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    }
});

// Define the Student schema
const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    idNumber: {
        type: String, // Changed from Mixed to String
        required: true,
        unique: true,
        trim: true
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    interests: {
        type: [String],
        default: []
    },
    experience: experienceSchema,
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedDate: {
        type: Date
    },
    attendance: [attendanceSchema]
}, { timestamps: true });

// Create and export the Student model
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
