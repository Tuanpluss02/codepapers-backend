const express = require("express");
const commentRouter = express.Router();
const { commentController } = require("../controllers/comment.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

commentRouter.post(
  "/post/:post_id",
  authenticateAccessToken,
  commentController.postComment
);

commentRouter.get(
  "/post/:post_id",
  authenticateAccessToken,
  commentController.getCommentInPost
);

commentRouter.get(
  "/:comment_id",
  authenticateAccessToken,
  commentController.manageComment
);

commentRouter.post(
  "/:comment_id",
  authenticateAccessToken,
  commentController.manageComment
);

commentRouter.patch(
  "/:comment_id",
  authenticateAccessToken,
  commentController.manageComment
);

commentRouter.delete(
  "/:comment_id",
  authenticateAccessToken,
  commentController.manageComment
);

module.exports = commentRouter;
