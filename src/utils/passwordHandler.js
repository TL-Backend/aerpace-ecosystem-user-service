const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.generateTemporaryPassword = async (length = 10) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let index = 0; index < length; index++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  return password;
};

exports.hashPassword = async ({ password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

exports.verifyPassword = async ({ enteredPassword, password }) => {
  const isPasswordValid = await bcrypt.compare(enteredPassword, password);
  return isPasswordValid;
};
