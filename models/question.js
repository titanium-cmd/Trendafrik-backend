const mongoose = require('mongoose');

// Quiz question schema
const questionSchema = new mongoose.Schema({
  question_title: {
    type: String,
    required: [true, 'question title is required'],
  },
  correct_answer: {
    type: String,
    required: [true, 'correct answer is required'],
  },
  possible_answers: {
    type: [String],
    min: [2, 'possible answers must be at least 2 items'],
    required: [true, 'possible answers is required'],
  },
}, { timestamps: true });

const question = mongoose.model('question', questionSchema);
module.exports = question;