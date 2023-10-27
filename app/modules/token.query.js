const db = require("../services/database.service.js");

exports.isValidToken = async (token) => {
  const sql = "SELECT * FROM blacklist_token WHERE token = ?";
  const values = [token];
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
