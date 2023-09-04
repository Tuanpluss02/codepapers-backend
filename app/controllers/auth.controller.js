
const query = require('../modules/user.query.js');
const { comparePassword, generateToken } = require('../services/auth.service.js');

exports.auth = {
    login: async (req, res) => {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const dataQuery = await query.getUsers(email);
        if (dataQuery.length === 0) {
            res.status(401).send('Invalid email or password');
        }
        const user = dataQuery.data[0];
        // if (comparePassword(password, user.password)) {
        if (password !== user.password) {
            res.status(401).send('Invalid email or password');
        }
        const payload = {
            id: user.id,
        };
        const accessToken = generateToken(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
        if (!accessToken) {
            res.status(401).send('Login failed, please try again');
        }
        let refreshToken = generateToken(payload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);
        if (!user.refreshToken) {
            await query.updateRefreshToken(user.id, refreshToken).catch(err => {
                console.error(err);
                res.status(401).send('Login failed, please try again');
            });
        } else {
            refreshToken = user.refreshToken;
        }
        res.status(200).json({
            'message': 'Login successful',
            'accessToken': accessToken,
            'refreshToken': refreshToken,
            'user': user
        });
    },
    register: (req, res) => {
        res.send('register ok');
    },
    verify: (req, res) => {
        res.send('verify ok');
    },
    refresh: (req, res) => {
        const refreshToken = req.body.refreshToken;
        const payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!payload) {
            res.status(401).send('Invalid refresh token');
        }
        const accessToken = generateToken(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
        if (!accessToken) {
            res.status(401).send('Invalid refresh token');
        }
        res.status(200).json({
            'message': 'Refresh token successful',
            'accessToken': accessToken
        });
    },
    logout: (req, res) => {
        res.send('logout ok');
    }
};