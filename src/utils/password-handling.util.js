const bcrypt = require('bcryptjs');

const generateTemporaryPassword = async (length = 10) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let index = 0; index < length; index++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
  const isPasswordVerified = await bcrypt.compare(password, hashedPassword);
  return isPasswordVerified;
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateTemporaryPassword,
};
