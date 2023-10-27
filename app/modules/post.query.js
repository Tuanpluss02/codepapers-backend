const db = require("../services/database.service.js");

exports.getPosts = async (user_id) => {
  const sql =
    "SELECT * FROM user_posts \
    LEFT JOIN posts ON user_posts.post_id = posts.post_id \
    WHERE user_posts.user_id = ?";
  const values = [user_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};
exports.getPostbyID = async (post_id) => {
  const sql = "SELECT * FROM posts WHERE post_id = ?";
  const values = [post_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
  return result;
};

exports.createPost = async (post_id, title, body, posted_at) => {
  const sql =
    "INSERT INTO posts (post_id, title, body, posted_at) VALUES (?, ?, ?, from_unixtime(?/1000))";
  const values = [post_id, title, body, posted_at];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};

exports.createPostUser = async (user_id, post_id) => {
  const sql = "INSERT INTO user_posts (user_id, post_id) VALUES (?, ?)";
  const values = [user_id, post_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};

exports.deletePost = async (post_id) => {
  const sql =
    "DELETE posts, comments, user_posts, user_comment \
    FROM posts \
    LEFT JOIN comments ON posts.post_id = comments.post_id \
    LEFT JOIN user_posts ON posts.post_id = user_posts.post_id\
    LEFT JOIN user_comment ON posts.post_id = user_comment.post_id\
    WHERE posts.post_id = ?";
  const values = [post_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};

exports.updatePost = async (post_id, title, body) => {
  const sql = "UPDATE posts SET title = ?, body = ? WHERE post_id = ?";
  const values = [title, body, post_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};
