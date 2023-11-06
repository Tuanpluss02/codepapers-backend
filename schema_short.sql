-- Active: 1699240296360@@localhost@3306@codepapers
-- Table: blacklist_token
CREATE TABLE IF NOT EXISTS blacklist_token (
    token VARCHAR(255) NULL
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_avatar VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    reset_password_expires DATETIME NULL,
    reset_password_token VARCHAR(255) NULL,
    refresh_token VARCHAR(255) NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT email_UNIQUE UNIQUE (email),
    CONSTRAINT user_id_UNIQUE UNIQUE (user_id)
);

-- Table: posts
CREATE TABLE IF NOT EXISTS posts (
    post_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    posted_at DATETIME NOT NULL,
    PRIMARY KEY (post_id),
    CONSTRAINT post_id_UNIQUE UNIQUE (post_id)
);

-- Table: post_likes
CREATE TABLE IF NOT EXISTS post_likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    CONSTRAINT unique_like UNIQUE (post_id, user_id),
    CONSTRAINT post_likes_ibfk_1 FOREIGN KEY (post_id) REFERENCES posts (post_id),
    CONSTRAINT post_likes_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Table: comments
CREATE TABLE IF NOT EXISTS comments (
    comment_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    comment_at DATETIME NOT NULL,
    PRIMARY KEY (comment_id),
    CONSTRAINT comment_id_UNIQUE UNIQUE (comment_id)
);

-- Table: comment_likes
CREATE TABLE IF NOT EXISTS comment_likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    CONSTRAINT unique_like UNIQUE (comment_id, user_id),
    CONSTRAINT comment_likes_ibfk_1 FOREIGN KEY (comment_id) REFERENCES comments (comment_id),
    CONSTRAINT comment_likes_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Table: followers
CREATE TABLE IF NOT EXISTS followers (
    follower_id VARCHAR(50) NOT NULL,
    followed_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (followed_id, follower_id),
    CONSTRAINT followers_users_user_id_fk FOREIGN KEY (follower_id) REFERENCES users (user_id),
    CONSTRAINT followers_users_user_id_fk2 FOREIGN KEY (followed_id) REFERENCES users (user_id)
);

-- Table: conversations
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id VARCHAR(50) NOT NULL,
    conversation_name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (conversation_id)
);

-- Table: participants
CREATE TABLE IF NOT EXISTS participants (
    participant_id VARCHAR(50) NOT NULL,
    conversation_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (participant_id),
    CONSTRAINT participants_ibfk_1 FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id),
    CONSTRAINT participants_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
    message_id VARCHAR(50) NOT NULL,
    conversation_id VARCHAR(50) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    sent_at DATETIME NOT NULL,
    PRIMARY KEY (message_id),
    CONSTRAINT messages_ibfk_1 FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id),
    CONSTRAINT messages_ibfk_2 FOREIGN KEY (sender_id) REFERENCES users (user_id)
);

-- Table: user_comment
CREATE TABLE IF NOT EXISTS user_comment (
    post_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    comment_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (post_id, user_id, comment_id),
    CONSTRAINT comment_id_UNIQUE UNIQUE (comment_id),
    CONSTRAINT user_comment_comments_comment_id_fk FOREIGN KEY (comment_id) REFERENCES comments (comment_id),
    CONSTRAINT user_comment_post_post_id_fk FOREIGN KEY (post_id) REFERENCES posts (post_id),
    CONSTRAINT user_comment_users_user_id_fk FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS user_posts (
    user_id VARCHAR(50) NOT NULL,
    post_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (post_id) REFERENCES posts (post_id)
);