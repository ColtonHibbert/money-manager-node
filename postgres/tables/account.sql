BEGIN TRANSACTION;

CREATE TABLE account(
	account_id SERIAL NOT NULL PRIMARY KEY,
	account_name VARCHAR(100),
	current_balance MONEY,
	low_alert_balance MONEY,
	user_id INT,
	account_type_id INT
);

COMMIT;
