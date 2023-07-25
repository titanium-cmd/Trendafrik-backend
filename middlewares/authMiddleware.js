// Import required dependencies and models
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware function to authorize requests coming from the client side.
 * Verifies the JWT token in the request headers and attaches the corresponding user to the request object.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Function} - Calls the next middleware function or returns an error response
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get authorization header from request
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Unauthorized to access this route' });
    }
    const bearerToken = authHeader.split(' ')[1]; // Retrieve token from authorization header
    const { payload } = jwt.verify(bearerToken, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ success: false, message: 'Unauthorized to access this route' });
    }
    // Find the user associated with the token's user_id and attach it to the request object
    const user = await User.findById(payload.user_id);
    req.user = user;
    next(); // Call the next middleware function
  } catch (error) {
    // Handle JWT token verification errors and respond with an appropriate error message
    const message = error.name === 'JsonWebTokenError' ? 'Unauthorized to access this route' : error.message;
    return res.status(401).json({ success: false, message });
  }
}

// Export the authMiddleware function to be used in other modules
module.exports = { authMiddleware };
