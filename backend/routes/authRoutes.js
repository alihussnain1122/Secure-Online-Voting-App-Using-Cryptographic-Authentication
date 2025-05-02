const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Route to create a new admin
router.post('/admins', AdminController.createAdmin);

// Route to get all admins (example)
router.get('/admins', AdminController.getAllAdmins);

// Route to update an admin (example)
router.put('/api/admins', AdminController.updateAdmin);

// Route to delete an admin (example)
router.delete('/admins/:id', AdminController.deleteAdmin);
module.exports = router;
