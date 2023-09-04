
const HTTPStatusCode = new (require('../common/constants/HttpStatusCode.js'))();
const query = require('../modules/user.query.js');
const { generateToken, verifyToken } = require('../services/auth.service.js');

exports.auth = {
    login: async (req, res) => {
        const accessToken = req.accessToken;
        const refreshToken = req.refreshToken;
        const user = req.user;
        res.status(HTTPStatusCode.OK).json({
            'message': 'Login successful',
            'accessToken': accessToken,
            'refreshToken': refreshToken,
            'user': user
        });
    },
    register: (req, res) => {
        res.status(HTTPStatusCode.OK).json({
            'message': 'Register successful'
        });
    },
    verify: (req, res) => {
        res.status(HTTPStatusCode.OK).json({
            'message': 'Verify successful'
        });
    },
    refresh: (req, res) => {
        const refreshToken = req.body.refreshToken;
        const payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!payload) {
            res.status(HTTPStatusCode.Unauthorized).send('Invalid refresh token');
        }
        const accessToken = generateToken(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
        if (!accessToken) {
            res.status(HTTPStatusCode.Unauthorized).send('Invalid refresh token');
        }
        res.status(HTTPStatusCode.OK).json({
            'message': 'Refresh token successful',
            'accessToken': accessToken
        });
    },
    logout: async (req, res) => {
        const id = req.body.id;
        await query.updateRefreshToken(id, null).catch(err => {
            console.error(err);
            res.status(HTTPStatusCode.Unauthorized).send('Logout failed, please try again');
        });
        res.status(HTTPStatusCode.OK).json({
            'message': 'Logout successful'
        });
    }
};