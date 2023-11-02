const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const followQuery = require("../modules/follow.query");

exports.followController = {
  getFollowers: async (req, res) => {
    /*
      #swagger.tags = ['Follow']
      #swagger.summary = 'Get all followers'
      #swagger.description = 'Enpoint to get all followers'
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
      const user = req.user;
      const listFolowers = await followQuery.getFollowers(user.user_id);
      return res.status(HTTPStatusCode.OK).json({
        followers: listFolowers,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
  getFollowings: async (req, res) => {
    /*
      #swagger.tags = ['Follow']
      #swagger.summary = 'Get all following users'
      #swagger.description = 'Endpoint to get all following users'
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
      const user = req.user;
      const listFolowing = await followQuery.getFollowings(user.user_id);
      return res.status(HTTPStatusCode.OK).json({
        folowing: listFolowing,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
  follow: async (req, res) => {
    /*
      #swagger.tags = ['Follow']
      #swagger.summary = 'Follow a user'
      #swagger.description = 'Enpoint to follow a user'
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
            schema: {
              "$ref": "#/components/schemas/Follow"
            }
          }
        }
      }
    */
    try {
      const user = req.user;
      const { followed_id } = req.body;
      if (user.user_id === followed_id) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "You can not follow yourself",
        });
      }
      const isFollowed = await followQuery.isFollowed(
        user.user_id,
        followed_id
      );
      if (isFollowed) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "You are following this user",
        });
      }
      await followQuery.follow(user.user_id, followed_id);
      return res.status(HTTPStatusCode.OK).json({
        message: "Follow success",
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },

  unfollow: async (req, res) => {
    /*
      #swagger.tags = ['Follow']
      #swagger.summary = 'Unfollow a user'
      #swagger.description = 'Enpoint to unfollow a user'
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
            schema: {
              "$ref": "#/components/schemas/Follow"
            }
          }
        }
      }
    */
    try {
      const user = req.user;
      const { followed_id } = req.body;
      const isFollowed = await followQuery.isFollowed(
        user.user_id,
        followed_id
      );
      if (!isFollowed) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "You are not following this user",
        });
      }
      await followQuery.unfollow(user.user_id, followed_id);
      return res.status(HTTPStatusCode.OK).json({
        message: "Unfollow success",
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
};
