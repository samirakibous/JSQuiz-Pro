const {verifyToken} = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
    const token = req.session?.token || req.headers['authorization']?.split(''[1]);

    if (!token) {
         return res.status(401).redirect('/login');
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return  res.status(403).redirect('/login');
    }
};
module.exports = {authenticateToken};