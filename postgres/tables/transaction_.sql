BEGIN TRANSACTION;
	
CREATE TABLE transaction_(
	transaction_id SERIAL NOT NULL PRIMARY KEY,
	amount MONEY,
	date TIMESTAMP,
	memo_note VARCHAR(200),
	category_id INT,
	category_item_id INT,
	transaction_type_id INT,
	user_id INT,
    account_id INT
);

COMMIT;