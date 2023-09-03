const express = require('express');
const router = express.Router();
const { auth } = require('../controllers/auth.controller.js');
const { validateReqBody } = require('../middlewares/validatorReqBody.js');

router.post('/login', validateReqBody, auth.login);
router.post('/register', validateReqBody, auth.register);
router.post('/verify', auth.verify);
router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);

module.exports = router;