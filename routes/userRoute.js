const express = require('express');
const {
  userLogin,
  registerUser,
  updateUserInfo,
  changeUserPassword
} = require('../controllers/usersController');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * handle user login
 * @route {POST} /login
 * @param {string} email_address - Email of the user.
 * @param {string} password - Password of the user.
 */
router.post('/login', userLogin);


/**
 * Handle user registration
 * @route {POST} /
 * @param {string} fullname - Fullname of the user.
 * @param {string} email_address - Email of the user.
 * @param {string} password - Password of the user.
 */
router.post('/', registerUser);


/**
 * Handle user password change
 * @route {PUT} /password
 * @param {string} fullname - Registered fullname of the user.
 * @param {string} email_address - Registered email of the user.
 */
router.put('/password', changeUserPassword);


/**
 * Handle user info change (email, fullname)
 * @route {PUT} /password
 * @security JWT
 * @param {string} fullname - Registered fullname of the user.
 * @param {string} email_address - Registered email of the user.
 */
router.put('/', authMiddleware, updateUserInfo);

module.exports = router;
