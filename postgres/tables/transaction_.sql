BEGIN TRANSACTION;
	
CREATE TABLE transaction_(
	transaction_id SERIAL NOT NULL PRIMARY KEY,
	amount MONEY,
	date DATE,
	memo_note VARCHAR(200),
	category_type_id INT,
	transaction_type_id INT,
	user_id INT,
    account_id INT
);

COMMIT;