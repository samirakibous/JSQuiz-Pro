const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const userId = await User.create({ username, password });
        res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findByUsername(username);
        if (!user || !(await User.validatePassword(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, username: user.username, role: user.role });
        req.session.token = token;
        req.session.user = { id: user.id, username: user.username, role: user.role };

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };
