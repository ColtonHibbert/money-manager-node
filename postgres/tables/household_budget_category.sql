BEGIN TRANSACTION;

CREATE TABLE household_budget_category(
	household_budget_category_id SERIAL NOT NULL PRIMARY KEY,
	budget_amount NUMERIC,
	category_id INT,
	household_id INT,
	user_id INT
);
	
COMMIT;
