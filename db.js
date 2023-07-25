// Import required modules and packages
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose'); // MongoDB ODM library

// Define the connectDB function to establish a connection to the MongoDB database
const connectDB = async () => {
  try {
    // Use mongoose to connect to the MongoDB database using the MONGO_DB_URI from environment variables
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('DB connected'); // Log a success message if the connection is successful
  } catch (error) {
    console.log('DB not connected ', error.message); // Log an error message if the connection fails
  }
}

// Export the connectDB function to be used in other files
module.exports = connectDB;
