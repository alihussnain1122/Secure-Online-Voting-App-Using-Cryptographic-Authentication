const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyAdminToken'); // middleware for JWT

// Routes
router.get('/admins', AdminController.getAllAdmins);
router.post('/admins', AdminController.createAdmin);
router.put('/admins', AdminController.updateAdmin);
router.post('/admin/delete', AdminController.deleteAdmin);
router.get('/profile', verifyToken, AdminController.getAdminProfile);
module.exports = router;
