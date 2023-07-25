// Import required packages and modules
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

/**
 * Function to handle and format error messages from Mongoose validation errors and other errors
 * @param {Object} err - The error object
 * @returns {string} - Formatted error message
 */
const errorHandler = (err) => {
  const { message, code, errors } = err;
  let errorMessage = '';

  // Check if the error message includes 'validation failed' which indicates a Mongoose validation error
  if (message.includes('validation failed')) {
    if (Object.keys(errors).length > 0) {
      errorMessage = Object.values(errors)[0].properties.message;
    }
  }

  // Check if the error code is 11000 which indicates a duplicate key error (unique constraint violation)
  if (code === 11000) {
    errorMessage = `${Object.values(err.keyValue)[0]} already exists`
  }

  // If the error message is still empty, use the default error message from the error object
  if (errorMessage === '') {
    errorMessage = err.message;
  }

  return errorMessage;
}

/**
 * Function to compare raw password with encrypted password using bcrypt
 * @param {Object} params - An object containing the raw_password and encrypted_password
 * @returns {boolean} - True if passwords match, otherwise false
 */
const comparePasswords = ({ raw_password, encrypted_password }) => {
  return bcrypt.compareSync(raw_password, encrypted_password);
}

/**
 * Function to encrypt a password using bcrypt with salt rounds of 10
 * @param {Object} params - An object containing the password to be encrypted
 * @returns {string} - Encrypted password
 */
const encryptPassword = async ({ password }) => {
  const salt = await bcrypt.genSaltSync(10);
  const encryptedPassword = await bcrypt.hashSync(password, salt);
  return encryptedPassword;
}

/**
 * Function to create an access token using JWT (JSON Web Token) with a payload and expiration time of 72 hours
 * @param {Object} payload - The payload to be included in the token
 * @returns {string} - JWT access token
 */
const createAccessToken = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: "72h",
  });
};

// Export the functions to be used in other modules
module.exports = {
  createAccessToken,
  encryptPassword,
  comparePasswords,
  errorHandler
}
