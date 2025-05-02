const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CandidateSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't return password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  party: {
    type: String,
    required: [true, 'Party is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
});

// Hash password before saving to database
CandidateSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if entered password is correct
CandidateSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Candidate', CandidateSchema);