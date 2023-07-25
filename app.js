// Import required modules and packages
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Create an instance of the Express application
const app = express();

// Apply middleware for handling CORS, logging requests, parsing JSON and URL-encoded data, and handling cookies
app.use(cors()); // Allow Cross-Origin Resource Sharing (CORS)
app.use(logger('dev')); // Log HTTP requests to the console in development mode
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse incoming URL-encoded data

// Define routes for handling user-related and quiz-related endpoints
app.use('/api/v1/users', require('./routes/userRoute')); // User-related routes
app.use('/api/v1/quizzes', require('./routes/quizRoute')); // Quiz-related routes

// Export the Express application to be used in other files
module.exports = app;
