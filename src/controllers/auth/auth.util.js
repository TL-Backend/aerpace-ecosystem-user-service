const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateTokens = ({ payload, expiresIn }) => {
  const token = jwt.sign(payload, process.env.SECURITY_KEY, { expiresIn });
  return token;
};
