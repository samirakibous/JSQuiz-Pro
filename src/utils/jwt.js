const jwt = require('jsonwebtoken');
const {token} = require("mysql/lib/protocol/Auth");

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '24h'});
};
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
module.exports = {generateToken, verifyToken};