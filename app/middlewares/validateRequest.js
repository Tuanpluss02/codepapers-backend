const { validator } = require('../utils/validator');
const query = require('../modules/user.query');
const { comparePassword, generateToken } = require('../services/auth.service.js');
const HTTPStatusCode = new (require('../common/constants/HttpStatusCode'))();

// Middleware kiểm tra body request
exports.validateReqBody = (req, res, next) => {
    const { email, password, name } = req.body;
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
    if (name && !validator.isValidName(name)) {
        return res.status(HTTPStatusCode.BadRequest).json({
            message: 'Invalid name'
        });
    }
    return next();
}
// Middleware xác thực mật khẩu
exports.authenticatePassword = async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const dataQuery = await query.getUsers(email);
    // if (dataQuery.length === 0 || !comparePassword(password, dataQuery.data[0].password)) {
    //     return res.status(401).send('Invalid email or password');
    // }
    if (dataQuery.length === 0 || password !== dataQuery.data[0].password) {
        return res.status(HTTPStatusCode.Unauthorized).send('Invalid email or password');
    }

    req.user = dataQuery.data[0];
    next();
}

// Middleware tạo access token và refresh token
exports.generateTokens = async (req, res, next) => {
    const user = req.user;
    const payload = {
        id: user.id,
    };

    const accessToken = generateToken(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
    if (!accessToken) {
        return res.status(HTTPStatusCode.Unauthorized).send('Login failed, please try again');
    }

    let refreshToken = generateToken(payload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);
    if (!user.refreshToken) {
        await query.updateRefreshToken(user.id, refreshToken).catch(err => {
            console.error(err);
            return res.status(HTTPStatusCode.Unauthorized).send('Login failed, please try again');
        });
    } else {
        refreshToken = user.refreshToken;
    }

    req.accessToken = accessToken;
    req.refreshToken = refreshToken;
    next();
}
