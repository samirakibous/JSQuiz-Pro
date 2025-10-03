const express = require('express');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const quizRoutes = require('./quiz.routes');
const { authenticateToken } = require('../middlewares/auth.middleware');
const Question = require('../models/question.model');
const Score = require('../models/score.model');


const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/api/quiz', quizRoutes);

// Modifier la route home pour récupérer les données
router.get('/', async (req, res) => {
    try {
        const thematiques = await Question.getThematiques();
        let userStats = null;
        let lastScore = null;
        let topUsers = [];

        if (req.session?.user) {
            const userId = req.session.user.id;
            const average = await Score.getUserAverage(userId);
            lastScore = await Score.getLastScore(userId);
            userStats = { ...req.session.user, average: Math.round(average * 100) / 100 };
        }

        topUsers = await Score.getTopUsers(5);

        res.render('home', {
            user: req.session?.user,
            userStats,
            lastScore,
            topUsers,
            thematiques
        });
    } catch (error) {
        res.render('home', {
            user: req.session?.user,
            userStats: null,
            lastScore: null,
            topUsers: [],
            thematiques: []
        });
    }
});


router.get('/quiz/:thematique', authenticateToken, (req, res) => {
    res.render('quiz', {
        user: req.user,
        thematique: req.params.thematique
    });
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register', { user: req.user || null });
});

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { user: req.user });
});

module.exports = router;
