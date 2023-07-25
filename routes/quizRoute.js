const express = require('express');
const { getQuestions, saveQuizResults } = require('../controllers/quizController');
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

module.exports = router;
