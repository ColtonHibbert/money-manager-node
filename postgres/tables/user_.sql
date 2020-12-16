BEGIN TRANSACTION;

CREATE TABLE user_ (
	user_id SERIAL NOT NULL PRIMARY KEY, 
	first_name varchar(100),
	last_name varchar(100),
	email VARCHAR(100),
	address TEXT, 
	phone TEXT,
	about TEXT,
	joined TIMESTAMP
);

COMMIT;