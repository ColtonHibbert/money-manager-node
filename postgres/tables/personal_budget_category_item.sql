BEGIN TRANSACTION;

CREATE TABLE personal_budget_category_item(
	personal_budget_category_item_id SERIAL NOT NULL PRIMARY KEY,
	personal_budget_category_id INT,
	category_item_id INT
);

COMMIT;
