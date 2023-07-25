// Import required modules and utilities
const User = require('../models/user');
const { createAccessToken, comparePasswords, errorHandler, encryptPassword } = require('../utils');

/**
 * Register a new user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with status and message.
 */
const registerUser = async (req, res) => {
  try {
    // Encrypt the password before storing it in the database
    const password = await encryptPassword({ password: req.body.password });
    await User.create({ ...req.body, password });

    // Respond with success message
    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    // Handle error and respond with error message
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message });
  }
}

/**
 * Log in a user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with status, message, user data, and access token.
 */
const userLogin = async (req, res) => {
  try {
    const { email_address, password } = req.body;
    let user = await User.findOne({ email_address });

    // Check if the user exists
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    // Compare the provided password with the stored encrypted password
    const isMatch = comparePasswords({ encrypted_password: user.password, raw_password: password });
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid email or password' });

    // Generate an access token for the user
    const token = createAccessToken({
      user_id: user._id,
      email_address: user.email_address,
    });

    // Respond with success message, user data (excluding password), and access token
    user = await User.findOne({ email_address }).select('-password');
    res.status(200).json({ success: true, message: 'User login successful', user, token });
  } catch (error) {
    // Handle error and respond with error message
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message });
  }
}

/**
 * Change a user's password.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with status and message.
 */
const changeUserPassword = async (req, res) => {
  try {
    const { email_address, password } = req.body;
    const user = await User.findOne({ email_address });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    } else {
      // Encrypt the new password and update the user's password in the database
      const new_password = await encryptPassword({ password });
      await User.findByIdAndUpdate(user._id, { password: new_password });

      // Respond with success message
      return res.status(200).json({ success: true, message: "User password successfully" });
    }
  } catch (error) {
    // Handle error and respond with error message
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message });
  }
}

/**
 * Update user information.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with status, message, updated user data, and access token.
 */
const updateUserInfo = async (req, res) => {
  try {
    // Find and update the user information in the database
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Generate a new access token for the user
    const token = createAccessToken({
      user_id: user._id,
      email_address: user.email_address,
    });

    // Respond with success message, updated user data, and access token
    return res.status(200).json({ success: true, message: "User updated successfully", user, token });
  } catch (error) {
    // Handle error and respond with error message
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message });
  }
}

// Export the route handlers
module.exports = { registerUser, userLogin, updateUserInfo, changeUserPassword };
