const bcrypt = require('bcryptjs');

const test = async () => {
  const password = 'sadivote';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);

  const isMatch = await bcrypt.compare('sadivote', hash);
  console.log('Password match:', isMatch);  // true
};

test();
