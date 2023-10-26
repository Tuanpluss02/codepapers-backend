const express = require("express");
const postRouter = express.Router();
const {
  postController,
} = require("../controllers/post.controller.js");
const {
  authenticateAccessToken,
} = require("../middlewares/authValidate.js");

postRouter.get("/", authenticateAccessToken, postController.getPosts);