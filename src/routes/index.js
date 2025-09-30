const express = require('express');
const userRoutes = require('./user.routes');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use('/api/users', userRoutes);

router.get('/', (req, res) => {
    res.render('home', { user: req.session?.user });
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { user: req.user });
});

module.exports = router;
