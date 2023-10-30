const db = require("../services/database.service.js");

exports.getComment = async (post_id) => {
  const sql =
    "SELECT uc.post_id, cm.comment_id, uc.user_id, cm.content, cm.comment_at, uc.user_liked_cmt FROM comments as cm \
      JOIN user_comment as uc ON cm.comment_id = uc.comment_id \
      WHERE uc.post_id = ?";
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
  const values = [comment_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql_user_comment, values, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query(sql_comment, values, (err, result) => {
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

