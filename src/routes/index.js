const express = require('express');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { showDashboard } = require('../controllers/user.controller');

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/admin', adminRoutes);

router.get('/', (req, res) => {
    res.render('home', { user: req.session?.user });
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register', {user: req.user || null });
});

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { user: req.user });
});

// router.get('/dashboard', authenticateToken, showDashboard);

module.exports = router;
