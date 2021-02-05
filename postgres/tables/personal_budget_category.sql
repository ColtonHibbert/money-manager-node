BEGIN TRANSACTION;

CREATE TABLE personal_budget_category(
	personal_budget_category_id SERIAL NOT NULL PRIMARY KEY, 
	budget_amount NUMERIC,
	category_id INT,
	user_id INT
);

COMMIT;
