const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

const generateToken = (payload, secretKey) => {
    return jwt.sign(payload, secretKey);
}

const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey);
}

module.exports = {
    comparePassword,
    hashPassword,
    generateToken,
    verifyToken
}