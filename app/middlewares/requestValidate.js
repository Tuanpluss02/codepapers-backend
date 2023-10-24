const { validator } = require('../utils/validator');
const HTTPStatusCode = new (require('../common/constants/HttpStatusCode'))();

// Middleware kiểm tra body request
exports.validateReqBody = (req, res, next) => {
    console.log(req.body.password);
    const { email, password, fullName } = req.body;
    if (!email || !password) {
        return res.status(HTTPStatusCode.BadRequest).json({
            message: 'Missing required fields'
        });
    }
    req.body.email = email ? email.toLowerCase() : email;
    if (email && !validator.isValidEmail(email)) {
        return res.status(HTTPStatusCode.BadRequest).json({
            message: 'Invalid email'
        });
    }
    if (password && !validator.isValidPassword(password)) {
        return res.status(HTTPStatusCode.BadRequest).json({
            message: 'Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter and 1 number'
        });
    }
    if (fullName && !validator.isValidName(fullName)) {
        return res.status(HTTPStatusCode.BadRequest).json({
            message: 'Invalid fullName'
        });
    }
    return next();
}

exports.isValidID = (req, res, next) => {
    const id = req.body.id;
    if (isNaN(id)) {
        return res.status(HTTPStatusCode.BadRequest).json({
            message: 'ID must be a number'
        });
    }
    req.body.id = id;
    return next();
}