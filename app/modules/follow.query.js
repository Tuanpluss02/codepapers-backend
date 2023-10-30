const db = require("../services/database.service.js");

exports.getFollowers = async (userId) => {
  const sql =
    "select user_id, full_name, email, profile_avatar, date_of_birth from followers join codepapers.users u on u.user_id = followers.follower_id where followed_id= ?";
  const values = [userId];
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

exports.getFollowings = async (userId) => {
  const sql =
    "select user_id, full_name, email, profile_avatar, date_of_birth from  followers join codepapers.users u on u.user_id = followers.followed_id where follower_id=?";
  const values = [userId];
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

exports.follow = async (followerId, followedId) => {
  const sql = "INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)";
  const values = [followerId, followedId];
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

exports.unfollow = async (followerId, followedId) => {
  const sql = "DELETE FROM followers WHERE follower_id = ? AND followed_id = ?";
  const values = [followerId, followedId];
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

exports.isFollowed = async (followerId, followedId) => {
  const sql =
    "SELECT * FROM followers WHERE follower_id = ? AND followed_id = ?";
  const values = [followerId, followedId];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        if (result.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
  return result;
};
