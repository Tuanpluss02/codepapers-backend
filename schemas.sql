create table if not exists blacklist_token
(
    token varchar(255) null
);

create table if not exists comment_likes
(
    like_id    int auto_increment
        primary key,
    comment_id varchar(50) not null,
    user_id    varchar(50) not null
);

create index user_id
    on comment_likes (user_id);

alter table comment_likes
    add constraint unique_like
        unique (comment_id, user_id);

create table if not exists comment_likes
(
    like_id    int auto_increment
        primary key,
    comment_id varchar(50) not null,
    user_id    varchar(50) not null
);

create index user_id
    on comment_likes (user_id);

alter table comment_likes
    add constraint unique_like
        unique (comment_id, user_id);

create table if not exists comments
(
    comment_id varchar(50) not null,
    comment_id varchar(50) not null,
    content    text        not null,
    comment_at datetime    not null
);

alter table comments
    add primary key (comment_id);

alter table comment_likes
    add constraint comment_likes_ibfk_1
        foreign key (comment_id) references comments (comment_id);
    add primary key (comment_id);

alter table comment_likes
    add constraint comment_likes_ibfk_1
        foreign key (comment_id) references comments (comment_id);

alter table comments
    add constraint comment_id_UNIQUE
        unique (comment_id);

create table if not exists conversations
(
    conversation_id   varchar(50)  not null,
    conversation_name varchar(100) not null,
    created_at        datetime     not null
);

alter table conversations
    add primary key (conversation_id);

create table if not exists followers
create table if not exists conversations
(
    conversation_id   varchar(50)  not null,
    conversation_name varchar(100) not null,
    created_at        datetime     not null
);

alter table conversations
    add primary key (conversation_id);

create table if not exists followers
(
    follower_id varchar(50) not null,
    followed_id varchar(50) not null
);

alter table followers
    add primary key (followed_id, follower_id);

create table if not exists messages
(
    message_id      varchar(50) not null,
    conversation_id varchar(50) not null,
    sender_id       varchar(50) not null,
    content         text        not null,
    sent_at         datetime    not null
);

create index conversation_id
    on messages (conversation_id);

create index sender_id
    on messages (sender_id);

alter table messages
    add primary key (message_id);

alter table messages
    add constraint messages_ibfk_1
        foreign key (conversation_id) references conversations (conversation_id);

create table if not exists participants
(
    participant_id  varchar(50) not null,
    conversation_id varchar(50) not null,
    user_id         varchar(50) not null
);

create index conversation_id
    on participants (conversation_id);

create index user_id
    on participants (user_id);
alter table followers
    add primary key (followed_id, follower_id);

create table if not exists messages
(
    message_id      varchar(50) not null,
    conversation_id varchar(50) not null,
    sender_id       varchar(50) not null,
    content         text        not null,
    sent_at         datetime    not null
);

create index conversation_id
    on messages (conversation_id);

create index sender_id
    on messages (sender_id);

alter table messages
    add primary key (message_id);

alter table messages
    add constraint messages_ibfk_1
        foreign key (conversation_id) references conversations (conversation_id);

create table if not exists participants
(
    participant_id  varchar(50) not null,
    conversation_id varchar(50) not null,
    user_id         varchar(50) not null
);

create index conversation_id
    on participants (conversation_id);

create index user_id
    on participants (user_id);

alter table participants
    add primary key (participant_id);

alter table participants
    add constraint participants_ibfk_1
        foreign key (conversation_id) references conversations (conversation_id);

create table if not exists post_likes
(
    like_id int auto_increment
        primary key,
    post_id varchar(50) not null,
    user_id varchar(50) not null
);

create index user_id
    on post_likes (user_id);

alter table post_likes
    add constraint unique_like
        unique (post_id, user_id);
alter table participants
    add primary key (participant_id);

alter table participants
    add constraint participants_ibfk_1
        foreign key (conversation_id) references conversations (conversation_id);

create table if not exists post_likes
(
    like_id int auto_increment
        primary key,
    post_id varchar(50) not null,
    user_id varchar(50) not null
);

create index user_id
    on post_likes (user_id);

alter table post_likes
    add constraint unique_like
        unique (post_id, user_id);

create table if not exists posts
(
    post_id   varchar(50)  not null,
    title     varchar(255) not null,
    body      text         not null,
    posted_at datetime     not null
);

alter table posts
    add primary key (post_id);

alter table post_likes
    add constraint post_likes_ibfk_1
        foreign key (post_id) references posts (post_id);
    add primary key (post_id);

alter table post_likes
    add constraint post_likes_ibfk_1
        foreign key (post_id) references posts (post_id);

alter table posts
    add constraint post_id_UNIQUE
        unique (post_id);

create table if not exists user_comment
(
    post_id    varchar(50) not null,
    user_id    varchar(50) not null,
    comment_id varchar(50) not null
    post_id    varchar(50) not null,
    user_id    varchar(50) not null,
    comment_id varchar(50) not null
);

alter table user_comment
    add constraint comment_id_UNIQUE
        unique (comment_id);

alter table user_comment
    add constraint post_id_UNIQUE
        unique (post_id, user_id, comment_id);

-- alter table user_comment
--     add constraint user_id_UNIQUE
--         unique (user_id);

alter table user_comment
    add constraint user_comment_comments_comment_id_fk
        foreign key (comment_id) references comments (comment_id);

alter table user_comment
    add constraint user_comment_post_post_id_fk
        foreign key (post_id) references posts (post_id);

create table if not exists user_posts
(
    post_id varchar(50) not null,
    user_id varchar(50) not null
    post_id varchar(50) not null,
    user_id varchar(50) not null
);

alter table user_posts
    add primary key (user_id, post_id);
    add primary key (user_id, post_id);

alter table user_posts
    add constraint user_posts_posts_post_id_fk
    add constraint user_posts_posts_post_id_fk
        foreign key (post_id) references posts (post_id);

create table if not exists users
(
    user_id                varchar(50)  not null,
    full_name              varchar(255) not null,
    email                  varchar(255) not null,
    password               varchar(255) not null,
    profile_avatar         varchar(255) not null,
    date_of_birth          date         not null,
    reset_password_expires datetime     null,
    reset_password_token   varchar(255) null,
    refresh_token          varchar(255) null
);

alter table users
    add primary key (user_id);

alter table comment_likes
    add constraint comment_likes_ibfk_2
        foreign key (user_id) references users (user_id);
    add primary key (user_id);

alter table comment_likes
    add constraint comment_likes_ibfk_2
        foreign key (user_id) references users (user_id);

alter table followers
    add constraint followers_users_user_id_fk
alter table followers
    add constraint followers_users_user_id_fk
        foreign key (follower_id) references users (user_id);

alter table followers
    add constraint followers_users_user_id_fk2
alter table followers
    add constraint followers_users_user_id_fk2
        foreign key (followed_id) references users (user_id);

alter table messages
    add constraint messages_ibfk_2
        foreign key (sender_id) references users (user_id);

alter table participants
    add constraint participants_ibfk_2
        foreign key (user_id) references users (user_id);

alter table post_likes
    add constraint post_likes_ibfk_2
        foreign key (user_id) references users (user_id);

alter table messages
    add constraint messages_ibfk_2
        foreign key (sender_id) references users (user_id);

alter table participants
    add constraint participants_ibfk_2
        foreign key (user_id) references users (user_id);

alter table post_likes
    add constraint post_likes_ibfk_2
        foreign key (user_id) references users (user_id);

alter table user_comment
    add constraint user_comment_users_user_id_fk
        foreign key (user_id) references users (user_id);

alter table user_posts
    add constraint user_posts_users_user_id_fk
        foreign key (user_id) references users (user_id);

alter table users
    add constraint email_UNIQUE
        unique (email);

alter table users
    add constraint user_id_UNIQUE
        unique (user_id);



