-- Lấy danh sách cuộc trò chuyện
SELECT c.conversation_id, c.conversation_name, m.content AS last_message, m.sent_at
FROM conversations c
LEFT JOIN messages m ON c.conversation_id = m.conversation_id
JOIN participants p ON c.conversation_id = p.conversation_id
WHERE p.user_id = ? AND m.sent_at = (
  SELECT MAX(sent_at)
  FROM messages
)
ORDER BY m.sent_at ASC;

-- Cập nhật tên cuộc trò chuyện
UPDATE conversations SET conversation_name = ? WHERE conversation_id = ?;

-- Tham gia cuộc trò chuyện
INSERT INTO participants (participant_id, conversation_id, user_id) VALUES (?, ?, ?);

-- Rời khỏi cuộc trò chuyện
DELETE FROM participants WHERE conversation_id = ? AND user_id = ?;

-- Tạo cuộc trò chuyện mới
INSERT INTO conversations (conversation_id, conversation_name, created_at) VALUES (?, ?, ?);

-- Gửi tin nhắn
INSERT INTO messages (conversation_id, sender_id, message_id, content, sent_at) VALUES (?, ?, ?, ?, ?);

-- Lấy danh sách tin nhắn trong một cuộc trò chuyện
SELECT m.message_id, m.content, m.sent_at, u.user_id AS sender_id, u.full_name AS sender_name
FROM messages m
JOIN users u ON m.sender_id = u.user_id
WHERE m.conversation_id = ?
ORDER BY m.sent_at ASC;

-- Kiểm tra người dùng trong cuộc trò chuyện
SELECT * FROM participants WHERE conversation_id = ? AND user_id = ?;

-- Lấy danh sách người tham gia cuộc trò chuyện
SELECT u.user_id, u.full_name, u.profile_avatar
FROM users u
JOIN participants p ON u.user_id = p.user_id
WHERE p.conversation_id = ?;

-- Cập nhật nội dung tin nhắn
UPDATE messages SET content = ? WHERE message_id = ? AND sender_id = ?;

-- Xóa tin nhắn
DELETE FROM messages WHERE message_id = ? AND sender_id = ?;

-- Xóa cuộc trò chuyện
DELETE FROM conversations WHERE conversation_id = ?;