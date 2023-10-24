create table if not exists comments
(
    comment_id varchar(20) not null,
    content    text        not null,
    comment_at datetime    not null
);

alter table comments
    add constraint `PRIMARY`
        primary key (comment_id);

alter table comments
    add constraint comment_id_UNIQUE
        unique (comment_id);

create table if not exists follower
(
    follower_id varchar(20) not null,
    followed_id varchar(20) not null
);

alter table follower
    add constraint followed_id_UNIQUE
        unique (followed_id);

alter table follower
    add constraint follower_id_UNIQUE
        unique (follower_id);

create table if not exists post
(
    post_id   varchar(20)  not null,
    title     varchar(255) not null,
    body      text         not null,
    posted_at datetime     not null
);

alter table post
    add constraint `PRIMARY`
        primary key (post_id);

alter table post
    add constraint post_id_UNIQUE
        unique (post_id);

create table if not exists user_comment
(
    post_id        varchar(20) not null,
    user_id        varchar(20) not null,
    user_liked_cmt varchar(20) not null,
    comment_id     varchar(20) not null
);

alter table user_comment
    add constraint comment_id_UNIQUE
        unique (comment_id);

alter table user_comment
    add constraint post_id_UNIQUE
        unique (post_id);

alter table user_comment
    add constraint user_id_UNIQUE
        unique (user_id);

alter table user_comment
    add constraint user_liked_cmt_UNIQUE
        unique (user_liked_cmt);

alter table user_comment
    add constraint user_comment_comments_comment_id_fk
        foreign key (comment_id) references comments (comment_id);

alter table user_comment
    add constraint user_comment_post_post_id_fk
        foreign key (post_id) references post (post_id);

create table if not exists user_posts
(
    post_id    varchar(20) not null,
    user_id    varchar(20) not null,
    user_liked varchar(20) not null
);

alter table user_posts
    add constraint post_id_UNIQUE
        unique (post_id);

alter table user_posts
    add constraint user_id_UNIQUE
        unique (user_id);

alter table user_posts
    add constraint user_liked_UNIQUE
        unique (user_liked);

alter table user_posts
    add constraint user_posts_post_post_id_fk
        foreign key (post_id) references post (post_id);

create table if not exists users
(
    user_id                varchar(50)  not null,
    full_name              varchar(255) not null,
    email                  varchar(255) not null,
    password               varchar(255) not null,
    profile_avatar         varchar(255) not null,
    date_of_birth          date         not null,
    reset_password_expires datetime         null,
    reset_password_token   varchar(255) null
);

alter table users
    add constraint `PRIMARY`
        primary key (user_id);

alter table follower
    add constraint follower_users_user_id_fk
        foreign key (follower_id) references users (user_id);

alter table follower
    add constraint follower_users_user_id_fk2
        foreign key (followed_id) references users (user_id);

alter table user_comment
    add constraint user_comment_users_user_id_fk
        foreign key (user_id) references users (user_id);

alter table user_comment
    add constraint user_comment_users_user_id_fk2
        foreign key (user_liked_cmt) references users (user_id);

alter table user_posts
    add constraint user_posts_users_user_id_fk
        foreign key (user_id) references users (user_id);

alter table user_posts
    add constraint user_posts_users_user_id_fk2
        foreign key (user_liked) references users (user_id);

alter table users
    add constraint email_UNIQUE
        unique (email);

alter table users
    add constraint user_id_UNIQUE
        unique (user_id);

