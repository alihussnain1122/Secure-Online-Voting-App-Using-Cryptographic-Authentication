// utils/createCommission.js
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const Commission = require('../models/Commission');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash('1122', 10);
    await Commission.create({ username: 'ali', password: hashedPassword });
    console.log('Commission user created successfully');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
