USE social;

drop table if exists users, posts; 

create table users
(
    id             int auto_increment
        primary key,
    fullName      varchar(255) not null,
    email          varchar(255) not null,
    password       varchar(255) not null,
    profileAvatar varchar(255) null,
    dateOfBirth  date         null
);

create table posts
(
    id      int auto_increment
        primary key,
    title   varchar(255) not null,
    body    text       not null ,
    postedAt datetime not null,
    userId int         not null,
    constraint posts_ibfk_1
        foreign key (userId) references users (id)
);

create index userId
    on posts (userId);
