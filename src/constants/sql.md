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
