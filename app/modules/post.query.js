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
  const sql = "SELECT p.post_id, p.title, p.body, p.posted_at, COUNT(c.comment_id) AS comment_count, COUNT(pl.like_id) AS like_count, GROUP_CONCAT(pl.user_id) AS liked_users FROM posts p \
                LEFT JOIN user_comment uc ON uc.post_id = p.post_id \
                LEFT JOIN comments c ON c.comment_id = uc.comment_id \
                LEFT JOIN post_likes pl ON pl.post_id = p.post_id \
                WHERE p.post_id = ? \
                GROUP BY p.post_id;";
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
    "INSERT INTO posts (post_id, title, body, posted_at) VALUES (?, ?, ?, ?)";
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
  const sql1 =  "DELETE pl FROM post_likes pl \
                  JOIN posts p ON pl.post_id = p.post_id \
                  WHERE p.post_id = ?";
  const sql2 = "DELETE up FROM user_posts up \
                JOIN posts p ON up.post_id = p.post_id \
                WHERE p.post_id = ?";
  const sql3 = "DELETE cl FROM comment_likes cl \
                JOIN user_comment uc ON cl.comment_id = uc.comment_id \
                JOIN posts p ON uc.post_id = p.post_id \
                WHERE p.post_id = ?";
  const sql4 = "DELETE c FROM comments c \
                JOIN user_comment uc ON c.comment_id = uc.comment_id \
                JOIN posts p ON uc.post_id = p.post_id  \
                WHERE p.post_id = ?";
  const sql5 = "DELETE uc FROM user_comment uc \
                JOIN posts p ON uc.post_id = p.post_id \
                WHERE p.post_id = ?";
  const sql6 = "DELETE FROM posts WHERE post_id = ?";
  const values = [post_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql1, values, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        db.query(sql2, values, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            db.query(sql3, values, (err) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                db.query(sql4, values, (err) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    db.query(sql5, values, (err) => {
                      if (err) {
                        console.error(err);
                        reject(err);
                      } else {
                        db.query(sql6, values, (err, result) => {
                          if (err) {
                            console.error(err);
                            reject(err);
                          } else {
                            resolve(result);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        })
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

exports.likePost = async (user_id, post_id) => {
  const sql = "INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)";
  const values = [user_id, post_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};

exports.unlikePost = async (user_id, post_id) => {
  const sql = "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?";
  const values = [user_id, post_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};
