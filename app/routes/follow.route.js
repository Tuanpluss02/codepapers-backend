const express = require("express");
const followRouter = express.Router();

const { followController } = require("../controllers/follow.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

followRouter.get(
  "/follow/followers",
  authenticateAccessToken,
  followController.getFollowers
);
followRouter.get(
  "/follow/following",
  authenticateAccessToken,
  followController.getFollowings
);
followRouter.post("/follow/new", authenticateAccessToken, followController.follow);
followRouter.post(
  "/follow/unfollow",
  authenticateAccessToken,
  followController.unfollow
);

module.exports = followRouter;
