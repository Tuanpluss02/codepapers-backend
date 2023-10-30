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

commentRouter.patch(
  "/:comment_id",
  authenticateAccessToken,
  commentController.updateComment
);

commentRouter.delete(
  "/:comment_id",
  authenticateAccessToken,
  commentController.deleteComment
);


module.exports = commentRouter;
