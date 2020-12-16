BEGIN TRANSACTION;

CREATE TABLE household_budget_category_item(
	household_budget_category_item_id SERIAL NOT NULL PRIMARY KEY,
	household_budget_cagetory_id INT,
	category_item_id INT
);

COMMIT;