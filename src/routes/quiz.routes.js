const express = require('express');
const { startQuiz, getQuestion, submitAnswer } = require('../controllers/quiz.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/start/:thematique', authenticateToken, startQuiz);
router.get('/question', authenticateToken, getQuestion);
router.post('/answer', authenticateToken, submitAnswer);

module.exports = router;
