// models/Voter.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const voterSchema = new mongoose.Schema({
  email:{
    type: String,
    // required: true,
    // unique: true,
    // trim: true
  },
  CNIC: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    // trim: true
  },
  voterID: {
    type: String,
    // trim: true,
    unique: true,
    required: true,
    immutable: true,
    
  },
  name: {
    type: String,
    required: true,
    // trim: true
  },
  phone: {
    type: String,
    required: true,
    // trim: true
  },
  city: {
    type: String,
    required: true,
    // trim: true
  },
  // area: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
}, { timestamps: true });

// Hash password before saving
voterSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
voterSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;