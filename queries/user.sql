-- Lấy thông tin người dùng dựa trên email
SELECT * FROM users WHERE email = ?;

-- Lấy thông tin người dùng dựa trên user_id
SELECT * FROM users WHERE user_id = ?;

-- Tạo người dùng mới
INSERT INTO users (user_id, full_name, email, password, profile_avatar, date_of_birth) 
VALUES (?, ?, ?, ?, ?, ?);

-- Cập nhật refresh token của người dùng
UPDATE users SET refresh_token = ? WHERE user_id = ?;

-- Cập nhật refresh token và access token vào danh sách đen của người dùng
UPDATE users SET refresh_token = ? WHERE user_id = ?;

-- Lấy refresh token từ danh sách đen của người dùng
SELECT refresh_token FROM users WHERE user_id = ?;

-- Cập nhật reset password token của người dùng
UPDATE users SET reset_password_token = ? WHERE user_id = ?;

-- Cập nhật thời gian hết hạn reset password của người dùng
UPDATE users SET reset_password_expires = ? WHERE user_id = ?;

-- Lấy thông tin người dùng dựa trên reset password token và thời gian hết hạn
SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires >= ? LIMIT 1;

-- Cập nhật mật khẩu mới cho người dùng
UPDATE users SET password = ? WHERE user_id = ?;