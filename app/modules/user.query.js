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
  const sql = "SELECT * FROM users WHERE id = ? LIMIT 1";
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
  name,
  email,
  password,
  profileAvatar,
  dateOfBirth
) => {
  const sql =
    "INSERT INTO users (full_name, email, password, profile_avatar, date_of_birth) VALUES (?, ?, ?, ?, ?)";
  const values = [name, email, password, profileAvatar, dateOfBirth];
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

exports.updateRefreshToken = async (id, refreshToken) => {
  const sql = "UPDATE users SET refreshToken = ? WHERE id = ?";
  const values = [refreshToken, id];
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

exports.updateResetPasswordToken = async (id, resetPasswordToken) => {
  const sql = "UPDATE users SET reset_password_token = ? WHERE id = ?";
  const values = [resetPasswordToken, id];
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

exports.updateResetPasswordExpires = async (id, resetPasswordExpires) => {
  const sql = "UPDATE users SET reset_password_expires = ? WHERE id = ?";
  const values = [resetPasswordExpires, id];
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
  const values = [resetPasswordToken, Date.now()];
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

exports.updatePassword = async (id, password) => {
  const sql = "UPDATE users SET password = ? WHERE id = ?";
  const values = [password, id];
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
