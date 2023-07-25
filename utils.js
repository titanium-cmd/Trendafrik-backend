require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const errorHandler = (err) => {
  const { message, code, errors } = err;
  let errorMessage = '';
  if (message.includes('validation failed')) {
    if (Object.keys(errors).length > 0) {
      errorMessage = Object.values(errors)[0].properties.message;
    }
  }
  if (code === 11000) {
    errorMessage = `${Object.values(err.keyValue)[0]} already exists`
  }
  if (errorMessage === '') {
    errorMessage = err.message;
  }

  return errorMessage;
}

const comparePasswords = ({ raw_password, encrypted_password }) => {
  return bcrypt.compareSync(raw_password, encrypted_password);
}

const encryptPassword = async ({ password }) => {
  const salt = await bcrypt.genSaltSync(10);
  const encryptedPassword = await bcrypt.hashSync(password, salt);
  console.log(encryptedPassword);
  return encryptedPassword;
}

const createAccessToken = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: "72h",
  });
};

module.exports = {
  createAccessToken,
  encryptPassword,
  comparePasswords,
  errorHandler
}
