const db = require('../services/database.service.js');

exports.getUsers = async email => {
    const countSql = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    const dataSql = 'SELECT * FROM users WHERE email = ?';
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
            data: dataResult
        };

        return output;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.createUser = async (name, email, password, profileAvatar, dateOfBirth) => {
    const sql = 'INSERT INTO users (fullName, email, password, profileAvatar, dateOfBirth) VALUES (?, ?, ?, ?, ?)';
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
}

exports.updateRefreshToken = async (id, refreshToken) => {
    const sql = 'UPDATE users SET refreshToken = ? WHERE id = ?';
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
}

