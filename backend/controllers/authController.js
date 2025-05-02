require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Commission = require('../models/Commission');  // Commission model
const Admin = require('../models/Admin');            // Admin model
const Voter = require('../models/Voter');            // Voter model
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const Grid = require('gridfs-stream');
const multer = require('multer');
const upload = multer();
//const Commission = require('../models/Commission');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

// controllers/commissionController.js

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos');
});

exports.loginCommission = async (req, res) => {
  const { username, password } = req.body;
  console.log("Checking login for:", username);

  try {
    const commission = await Commission.findOne({ username });
    if (!commission) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, commission.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: commission._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      username: commission.username,
      token
    });

  } catch (error) {
    console.error("❌ Error in loginCommission:", error);
    return res.status(500).json({ message: 'Server error during commission login' });
  }
};
/*

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    // const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};*/
//get all admins       ye admin list k wqt add kia
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    res.status(500).json({ message: 'Server error while fetching admins.' });
  }
};

exports.createAdmin = async (req, res) => {
  console.log('📥 Received admin data:', req.body);
  try {
    const { username, password, city } = req.body;
    
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }

    const newAdmin = new Admin({ username, password, city });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully!' });
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    res.status(500).json({ message: 'Server error while creating admin.' });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid admin ID format' });
    }

    // ✅ Log incoming data for debugging
    console.log('📥 Update request for admin ID:', id);
    console.log('📦 Request body:', req.body);

    // ✅ Perform update
    const updated = await Admin.findByIdAndUpdate(id, req.body, { new: true });

    // ✅ Check if admin was found
    if (!updated) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // ✅ Send updated document
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Error updating admin:', err.message);
    res.status(500).json({ message: 'Error updating admin', error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting admin:', err);
    res.status(500).json({ message: 'Error deleting admin' });
  }
};
//    ===============================     ye admin list k wqt add kia
// Voter Login (using CNIC and Voter ID)
exports.loginVoter = async (req, res) => {
  const { CNIC, voterID } = req.body;

  try {
    const voter = await Voter.findOne({ voterID });

    if (!voter) {
      return res.status(400).json({ message: 'Invalid Voter ID' });
    }

    if (voter.CNIC !== CNIC) {
      return res.status(400).json({ message: 'Invalid CNIC' });
    }

    const token = jwt.sign({ id: voter._id, role: 'voter' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Register Admin by Commission
exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,
      password: hashedPassword
    });

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Register Voter by Commission
exports.registerVoter = async (req, res) => {
  console.log("Shayan checking")

  console.log("Request Body: ", req.body);  // Log the body to check the incoming data

  const { cnic, voterID, name, phone, city } = req.body;

  // Validate that all required fields are present
  if (!cnic || !voterID || !name || !phone || !city) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Create a new voter without the area field
    const newVoter = new Voter({
      cnic,
      voterID,
      name,
      phone,
      city
    });

    await newVoter.save();

    res.status(201).json({ message: 'Voter added successfully!' });
  } catch (error) {
    console.error('Error adding voter:', error);
    res.status(500).json({ message: 'Failed to add voter', error: error.message });
  }
};

