const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.generateTemporaryPassword = async () => {
  const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specialCharacters = '!@#$%^&*';
  const allCharacters = characterSet + digits + specialCharacters;
  const minimumLength = 8
  const maximumLength = 12

  const randomUppercase = characterSet[Math.floor(crypto.randomInt(characterSet.length))];
  const randomDigit = digits[Math.floor(crypto.randomInt(digits.length))];
  const randomSpecialCharacter = specialCharacters[Math.floor(crypto.randomInt(specialCharacters.length))];

  const randomLength = Math.floor(crypto.randomInt((maximumLength - minimumLength + 1)) + minimumLength);

  const randomString = Array.from({ length: randomLength }, () => {
    const randomIndex = Math.floor(crypto.randomInt(allCharacters.length));
    return allCharacters[randomIndex];
  }).join('');

  const temporaryPassword = randomString.replace(/[A-Z]/, randomUppercase)
    .replace(/[0-9]/, randomDigit)
    .replace(/[^A-Za-z0-9]/, randomSpecialCharacter);
  return temporaryPassword
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
