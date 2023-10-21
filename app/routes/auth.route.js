const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth.controller.js");
const {
  validateReqBody,
  isValidID,
} = require("../middlewares/requestValidate.js");
const {
  authenticatePassword,
  generateTokens,
} = require("../middlewares/authValidate.js");

router.post(
  "/login",
  validateReqBody,
  authenticatePassword,
  generateTokens,
  auth.login
);
router.post("/register", validateReqBody, auth.register);
router.post("/verify", auth.verify);
router.post("/refresh", auth.refresh);
router.post("/logout", isValidID, auth.logout);
router.post("/reset", auth.getTokenReset);
router.post("/reset/:token", auth.resetPassword);

module.exports = router;
