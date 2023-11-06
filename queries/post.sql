-- Active: 1699240296360@@localhost@3306
-- Lấy danh sách bài đăng của người dùng
SELECT * FROM user_posts
LEFT JOIN posts ON user_posts.post_id = posts.post_id
WHERE user_posts.user_id = ?;

-- Lấy thông tin bài đăng dựa trên ID bài đăng
SELECT p.post_id, p.title, p.body, p.posted_at, COUNT(c.comment_id) AS comment_count, COUNT(pl.like_id) AS like_count, GROUP_CONCAT(pl.user_id) AS liked_users FROM posts p
LEFT JOIN user_comment uc ON uc.post_id = p.post_id
LEFT JOIN comments c ON c.comment_id = uc.comment_id
LEFT JOIN post_likes pl ON pl.post_id = p.post_id
WHERE p.post_id = ?
GROUP BY p.post_id;

-- Tạo bài đăng mới
INSERT INTO posts (post_id, title, body, posted_at) VALUES (?, ?, ?, ?);

-- Tạo liên kết giữa người dùng và bài đăng
INSERT INTO user_posts (user_id, post_id) VALUES (?, ?);

-- Xóa luot thích của bài đăng
DELETE pl FROM post_likes pl
JOIN posts p ON pl.post_id = p.post_id
WHERE p.post_id = ?;

-- Xoá bài đăng khỏi danh sách bài đăng của người dùng
DELETE up FROM user_posts up
JOIN posts p ON up.post_id = p.post_id
WHERE p.post_id = ?;

-- Xoá tất cả lượt thích của bài đăng
DELETE cl FROM comment_likes cl
JOIN user_comment uc ON cl.comment_id = uc.comment_id
JOIN posts p ON uc.post_id = p.post_id
WHERE p.post_id = ?;

-- Xoá tất cả các bình luận của bài đăng
DELETE c FROM comments c
JOIN user_comment uc ON c.comment_id = uc.comment_id
JOIN posts p ON uc.post_id = p.post_id
WHERE p.post_id = ?;

DELETE uc FROM user_comment uc
JOIN posts p ON uc.post_id = p.post_id
WHERE p.post_id = ?;

-- Xoá bài đăng trong bảng posts
DELETE FROM posts WHERE post_id = ?;

-- Cập nhật thông tin bài đăng
UPDATE posts SET title = ?, body = ? WHERE post_id = ?;

-- Thích bài đăng
INSERT INTO post_likes (user_id, post_id) VALUES (?, ?);

-- Bỏ thích bài đăng
DELETE FROM post_likes WHERE user_id = ? AND post_id = ?;