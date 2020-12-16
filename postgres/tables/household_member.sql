BEGIN TRANSACTION; 

CREATE TABLE household_member(
	household_member_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT,
	household_id INT
);

COMMIT;