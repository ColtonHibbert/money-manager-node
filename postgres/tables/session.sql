BEGIN TRANSACTION;

CREATE TABLE session(
	session_id SERIAL NOT NULL PRIMARY KEY,
    session TEXT UNIQUE,
	user_id INT
);

COMMIT;