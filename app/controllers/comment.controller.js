const { v4: uuidv4 } = require("uuid");
const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const commentQuery = require("../modules/comment.query.js");
const date = require("../utils/convertDate");

exports.commentController = {
  postComment: async (req, res) => {
    try {
      const post_id = req.params.post_id;
      const user_id = req.user.user_id;
      const comment_at = date.getNow();
      const comment_id = uuidv4();
      const { content } = req.body;
      const result = await commentQuery.postComment(
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
      const result = await commentQuery.getComment(post_id);
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
      const result = await commentQuery.updateComment(comment_id, content);
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
  deleteComment: async (req, res) => {
    try {
      const comment_id = req.params.comment_id;
      const result = await commentQuery.deleteComment(comment_id);
      if (!result) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Delete comment failed",
        });
      }
      return res.status(HTTPStatusCode.OK).json({
        message: "Delete comment successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Delete comment failed",
      });
    }
  },
};