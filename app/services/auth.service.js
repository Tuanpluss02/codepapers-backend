const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const generateToken = (payload, secretKey, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
};

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

const getPayloadFromToken = (token, secretKey) => {
  return jwt.decode(token, secretKey);
};

module.exports = {
  comparePassword,
  hashPassword,
  generateToken,
  verifyToken,
  getPayloadFromToken,
};
