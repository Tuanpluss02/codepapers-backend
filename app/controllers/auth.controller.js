
const HTTPStatusCode = new (require('../common/constants/HttpStatusCode.js'))();
const query = require('../modules/user.query.js');
const { generateToken, verifyToken } = require('../services/auth.service.js');
require('dotenv').config();

exports.auth = {
    login: async (req, res) => {
        const accessToken = req.accessToken;
        const refreshToken = req.refreshToken;
        const user = req.user;
        return res.status(HTTPStatusCode.OK).json({
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
            return res.status(HTTPStatusCode.Unauthorized).send('Invalid refresh token');
        }
        const accessToken = generateToken(payload, process.env.ACCESS_TOKEN_SECRET);
        if (!accessToken) {
            return res.status(HTTPStatusCode.Unauthorized).send('Invalid refresh token');
        }
        return res.status(HTTPStatusCode.OK).json({
            'message': 'Refresh token successful',
            'accessToken': accessToken
        });
    },
    logout: async (req, res) => {
        try {
            const id = req.body.id;
            const user = await query.getUserById(id);
            if (!user) {
                return res.status(HTTPStatusCode.Unauthorized).send('User not found, check your id');
            }
            if (!user.refreshToken) {
                return res.status(HTTPStatusCode.Unauthorized).send('User is not logged in');
            }
            await query.updateRefreshToken(id, null);
            return res.status(HTTPStatusCode.OK).json({
                'message': 'Logout successful'
            });
        } catch (err) {
            console.log(err);
            return res.status(HTTPStatusCode.InternalServerError).json({
                'message': 'Logout failed'
            });
        }
    }
};