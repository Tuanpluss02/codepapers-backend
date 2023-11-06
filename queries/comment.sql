-- Lấy danh sách bình luận trong một bài đăng
SELECT uc.post_id, cm.comment_id, uc.user_id, cm.content, cm.comment_at
FROM comments AS cm
LEFT JOIN user_comment AS uc ON cm.comment_id = uc.comment_id
LEFT JOIN comment_likes AS cl ON cm.comment_id = cl.comment_id
WHERE uc.post_id = ?
GROUP BY cm.comment_id;

-- Lấy thông tin bình luận dựa trên comment_id
SELECT u.post_id, c.comment_id, u.user_id, c.content, c.comment_at, COUNT(cl.like_id) AS like_count, GROUP_CONCAT(cl.user_id) AS liked_users
FROM comments c
LEFT JOIN user_comment u ON u.comment_id = c.comment_id
LEFT JOIN comment_likes cl ON cl.comment_id = c.comment_id
WHERE c.comment_id = ?
GROUP BY c.comment_id;

-- Thêm bình luận mới
INSERT INTO comments (comment_id, content, comment_at) VALUES (?, ?, ?);
INSERT INTO user_comment (post_id, user_id, comment_id) VALUES (?, ?, ?);

-- Cập nhật nội dung bình luận
UPDATE comments SET content = ? WHERE comment_id = ?;

-- Xóa bình luận
DELETE FROM user_comment WHERE comment_id = ?;
DELETE FROM comment_likes WHERE comment_id = ?;
DELETE FROM comments WHERE comment_id = ?;

-- Thích bình luận
INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?);

-- Bỏ thích bình luận
DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?;