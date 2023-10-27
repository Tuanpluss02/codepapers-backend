const express = require("express");
const postRouter = express.Router();
const { postController } = require("../controllers/post.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

postRouter.get("/get", authenticateAccessToken, postController.getPosts);
postRouter.post("/new", authenticateAccessToken, postController.createNewPost);
postRouter.get(
  "/:post_id",
  authenticateAccessToken,
  postController.getPostbyID
);
postRouter.put(
  "/update/:post_id",
  authenticateAccessToken,
  postController.updatePost
);
postRouter.delete(
  "/delete/:post_id",
  authenticateAccessToken,
  postController.deletePost
);

module.exports = postRouter;
