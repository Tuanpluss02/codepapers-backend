const { validator } = require('../utils/validator');

exports.validateReqBody = (req, res, next) => {
    const { email, password, name } = req.body;
    console.log(req.body);
    if (email && !validator.isValidEmail(email)) {
        return res.status(400).json({
            message: 'Invalid email'
        });
    }
    if (password && !validator.isValidPassword(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter and 1 number'
        });
    }
    if (name && !validator.isValidName(name)) {
        return res.status(400).json({
            message: 'Invalid name'
        });
    }
    return next();
}