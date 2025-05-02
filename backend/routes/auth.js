const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const Voter = require('../models/Voter');
const Commission = require('../models/Commission');
const { GridFsStorage } = require('multer-gridfs-storage');
const { registerVoter } = require('../controllers/authController');

const router = express.Router();
console.log("✅ Auth router loaded");

// ===============================
// JWT Token Verification Middleware
// ===============================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// ===============================
// GridFS Storage Setup
// ===============================
let upload;

const connectUpload = async () => {
  try {
    const storage = new GridFsStorage({
      url: process.env.MONGO_URI,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const filename = 'photo_' + Date.now() + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'photos'
          };
          resolve(fileInfo);
        });
      },
    });

    upload = multer({ storage });
    console.log('✅ GridFS Storage initialized');
  } catch (err) {
    console.error('❌ Failed to set up GridFS storage:', err);
  }
};

connectUpload(); // call the setup function
router.post('/register', upload.single('photo'), registerVoter);
// ===============================
// Commission Login
// ===============================
router.post('/commission/login', async (req, res) => {
  console.log('Commission login route hit');
  const { username, password } = req.body;
  
  try {
    const commission = await Commission.findOne({ username });
    if (!commission) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await commission.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: commission._id, role: 'commission' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===============================
// Voter Registration (with photo upload & token check)
// ===============================
router.post('/register', verifyToken, async (req, res, next) => {
  if (!upload) return res.status(500).json({ message: 'Upload service not initialized yet' });

  upload.single('photo')(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Error uploading file' });
    }

    try {
      const { CNIC, voterID, name, phone } = req.body;

      if (!req.file) return res.status(400).json({ message: 'Please upload a photo.' });

      const newVoter = new Voter({
        CNIC,
        voterID,
        name,
        phone,
        photo: req.file.filename,
      });

      await newVoter.save();
      res.status(201).json({ message: 'Voter registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// ===============================
// Admin Route - Get Vote Results
// ===============================
router.get('/admin/results', verifyToken, async (req, res) => {
  try {
    const results = await Voter.aggregate([
      { $group: { _id: "$voteChoice", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Error fetching results' });
  }
});

// ===============================
// Voter Login
// ===============================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const voter = await Voter.findOne({ username });
    if (!voter) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: voter._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
