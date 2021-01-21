BEGIN TRANSACTION;

CREATE TABLE auth(
	auth_id SERIAL NOT NULL PRIMARY KEY,
	password_hash TEXT,
	reset_token TEXT,
	token_expires TIMESTAMPTZ,
	user_id INT,
	role_id INT
);

COMMIT;