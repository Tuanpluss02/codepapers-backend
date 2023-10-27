const express = require("express");
const authRouter = express.Router();
const { authController } = require("../controllers/auth.controller.js");
const { validateReqBody } = require("../middlewares/requestValidate.js");

const {
  authenticatePassword,
  generateTokens,
} = require("../middlewares/authValidate.js");

authRouter.post(
  "/login",
  validateReqBody,
  authenticatePassword,
  generateTokens,
  authController.login
);
authRouter.post("/register", validateReqBody, authController.register);
authRouter.post("/verify", authController.verify);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.post("/reset", authController.getTokenReset);
authRouter.post("/reset/:token", authController.resetPassword);

module.exports = authRouter;
