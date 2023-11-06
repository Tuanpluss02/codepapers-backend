const db = require("../services/database.service.js");

exports.getUsers = async (email) => {
  const countSql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  const dataSql = "SELECT * FROM users WHERE email = ?";
  const values = [email];

  try {
    const countResult = await new Promise((resolve, reject) => {
      db.query(countSql, values, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result[0].count);
        }
      });
    });

    const dataResult = await new Promise((resolve, reject) => {
      db.query(dataSql, values, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const output = {
      length: countResult,
      data: dataResult,
    };

    return output;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUserById = async (id) => {
  const sql = "SELECT * FROM users WHERE user_id = ? LIMIT 1";
  const values = [id];
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
  return result[0];
};

exports.createUser = async (
  user_id,
  name,
  email,
  password,
  profile_avatar,
  date_of_birth
) => {
  const sql =
    "INSERT INTO users (user_id, full_name, email, password, profile_avatar, date_of_birth) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    user_id,
    name,
    email,
    password,
    profile_avatar,
    date_of_birth,
  ];
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.updateRefreshToken = async (user_id, refreshToken) => {
  const sql = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
  const values = [refreshToken, user_id];
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.updateBlacklistToken = async (user_id, access_token, refresh_token) => {
  const sql1 =
    "INSERT INTO blacklist_token (token) VALUES (?)";
  const values1 = [access_token];
  const values2 = [refresh_token];
  const sql2 = "UPDATE users SET refresh_token = NULL WHERE user_id = ?";
  const values3 = [user_id];
  return new Promise((resolve, reject) => { 
    db.query(sql1, values1, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        db.query(sql1, values2, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            db.query(sql2, values3, (err, result) => {
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
  });
    

};

exports.getBlacklistToken = async (user_id) => {
  const sql = "SELECT refresh_token FROM users WHERE user_id = ?";
  const values = [user_id];
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.updateResetPasswordToken = async (user_id, resetPasswordToken) => {
  const sql = "UPDATE users SET reset_password_token = ? WHERE user_id = ?";
  const values = [resetPasswordToken, user_id];
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.updateResetPasswordExpires = async (user_id, resetPasswordExpires) => {
  const sql = "UPDATE users SET reset_password_expires = ? WHERE user_id = ?";
  const values = [resetPasswordExpires, user_id];
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.getUserByResetPasswordToken = async (resetPasswordToken) => {
  const sql =
    "SELECT * FROM users WHERE reset_password_token = ? and reset_password_expires >= ? LIMIT 1";
  const values = [resetPasswordToken, require('../utils/convertDate').getNow()];
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
  return result[0];
};

exports.updatePassword = async (user_id, password) => {
  const sql = "UPDATE users SET password = ? WHERE user_id = ?";
  const values = [password, user_id];
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
