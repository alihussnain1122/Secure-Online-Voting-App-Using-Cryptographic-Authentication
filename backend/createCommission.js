// createCommission.js
const mongoose = require('mongoose');
const Commission = require('./models/Commission');
require('dotenv').config();

const createCommissionUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const newUser = new Commission({
      username: 'shayan',
      password: '1122', // Plain text, will be hashed
    });

    await newUser.save();
    console.log('✅ Commission user created with hashed password.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  }
};

createCommissionUser();
