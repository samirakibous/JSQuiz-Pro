const express = require('express');
const { register, login, logout } = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', authenticateToken, logout);

module.exports = router;
