BEGIN TRANSACTION;

CREATE TABLE household_owner(
	household_owner_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT,
	household_id INT
);

COMMIT;