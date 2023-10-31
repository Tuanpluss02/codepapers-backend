const { v4: uuidv4 } = require("uuid");
const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const postQuery = require("../modules/post.query.js");
const date = require("../utils/convertDate");

exports.postController = {
  createNewPost: async (req, res) => {
    try {
      console.log(req.user.user_id);
      const user_id = req.user.user_id;
      const post_id = uuidv4();
      const posted_at = date.getNow();
      const { title, body } = req.body;
      const newpost = await postQuery.createPost(
        post_id,
        title,
        body,
        posted_at
      );
      if (!newpost) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Create new post failed",
        });
      }
      const result = await postQuery.createPostUser(user_id, post_id);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Create new post failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        message: "Create new post successful",
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Create new post failed",
      });
    }
  },
  getPosts: async (req, res) => {
    try {
      const user_id = req.user.user_id;

      const result = await postQuery.getPosts(user_id);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Get all posts failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Get all posts failed",
      });
    }
  },
  getPostbyID: async (req, res) => {
    try {
      const post_id = req.params.post_id;
      const result = await postQuery.getPostbyID(post_id);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Get post failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Get post failed",
      });
    }
  },
  updatePost: async (req, res) => {
    try {
      const post_id = req.params.post_id;
      const { title, body } = req.body;
      const result = await postQuery.updatePost(post_id, title, body);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Update post failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        message: "Update post successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Update post failed",
      });
    }
  },
  deletePost: async (req, res) => {
    try {
      const post_id = req.params.post_id;
      const result = await postQuery.deletePost(post_id);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Delete post failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        message: "Delete post successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Delete post failed",
      });
    }
  },
  postComment: async (req, res) => {
    try {
      const post_id = req.params.post_id;
      const user_id = req.user.user_id;
      const comment_at = date.getNow();
      const comment_id = uuidv4();
      const { content } = req.body;
      const result = await postQuery.postComment(
        post_id,
        user_id,
        comment_id,
        content,
        comment_at
      );
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Post comment failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        message: "Post comment successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Post comment failed",
      });
    }
  },
  getCommentInPost: async (req, res) => {
    try {
      const post_id = req.params.post_id;
      const result = await postQuery.getComment(post_id);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Get comment failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        result,
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Get comment failed",
      });
    }
  },
  updateComment: async (req, res) => {
    try {
      const comment_id = req.params.comment_id;
      const { content } = req.body;
      const result = await postQuery.updateComment(comment_id, content);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Update comment failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        message: "Update comment successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Update comment failed",
      });
    }
  },
};
