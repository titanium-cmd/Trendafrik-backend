const Question = require('../models/question');
const AnsweredQuestion = require('../models/answered_qustions');
const { errorHandler } = require('../utils');

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().select('-correct_answer').limit(10);
    return res.status(200).json({ success: true, questions });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message })
  }
}

const saveQuizResults = async (req, res) => {
  try {
    const user = req.user;
    const results = req.body;
    let totalScore = 0;
    for (let i = 0; i < results.questions.length; i++) {
      const result = results.questions[i];
      const { correct_answer } = await Question.findOne({ question_title: result.question_title });
      if (correct_answer === result.selected_answer) totalScore += 1;
    }
    await AnsweredQuestion.create({ results: req.body.questions, user_id: user._id, score: totalScore });
    return res.status(200).json({ success: true, message: 'Results saved successfully', score: totalScore })
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message })
  }
}

module.exports = { getQuestions, saveQuizResults }