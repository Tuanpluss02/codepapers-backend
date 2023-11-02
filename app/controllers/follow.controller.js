const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const followQuery = require("../modules/follow.query");

exports.followController = {
  getFollowers: async (req, res) => {
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
