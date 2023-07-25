const mongoose = require('mongoose');

// Quiz question schema
const answeredQuestionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'user id is required'],
  },
  score: {
    type: Number,
    required: [true, 'user id is required'],
  },
  results: {
    type: [{
      question_title: String,
      correct_answer: String,
      possible_answers: [String],
      selected_answer: String
    }],
    required: [true, 'correct answer is required'],
  }
}, { timestamps: true });

const answeredQuestions = mongoose.model('answeredQuestions', answeredQuestionsSchema);
module.exports = answeredQuestions;