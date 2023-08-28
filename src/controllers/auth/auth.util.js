const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateTokens = (payload, expiresIn) => {
  const token = jwt.sign(payload, process.env.SECURITY_KEY, { expiresIn });
  return token;
};

module.exports = {
  generateTokens,
};
