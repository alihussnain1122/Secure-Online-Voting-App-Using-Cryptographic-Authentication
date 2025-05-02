const Commission = require('../models/Commission');
const jwt = require('jsonwebtoken');

// controllers/commissionController.js

exports.loginCommission = async (req, res) => {
  const { username, password } = req.body;
  const commission = await Commission.findOne({ username });

  if (!commission || commission.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // ✅ Create JWT Token
  const token = jwt.sign({ id: commission._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // ❌ PROBLEM: Maybe you're returning wrong thing here
  return res.status(200).json({
    username: commission.username,
    password: commission.password, // ❌ Never send password!
    token, // ✅ THIS IS WHAT FRONTEND NEEDS
  });
};
