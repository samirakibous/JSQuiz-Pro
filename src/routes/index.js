const express = require('express');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const quizRoutes = require('./quiz.routes');
const { authenticateToken } = require('../middlewares/auth.middleware');
const Question = require('../models/question.model');

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/api/quiz', quizRoutes);

router.get('/', async (req, res) => {
    try {
        const thematiques = await Question.getThematiques();
        res.render('home', {
            user: req.session?.user,
            thematiques
        });
    } catch (error) {
        res.render('home', {
            user: req.session?.user,
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
