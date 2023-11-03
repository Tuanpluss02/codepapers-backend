const { v4: uuidv4 } = require("uuid");
const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const postQuery = require("../modules/post.query.js");
const date = require("../utils/convertDate");

exports.postController = {
  createNewPost: async (req, res) => {
    /*
      #swagger.tags = ['Post']
      #swagger.summary = 'Create post'
      #swagger.description = 'Create new post'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            "schema": {
              "$ref": "#/components/schemas/Post"
            }
          }
        }
      }
    */
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
    /*
      #swagger.tags = ['Post']
      #swagger.summary = 'Get all personal posts'
      #swagger.description = 'Get all posts'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
    */
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
    /*
      #swagger.tags = ['Post']
      #swagger.summary = 'Get detail post'
      #swagger.description = 'Get detail post by post_id'
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
        description: 'Enter post_id to get detail post',
        required: true,
        type: 'string',
      }
    */
    try {
      req.method = "GET";
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
  reactPost: async (req, res) => {
    /*
      #swagger.tags = ['Post']
      #swagger.summary = 'Like or unlike post'
      #swagger.description = 'Like or unlike post'
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
        description: 'Enter post_id to like or unlike post',
        required: true,
        type: 'string',
      }
      #swagger.parameters['like'] = {
        in: 'query',
        description: "Choose true to like post, false to unlike post",
        required: true,
        type: 'boolean',
      }
    */
    try {
      const query = req.query;
      if (query?.like) {
        if (query.like === "true") {
          req.method = "POST";
          const post_id = req.params.post_id;
          const user_id = req.user.user_id;
          const result = await postQuery.likePost(user_id, post_id);
          if (!result) {
            return res.status(HTTPStatusCode.InternalServerError).json({
              message: "Like post failed",
            });
          }
          return res.status(HTTPStatusCode.OK).json({
            message: "Like post successful",
          });
        } else if (query.like === "false") {
          req.method = "DELETE";
          const post_id = req.params.post_id;
          const user_id = req.user.user_id;
          const result = await postQuery.unlikePost(user_id, post_id);
          if (!result) {
            return res.status(HTTPStatusCode.InternalServerError).json({
              message: "Unlike post failed",
            });
          }
          return res.status(HTTPStatusCode.OK).json({
            message: "Unlike post successful",
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Get post failed",
      });
    }
  },
  updatePost: async (req, res) => {
    /*
      #swagger.tags = ['Post']
      #swagger.summary = 'Update post'
      #swagger.description = 'Update post'
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
        description: 'Enter post_id to update post',
        required: true,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            "schema": {
              "$ref": "#/components/schemas/Post"
            }
          }
        }
      }
    */
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
    /*
      #swagger.tags = ['Post']
      #swagger.summary = 'Delete post'
      #swagger.description = 'Delete post'
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
        description: 'Enter post_id to delete post',
        required: true,
        type: 'string',
      }
    */
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
  }
};
