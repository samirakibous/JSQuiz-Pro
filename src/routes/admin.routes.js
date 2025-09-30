const express= require("express");
const router =express.Router();
const isAuthenticated = require('../middlewares/auth.middleware');
const authorizeRoles = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

router.post('/questions', adminController.createQuestion);
router.put('/questions/:id', adminController.updateQuestion);
router.get('/users', adminController.getAllUsers);
module.exports = router;