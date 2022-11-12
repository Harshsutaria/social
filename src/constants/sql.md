create table profile(
id varchar primary key not null,
name varchar not null,
emailid varchar not null,
gender varchar ,
ct varchar ,
image varchar ,
description varchar,
lut varchar,
state varchar
)

create table profile_login(
id varchar primary key not null,
name varchar not null,
password varchar not null
)

create table profile_Activity(
source_profile varchar not null,
source_profile_name varchar not null,
activityid varchar not null,
destination_profile varchar not null,
destination_profile_name varchar not null,
primary key(source_profile , activityid , destination_profile)
)

create table profile_post(
id varchar primary key not null,
title varchar not null,
description varchar not null,
ct varchar ,
lut varchar ,
likecount varchar,
commentcount varchar ,
image varchar,
authorid varchar not null,
authorname varchar not null
)
