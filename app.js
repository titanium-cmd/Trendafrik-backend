// Import required modules and packages
require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Create an instance of the Express application
const app = express();
const PORT = process.env.PORT || 8000;

// Apply middleware for handling CORS, logging requests, parsing JSON and URL-encoded data, and handling cookies
app.use(cors()); // Allow Cross-Origin Resource Sharing (CORS)
app.use(logger('dev')); // Log HTTP requests to the console in development mode
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse incoming URL-encoded data

// Define routes for handling user-related and quiz-related endpoints
app.use('/api/v1/users', require('./routes/userRoute')); // User-related routes
app.use('/api/v1/quizzes', require('./routes/quizRoute')); // Quiz-related routes

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
  console.log('MONGODB CONNECTED');
  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
  })
}).catch((error) => {
  console.log('MONGODB CONNECTION ERROR:: ', error.message);
});
