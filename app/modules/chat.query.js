const db = require("../services/database.service.js");

exports.getConversations = async (user_id) => {
  const sql =
    "SELECT c.conversation_id, c.conversation_name, m.content, m.sent_at \
    FROM conversations c \
    JOIN messages m ON c.conversation_id = m.conversation_id \
    JOIN participants p ON c.conversation_id = p.conversation_id \
    WHERE p.user_id = ?  \
    ORDER BY m.sent_at ASC;";
  const values = [user_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return result;
};

exports.updateConversation = async (conversation_id, conversation_name) => {
  const sql =
    "UPDATE conversations SET conversation_name = ? WHERE conversation_id = ?";
  const values = [conversation_name, conversation_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.joinConversation = async (participant_id, conversation_id, user_id) => {
  const sql =
    "INSERT INTO participants (participant_id, conversation_id, user_id) VALUES (? ,?, ?)";
  const values = [participant_id, conversation_id, user_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return result;
};

exports.leaveConversation = async (conversation_id, user_id) => {
  const sql =
    "DELETE FROM participants WHERE conversation_id = ? AND user_id = ?";
  const values = [conversation_id, user_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return result;
};

exports.createConversation = async (
  conversation_id,
  conversation_name,
  created_at
) => {
  const sql =
    "INSERT INTO conversations (  conversation_id,  conversation_name,  created_at) VALUES (?, ?, ?)";
  const values = [conversation_id, conversation_name, created_at];
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(sql, values, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.sendMessage = async (
  conversation_id,
  sender_id,
  message_id,
  content,
  sent_at
) => {
  const sql =
    "INSERT INTO messages (conversation_id, sender_id, message_id, content, sent_at) VALUES (?, ?, ?, ?, ?)";
  const values = [conversation_id, sender_id, message_id, content, sent_at];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err) => {
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

exports.getMessages = async (conversation_id) => {
  const sql =
    "SELECT m.message_id, m.content, m.sent_at, u.user_id, u.full_name \
        FROM messages m \
        JOIN users u ON m.user_id = u.user_id \
        WHERE m.conversation_id = ? \
        ORDER BY m.sent_at ASC;";
  const values = [conversation_id];
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

exports.checkUserInConversation = async (conversation_id, user_id) => {
  const sql =
    "SELECT * FROM participants WHERE conversation_id = ? AND user_id = ?";
  const values = [conversation_id, user_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (result.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  });
  return result;
};

exports.getPaticipants = async (conversation_id) => {
  const sql =
    "SELECT u.user_id, u.full_name, u.profile_avatar \
    FROM users u \
    JOIN participants p ON u.user_id = p.user_id \
    WHERE p.conversation_id = ?;";
  const values = [conversation_id];
  const result = await new Promise((resolve, reject) => {
    db.query(sql, values, (err) => {
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
