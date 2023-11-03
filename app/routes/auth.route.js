const express = require("express");
const authRouter = express.Router();
const { authController } = require("../controllers/auth.controller.js");
const { validateReqBody } = require("../middlewares/requestValidate.js");
const {
  authenticatePassword,
  generateTokens,
} = require("../middlewares/authValidate.js");

authRouter.post(
  "/auth/login",
  validateReqBody,
  authenticatePassword,
  generateTokens,
  authController.login
);

authRouter.post("/auth/register", validateReqBody , authController.register);
authRouter.post("/auth/verify", authController.verify);
authRouter.post("/auth/refresh", authController.refresh);
authRouter.post("/auth/logout", authController.logout);
authRouter.post("/auth/reset", authController.getTokenReset);
authRouter.post("/auth/reset/:token", authController.resetPassword);

module.exports = authRouter;
