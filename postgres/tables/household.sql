BEGIN TRANSACTION;

CREATE TABLE household(
	household_id SERIAL NOT NULL PRIMARY KEY,
	household_name VARCHAR(150),
	household_greeting VARCHAR(150),
	user_id INT
);

COMMIT;
