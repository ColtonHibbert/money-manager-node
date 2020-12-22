BEGIN TRANSACTION;

CREATE TABLE auth(
	auth_id SERIAL NOT NULL PRIMARY KEY,
	password_hash TEXT,
	session_id TEXT UNIQUE,
	csrf_token TEXT UNIQUE,
	user_id INT,
	role_id INT
);

COMMIT;