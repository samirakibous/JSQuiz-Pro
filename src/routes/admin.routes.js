const express= require("express");
const router =express.Router();
// const { authenticateToken } = require('../middlewares/auth.middleware');
// const authorizeRoles = require("../middlewares/role.middleware");
const { authenticateToken } = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const adminController = require("../controllers/admin.controller");
const {authenticateToken} = require("../middlewares/auth.middleware");


router.post('/questions', authenticateToken,authorizeRoles('admin'), adminController.createQuestion);
router.put('/questions/:id', authenticateToken,authorizeRoles('admin'), adminController.updateQuestion);
router.delete('/questions/:id', authenticateToken, authorizeRoles('admin'), adminController.deleteQuestion);
module.exports = router;