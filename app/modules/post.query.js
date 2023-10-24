const db = require("../services/database.service.js");

exports.getPostsOfUser = async (user_id) => { 
    const sql = "SELECT * FROM user_posts WHERE user_id = ?";
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
}

exports.createPost = async (post_id, title, body, ) => { 

}

