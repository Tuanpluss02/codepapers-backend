module.exports = (router) => {
    const { auth } = require('../controllers/auth.controller.js');

    router.post('/auth/login', auth.login);
    router.post('/auth/register', auth.register);
    router.post('/auth/verify', auth.verify);
    router.post('/auth/refresh', auth.refresh);
    router.post('/auth/logout', auth.logout);
}