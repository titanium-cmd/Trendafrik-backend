require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//Authorize every request coming from the client side 
const authMiddleware = async (req, res, next) => {
  try {
    // Get authorization from requrest headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Unauthorized to access this route' })
    }
    const bearerToken = authHeader.split(' ')[1]; //retrieve token from authorization
    const { payload } = jwt.verify(bearerToken, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ success: false, message: 'Unauthorized to access this route' })
    }
    const user = await User.findById(payload.user_id);    
    req.user = user;
    next();
  } catch (error) {
    const message = error.name === 'JsonWebTokenError' ? 'Unauthorized to access this route' : error.message;
    return res.status(401).json({ success: false, message });
  }
}

module.exports = { authMiddleware }