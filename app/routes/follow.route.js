const express = require("express");
const followRouter = express.Router();

const { followController } = require("../controllers/follow.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

followRouter.get(
  "/followers",
  authenticateAccessToken,
  followController.getFollowers
);
followRouter.get(
  "/following",
  authenticateAccessToken,
  followController.getFollowings
);
followRouter.post("/new", authenticateAccessToken, followController.follow);
followRouter.post(
  "/unfollow",
  authenticateAccessToken,
  followController.unfollow
);

module.exports = followRouter;
