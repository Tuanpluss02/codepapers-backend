const { v4: uuidv4 } = require("uuid");
const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const commentQuery = require("../modules/comment.query.js");
const date = require("../utils/convertDate");

exports.commentController = {
  postComment: async (req, res, next) => {
    /*
      #swagger.tags = ['Comment']
      #swagger.summary = 'Post comment in post'
      #swagger.description = 'Post comment'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.parameters['post_id'] = {
        in: 'path',
        description: 'Post id',
        required: true,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            "schema": {
              "$ref": "#/components/schemas/Comment"
            }
          }
        }
      }
    */
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
      error.message = "Post comment failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  getCommentInPost: async (req, res, next) => {
    /*
      #swagger.tags = ['Comment']
      #swagger.summary = 'Get all comments in post'
      #swagger.description = 'Get comment in post'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.parameters['post_id'] = {
        in: 'path',
        description: 'Post id',
        required: true,
        type: 'string',
      }
    */
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
      error.message = "Get comments in post failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  getCommentById: async (req, res, next) => {
    /*
      #swagger.tags = ['Comment']
      #swagger.summary = 'Get detail one comment'
      #swagger.description = 'Get comment by comment_id'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.parameters['comment_id'] = {
        in: 'path',
        description: 'Comment id',
        required: true,
        type: 'string',
      }
    */
    try {
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
    } catch (error) {
      error.message = "Get detail comment failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  reactComment: async (req, res, next) => {
    /*
      #swagger.tags = ['Comment']
      #swagger.summary = 'Like or unlike comment'
      #swagger.description = 'Like or unlike comment'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.parameters['comment_id'] = {
        in: 'path',
        description: 'Comment id',
        required: true,
        type: 'string',
      }
      #swagger.parameters['like'] = {
        in: 'query',
        description: 'Choose true to like comment, false to unlike comment',
        required: true,
        type: 'boolean',
      }
    */
    try {
      if (req.query.like === "true") {
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
      } else if (req.query.like === "false") {
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
    } catch (error) {
      error.message = "Like or unlike comment failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  updateComment: async (req, res, next) => {
    /*
      #swagger.tags = ['Comment']
      #swagger.summary = 'Update comment'
      #swagger.description = 'Update comment'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.parameters['comment_id'] = {
        in: 'path',
        description: 'Comment id',
        required: true,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            "schema": {
              "$ref": "#/components/schemas/Comment"
            }
          }
        }
      }
    */
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
      error.message = "Update comment failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  deleteComment: async (req, res, next) => {
    /*
      #swagger.tags = ['Comment']
      #swagger.summary = 'Delete comment'
      #swagger.description = 'Delete comment'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.parameters['comment_id'] = {
        in: 'path',
        description: 'Comment id',
        required: true,
        type: 'string',
      }
      #swagger.parameters['delete'] = {
        in: 'query',
        description: 'Choose true to delete comment',
        required: true,
        type: 'boolean',
      }
    */
    try {
      if (req.query.delete === "true") {
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
    } catch (error) {
      error.message = "Delete comment failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
};