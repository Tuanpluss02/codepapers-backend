const express = require("express");
const postRouter = express.Router();
const { postController } = require("../controllers/post.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

// postRouter.get("/", authenticateAccessToken, postController.getPosts);
// postRouter.post("/", authenticateAccessToken, postController.createPost);
// postRouter.get(
//   "/:post_id",
//   authenticateAccessToken,
//   postController.getPostbyID
// );
postRouter.put("/:post_id", authenticateAccessToken, postController.updatePost);
postRouter.delete(
  "/:post_id",
  authenticateAccessToken,
  postController.deletePost
);

module.exports = postRouter;
