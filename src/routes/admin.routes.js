const express= require("express");
const router =express.Router();
const isAuthenticated = require('../middlewares/auth.middleware');
const authorizeRoles = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");
const {authenticateToken} = require("../middlewares/auth.middleware");

router.post('/questions', authenticateToken, adminController.createQuestion);
router.put('/questions/:id', authenticateToken, adminController.updateQuestion);
router.get('/users', authenticateToken, adminController.getAllUsers);
module.exports = router;