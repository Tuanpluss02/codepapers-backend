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
      const result = await commentQuery.getCommentInPost(post_id);
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
  manageComment: async (req, res) => {
    try {
      const query = req.query;
      if (query?.like) {
        if (query.like === "true") {
          req.method = "POST";
          const comment_id = req.params.comment_id;
          const user_id = req.user.user_id;
          const result = await commentQuery.likeComment(user_id, comment_id);
          if (!result) {
            return res.status(HTTPStatusCode.InternalServerError).json({
              message: "Like comment failed",
            });
          }
          return res.status(HTTPStatusCode.OK).json({
            message: "Like comment successful",
          });
        } else if (query.like === "false") {
          req.method = "DELETE";
          const comment_id = req.params.comment_id;
          const user_id = req.user.user_id;
          const result = await commentQuery.unlikeComment(user_id, comment_id);
          if (!result) {
            return res.status(HTTPStatusCode.InternalServerError).json({
              message: "Unlike comment failed",
            });
          }
          return res.status(HTTPStatusCode.OK).json({
            message: "Unlike comment successful",
          });
        }
      } else if (query?.update) {
        if (query.update === "true") {
          req.method = "PATCH";
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
        }
      } else if (query?.delete) {
        if (query.delete === "true") {
          req.method = "DELETE";
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
        }
      } else {
        req.method = "GET";
        const comment_id = req.params.comment_id;
        const result = await commentQuery.getCommentById(comment_id);
        if (!result) {
          return res.status(HTTPStatusCode.InternalServerError).json({
            message: "Get comment failed",
          });
        }
        return res.status(HTTPStatusCode.OK).json({
          result,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Get comment failed",
      });
    }
  },
};
