const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./db');
const cors = require('cors');

connectDB();

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/quizzes', require('./routes/quizRoute'));

module.exports = app;
