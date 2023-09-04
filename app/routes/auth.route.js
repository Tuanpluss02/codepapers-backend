const express = require('express');
const router = express.Router();
const { auth } = require('../controllers/auth.controller.js');
const { validateReqBody, authenticatePassword, generateTokens } = require('../middlewares/validateRequest.js');
// swager docs
/**
 * @swagger 
 * /auth/login:
 * post:
 * description: Login
 * parameters:
 * - name: email
 *  description: Email
 * in: formData
 * required: true
 * type: string
 * - name: password
 * description: Password
 * in: formData
 * required: true
 * type: string
 * responses:
 * 200:
 * description: Login successful
 * 401:
 * description: Invalid email or password
 * 500:
 * description: Login failed, please try again
 **/
router.post('/login', validateReqBody, authenticatePassword, generateTokens, auth.login);
router.post('/register', validateReqBody, auth.register);
router.post('/verify', auth.verify);
router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);

module.exports = router;