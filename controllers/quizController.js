// Importing required models and utilities
const Question = require('../models/question');
const AnsweredQuestion = require('../models/answered_qustions');
const { errorHandler } = require('../utils');

/**
 * Fetches a list of random quiz questions from the database.
 * Returns a maximum of 10 questions with their titles and possible answers (excluding correct answers).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success flag and array of questions
 */
const getQuestions = async (req, res) => {
  try {
    // Fetch 10 random quiz questions from the database and exclude correct answers
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    const randomizedQuestions = questions.map(({ question_title, possible_answers }) => ({
      question_title,
      possible_answers,
    }));
    return res.status(200).json({ success: true, questions: randomizedQuestions });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message });
  }
}

/**
 * Saves the quiz results for a user to the database.
 * Calculates the total score based on the user's selected answers compared to correct answers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with success flag, message, and the user's score
 */
const saveQuizResults = async (req, res) => {
  try {
    // Extract user information from request sent from authMiddleware and quiz results from the request body
    const user = req.user;
    const results = req.body;

    // Calculate the total score for the user's quiz based on correct answers
    let totalScore = 0;
    for (let i = 0; i < results.questions.length; i++) {
      const result = results.questions[i];
      const { correct_answer } = await Question.findOne({ question_title: result.question_title });
      if (correct_answer === result.selected_answer) totalScore += 1;
    }

    // Save the quiz results to the AnsweredQuestion collection in the database
    await AnsweredQuestion.create({ results: req.body.questions, user_id: user._id, score: totalScore });

    // Respond with success message and the user's quiz score
    return res.status(200).json({ success: true, message: 'Results saved successfully', score: totalScore });
  } catch (error) {
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message });
  }
}


/**
 * Controller function to get the quiz results for a specific user.
 * Fetches the quiz results from the database based on the user's ID.
 * @param {Object} req - Express request object containing user information attached by authMiddleware
 * @param {Object} res - Express response object
 * @returns {Object} - Responds with the user's quiz results and a success message or an error message
 */
const getUserQuizResults = async (req, res) => {
  try {
    // Extract user information from the request object sent from authMiddleware
    const user = req.user;
    // Find the quiz results for the user based on their user_id in the AnsweredQuestion collection
    const results = await AnsweredQuestion.find({ user_id: user._id });

    // Respond with success message and the user's quiz results
    return res.status(200).json({ success: true, results });
  } catch (error) {
    // Handle any errors that occur during the process and respond with an appropriate error message
    const message = errorHandler(error);
    return res.status(400).json({ success: false, message });
  }
}

// Exporting the functions to be used in other modules
module.exports = { getQuestions, saveQuizResults, getUserQuizResults };