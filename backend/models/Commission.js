// models/Commission.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const commissionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },  // Hash this password
});

// Hash the password before saving
commissionSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // If password hasn't been modified, no need to hash it again
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match password during login
commissionSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('Commission', commissionSchema);