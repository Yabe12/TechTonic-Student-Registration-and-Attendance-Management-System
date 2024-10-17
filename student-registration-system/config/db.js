const mongoose = require('mongoose');

// MongoDB connection URI for techtonic database
const dbURI = 'mongodb://localhost:27017/techtonic'; // replace with your URI if using MongoDB Atlas

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected to techtonic database...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
