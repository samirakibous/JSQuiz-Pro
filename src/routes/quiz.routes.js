const express = require('express');
const { startQuiz, submitAnswer } = require('../controllers/quiz.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/start/:thematique', authenticateToken, startQuiz);
router.post('/answer', authenticateToken, submitAnswer);

module.exports = router;
