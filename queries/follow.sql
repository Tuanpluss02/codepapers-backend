-- Lấy danh sách người theo dõi của người dùng
SELECT u.user_id, u.full_name, u.email, u.profile_avatar, u.date_of_birth FROM followers
JOIN codepapers.users u ON u.user_id = followers.follower_id
WHERE followed_id = ?;

-- Lấy danh sách người được theo dõi bởi người dùng
SELECT u.user_id, u.full_name, u.email, u.profile_avatar, u.date_of_birth FROM followers
JOIN codepapers.users u ON u.user_id = followers.followed_id
WHERE follower_id = ?;

-- Thêm một người theo dõi
INSERT INTO followers (follower_id, followed_id) VALUES (?, ?);

-- Hủy theo dõi một người
DELETE FROM followers WHERE follower_id = ? AND followed_id = ?;

-- Kiểm tra xem người dùng đã theo dõi hay chưa
SELECT * FROM followers WHERE follower_id = ? AND followed_id = ?;