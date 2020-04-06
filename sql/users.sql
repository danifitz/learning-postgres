CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    email VARCHAR(100)
);

INSERT INTO users (firstName, lastName, email) VALUES ('Jerry', 'Joker', 'jerry@example.com'), ('George', 'Washington', 'george@example.com');