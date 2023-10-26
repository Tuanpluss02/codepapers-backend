const { v4: uuidv4 } = require("uuid");
const { HTTPStatusCode } = require("../utils/httpStatusCodes.js");
const postQuery = require("../modules/post.query.js");

exports.post = {
  createNewPost: async (req, res) => {
    try {
      const user_id = req.user._id;
      const post_id = uuidv4();
      const { title, body, posted_at } = req.body;
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
};
