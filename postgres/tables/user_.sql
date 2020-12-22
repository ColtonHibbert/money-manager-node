BEGIN TRANSACTION;

CREATE TABLE user_ (
	user_id SERIAL NOT NULL PRIMARY KEY, 
	first_name varchar(100),
	last_name varchar(100),
	email VARCHAR(100) UNIQUE,
	address TEXT, 
	phone TEXT,
	about TEXT,
	joined TIMESTAMP,
	household_member_id INT,
	household_id INT,
	household_owner_id INT,
	role_id INT
);


COMMIT;