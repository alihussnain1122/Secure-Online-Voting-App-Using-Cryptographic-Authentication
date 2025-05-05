// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const  morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const adminController = require('./controllers/adminController')
const candidateRoutes = require('./routes/candidateRoute');
const feedbackRoutes = require('./routes/feedback');
//const voteRoutes = require('./routes/vote');
app.use(express.json());

// Controllers

const { loginCommission, loginAdmin, loginVoter } = require('./controllers/authController');

// Middleware
const { protect } = require('./middleware/authMiddleware');
app.use(morgan('dev'));

// Models
const Feedback = require('./models/Feedback');
const Admin = require('./models/Admin');  // Assuming you have an Admin model

// Routes
const voterRoutes = require('./routes/voterRoutes');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// === MIDDLEWARE ===
app.use(bodyParser.json());
app.use(cors());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// === DB CONNECTION ===
mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// === ROUTES ===
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Voting System API!' });
}
);

app.use('/api', adminRoutes);
app.use('/api',voterRoutes);
app.use('/api/voter', voterRoutes);
app.use('/api/auth', authRoutes);
app.post('/api/admin/login', adminController.loginAdmin);
app.post('/api/voter/login', loginVoter);
app.post('/api/commission/login', loginCommission);
app.use('/api/candidates', candidateRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/feedbacks', feedbackRoutes);
//app.use('/api', require('./routes/candidate'));
//app.use('/api/votes', voteRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/admin', require('./routes/adminRoutes'));
// Dashboard (Protected)
app.get('/api/commission/dashboard', protect, (req, res) => {
  res.json({
    message: 'Commission Dashboard: Access granted.',
    user: req.user,
  });
});
const voteRoutes = require('./routes/vote');
app.use('/api/vote', voteRoutes); 

// Feedback (Protected)
app.post('/api/feedback', protect, async (req, res) => {
  const { feedback } = req.body;
  const voterId = req.user._id;
  
  try {
    const newFeedback = new Feedback({ voterId, feedback });
    await newFeedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while submitting feedback.' });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

// === SERVER START ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HTTPS Server running on port ${PORT}`);
});
