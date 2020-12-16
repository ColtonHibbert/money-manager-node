BEGIN TRANSACTION;
	
CREATE TABLE transaction_type(
	transaction_type_id SERIAL NOT NULL PRIMARY KEY,
	type_name VARCHAR(100)
);

COMMIT;