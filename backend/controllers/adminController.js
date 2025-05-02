const Admin = require('../models/Admin');  // Ensure you have an Admin model defined
const jwt  = require('jsonwebtoken');
// Create a new admin
exports.createAdmin = async (req, res) => {
  const { username, password, city } = req.body;

  // Validate the input data
  if (!username || !password || !city) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newAdmin = new Admin({
      username,
      password,
      city,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


// Get all admins (for example purposes)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admins' });
  }
};

// Update an admin
exports.updateAdmin = async (req, res) => {
  const { username, password, city } = req.body;

  if (!username || !password || !city) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    admin.password = password;
    admin.city = city;

    await admin.save();
    res.status(200).json({ message: 'Admin updated successfully.' });

  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { username, password, city } = req.body;

    // Find the admin by all three fields
    const admin = await Admin.findOne({ username, password, city });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found with provided credentials' });
    }

    await Admin.findByIdAndDelete(admin._id);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Admin Login
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
};
// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    // Since we already attached the admin in middleware, just send it
    // Remove sensitive data if needed
    const adminData = req.user.toObject();
    delete adminData.password;
    
    res.json({
      username: adminData.username,
      city: adminData.city,
      // other fields you want to expose
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};