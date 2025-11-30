const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'event-sphere-jwt-secret';

function signToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { signToken, verifyToken };
