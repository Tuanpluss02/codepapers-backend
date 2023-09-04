const express = require('express');
const router = express.Router();
const { auth } = require('../controllers/auth.controller.js');
const { validateReqBody, authenticatePassword, generateTokens } = require('../middlewares/validateRequest.js');

router.post('/login', validateReqBody, authenticatePassword, generateTokens, auth.login);
router.post('/register', validateReqBody, auth.register);
router.post('/verify', auth.verify);
router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);

module.exports = router;