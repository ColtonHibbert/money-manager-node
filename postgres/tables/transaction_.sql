BEGIN TRANSACTION;
	
CREATE TABLE transaction_(
	transaction_id SERIAL NOT NULL PRIMARY KEY,
	amount NUMERIC,
	date TIMESTAMP,
	memo_note VARCHAR(200),
	personal_budget_category_id INT,
	personal_budget_category_item_id INT,
	household_budget_category_id INT,
	household_budget_category_item_id INT,
	transaction_type_id INT,
	user_id INT,
    account_id INT
);

COMMIT;