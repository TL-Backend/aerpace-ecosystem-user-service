const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.generateTemporaryPassword = async (length = 10) => {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specialCharacters = '!@#$%^&*';
  const allCharacters = uppercaseLetters + digits + specialCharacters;

  const randomUppercase = uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  const randomDigit = digits[Math.floor(Math.random() * digits.length)];
  const randomSpecialCharacter = specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  const randomLength = Math.floor(Math.random() * (12 - 8 + 1)) + 8;

  const randomString = Array.from({ length: randomLength }, () => {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    return allCharacters[randomIndex];
  }).join('');

  const temporaryPassword = randomString.replace(/[A-Z]/, randomUppercase)
    .replace(/[0-9]/, randomDigit)
    .replace(/[^A-Za-z0-9]/, randomSpecialCharacter);
  console.log(temporaryPassword)
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
