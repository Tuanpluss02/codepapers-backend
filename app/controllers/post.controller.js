const { v4: uuidv4 } = require("uuid");
const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const postQuery = require("../modules/post.query.js");

exports.postController = {
  createNewPost: async (req, res) => {
    try {
      console.log(req.user.user_id);
      const user_id = req.user.user_id;
      const post_id = uuidv4();
      const { title, body, posted_at } = req.body;
      // const posted_at_date = new Date(posted_at)
      //   .toLocaleString()
      //   .slice(0, 19)
      //   .replace("T", " ");
      // const temp = new Date(posted_at);
      // console.log(posted_at_date);
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
};
