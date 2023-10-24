const query = require('../modules/user.query');
const { generateToken, verifyToken } = require('../services/auth.service.js');
const HTTPStatusCode = new (require('../common/constants/HttpStatusCode'))();

// Middleware xác thực mật khẩu
exports.authenticatePassword = async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const dataQuery = await query.getUsers(email);
    if (dataQuery.length === 0 || password !== dataQuery.data[0].password) {
        return res.status(HTTPStatusCode.Unauthorized).send('Invalid email or password');
    }
    req.user = dataQuery.data[0];
    next();
}

// Middleware tạo access token và refresh token
exports.generateTokens = async (req, res, next) => {
    const user = req.user;
    const payloadAccessToken = {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + parseInt(process.env.ACCESS_TOKEN_LIFE)
    };
    const payloadRefreshToken = {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + parseInt(process.env.REFRESH_TOKEN_LIFE)
    };
    const accessToken = generateToken(payloadAccessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!accessToken) {
        return res.status(HTTPStatusCode.Unauthorized).send('Login failed, please try again');
    }

    let refreshToken = generateToken(payloadRefreshToken, process.env.REFRESH_TOKEN_SECRET);
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

// Middleware kiểm tra refresh token
exports.authenticateRefreshToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    let payload;
    try {
        payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return res.status(HTTPStatusCode.Unauthorized).send('Refresh token expired, please login again');
    }
    if (!payload) {
        return res.status(HTTPStatusCode.Unauthorized).send('Invalid refresh token');
    }
    const dataQuery = await query.getUsers(payload.id);
    if (dataQuery.length === 0 || dataQuery.data[0].refreshToken !== refreshToken) {
        return res.status(HTTPStatusCode.Unauthorized).send('Invalid refresh token');
    }
    req.user = dataQuery.data[0];
    next();
}
