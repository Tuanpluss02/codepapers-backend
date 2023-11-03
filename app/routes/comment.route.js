const express = require("express");
const commentRouter = express.Router();
const { commentController } = require("../controllers/comment.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

commentRouter.post(
  "/comment/post/:post_id",
  authenticateAccessToken,
  commentController.postComment
);

commentRouter.get(
  "/comment/post/:post_id",
  authenticateAccessToken,
  commentController.getCommentInPost
);

commentRouter.get(
  "/comment/:comment_id",
  authenticateAccessToken,
  commentController.getCommentById
);

commentRouter.post(
  "/comment/:comment_id",
  authenticateAccessToken,
  commentController.reactComment
);

commentRouter.delete(
  "/comment/:comment_id",
  authenticateAccessToken,
  commentController.reactComment
);

commentRouter.patch(
  "/comment/update/:comment_id",
  authenticateAccessToken,
  commentController.updateComment
);

commentRouter.delete(
  "/comment/delete/:comment_id",
  authenticateAccessToken,
  commentController.deleteComment
);

module.exports = commentRouter;
