const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.generateTemporaryPassword = async (length = 8) => {
  const upperCaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseCharSet = 'abcdefghijklmnopqrstuvwxyz';
  const numberSet = '0123456789'
  let password = '@';
  for (let index = 0; password.length < length; index++) {
    const randomUpperCaseIndex = crypto.randomInt(0, upperCaseCharset.length);
    const randomLowerCaseIndex = crypto.randomInt(0, lowerCaseCharSet.length);
    const randomNumberIndex = crypto.randomInt(0, numberSet.length);
    password += upperCaseCharset[randomUpperCaseIndex]
      + lowerCaseCharSet[randomLowerCaseIndex]
      + numberSet[randomNumberIndex];
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
