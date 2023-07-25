const express = require('express');
const { getQuestions, saveQuizResults, getUserQuizResults } = require('../controllers/quizController');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * handle questions retrieval
 * @route {GET} /
 * @security JWT
 */
router.get('/', authMiddleware, getQuestions);

/**
 * handle questions retrieval
 * @route {POST} /
 * @security JWT
 */
router.post('/', authMiddleware, saveQuizResults);

/**
 * handle quiz results retrieval
 * @route {GET} /results
 * @security JWT
 */
router.get('/results', authMiddleware, getUserQuizResults);

module.exports = router;
