const db = require("../services/database.service.js");

exports.getConversations = async (user_id) => {
  const sql = "SELECT c.conversation_id, \
       c.conversation_name, \
       IFNULL(m.content, '') AS last_message,\
       IFNULL(m.sent_at, '') AS last_sent_at\
       FROM conversations c \
       LEFT JOIN  messages m ON c.conversation_id = m.conversation_id \
       LEFT JOIN  participants p ON c.conversation_id = p.conversation_id \
       WHERE p.user_id = ? \
       AND (m.sent_at IS NULL  OR m.sent_at = (SELECT MAX(sent_at) \
       FROM messages \
       WHERE conversation_id = c.conversation_id))";
  const values = [user_id];
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
        resolve();
      }
    });
  });
  return result;
};

exports.getMessages = async (conversation_id) => {
  const sql =
    "SELECT m.message_id, m.content, m.sent_at, u.user_id as sender_id, u.full_name as sender_name \
        FROM messages m \
        JOIN users u ON m.sender_id = u.user_id \
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

exports.updateMessage = async (message_id, sender_id, content) => { 
  try {
    const sql =
      "UPDATE messages SET content = ? WHERE message_id = ? AND sender_id = ?";
    const values = [content, message_id, sender_id];
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
}

exports.deleteMessage = async (message_id, sender_id) => {
  try {
    const sql =
      "DELETE FROM messages WHERE message_id = ? AND sender_id = ?";
    const values = [message_id, sender_id];
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
}

exports.deleteConversation = async (conversation_id) => {
  try {
    const sql =
      "DELETE FROM conversations WHERE conversation_id = ?";
    const values = [conversation_id];
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
}