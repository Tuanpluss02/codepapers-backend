const express = require("express");
const postRouter = express.Router();
const { postController } = require("../controllers/post.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

postRouter.get("/post/get", authenticateAccessToken, postController.getPosts);
postRouter.post("/post/new", authenticateAccessToken, postController.createNewPost);
postRouter.get(
  "/post/:post_id",
  authenticateAccessToken,
  postController.getPostbyID
);
postRouter.post(
  "/post/:post_id",
  authenticateAccessToken,
  postController.reactPost
);
postRouter.delete(
  "/post/:post_id",
  authenticateAccessToken,
  postController.reactPost
);
postRouter.put(
  "/post/update/:post_id",
  authenticateAccessToken,
  postController.updatePost
);
postRouter.delete(
  "/post/delete/:post_id",
  authenticateAccessToken,
  postController.deletePost
);

module.exports = postRouter;
