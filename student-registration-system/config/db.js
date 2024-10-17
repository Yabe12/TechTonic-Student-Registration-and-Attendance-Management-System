const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI; // Get the URI from environment variables
        if (!dbURI) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected to techtonic database...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the application with failure
    }
};

module.exports = connectDB;
