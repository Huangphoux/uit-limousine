CREATE USER me;

CREATE DATABASE client;

GRANT ALL PRIVILEGES ON DATABASE client TO me;

\c client 

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  email VARCHAR ( 255 ),
  password VARCHAR ( 255 )
);

INSERT INTO users (username, email)
VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');