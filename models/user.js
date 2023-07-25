const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'User name is required'],
    unique: [true, 'username already exists']
  },
  email_address: {
    type: String,
    required: [true, 'Email address is required'],
    unique: [true, 'Email address already exists']
  },
  password: {
    type: String,
    min: [8, 'Password must be at least 8 characters'],
    required: [true, 'Password is required'],
  },
}, { timestamps: true });

const user = mongoose.model('user', userSchema);
module.exports = user;