const db = require("../services/database.service.js");

exports.getCommentInPost = async (post_id) => {
  const sql =
    "SELECT uc.post_id, cm.comment_id, uc.user_id, cm.content, cm.comment_at FROM comments as cm \
      LEFT JOIN user_comment as uc ON cm.comment_id = uc.comment_id \
      LEFT JOIN comment_likes as cl ON cm.comment_id = cl.comment_id \
      WHERE uc.post_id = ? \
      GROUP BY cm.comment_id"; 
  const values = [post_id];
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

exports.getCommentById = async (comment_id) => {
  const sql = "SELECT u.post_id, c.comment_id, u.user_id, c.content, c.comment_at, COUNT(cl.like_id) AS like_count, GROUP_CONCAT(cl.user_id) AS liked_users \
              FROM comments c \
              LEFT JOIN user_comment u ON u.comment_id = c.comment_id \
              LEFT JOIN comment_likes cl ON cl.comment_id = c.comment_id \
              WHERE c.comment_id = ? \
              GROUP BY c.comment_id;"
  const values = [comment_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
  return result;

}

exports.postComment = async (
  post_id,
  user_id,
  comment_id,
  content,
  comment_at
) => {
  const sql_comment =
    "INSERT INTO comments (comment_id, content, comment_at) VALUES (?, ?, ?)";
  const sql_user_comment =
    "INSERT INTO user_comment (post_id, user_id, comment_id) VALUES (?, ?, ?)";
  const values_comment = [comment_id, content, comment_at];
  const values_user_comment = [post_id, user_id, comment_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql_comment, values_comment, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query(sql_user_comment, values_user_comment, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
  return result;
};

exports.updateComment = async (comment_id, content) => {
  const sql = "UPDATE comments SET content = ? WHERE comment_id = ?";
  const values = [content, comment_id];
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

exports.deleteComment = async (comment_id) => {
  const sql_comment = "DELETE FROM comments WHERE comment_id = ?";
  const sql_user_comment = "DELETE FROM user_comment WHERE comment_id = ?";
  const sql_comment_like = "DELETE FROM comment_likes WHERE comment_id = ?";
  const values = [comment_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql_user_comment, values, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query(sql_comment, values, (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            db.query(sql_comment_like, values, (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(result);
              }
            });
          }
        });
      }
    });
  });
  return result;
};

exports.likeComment = async (user_id, comment_id) => {
  const sql = "INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)";
  const values = [user_id, comment_id];
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

exports.unlikeComment = async (user_id, comment_id) => {
  const sql = "DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?";
  const values = [user_id, comment_id];
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