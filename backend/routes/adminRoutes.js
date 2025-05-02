// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const verifyToken = require('../middleware/authMiddleware'); // middleware for JWT
const { loginAdmin } = require('../controllers/adminController');
// @route   GET /api/admins
// @desc    Get all admins (for list view in ManageAdmins)
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const admins = await Admin.find().select('username city'); // show only required fields
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', loginAdmin);
module.exports = router;
