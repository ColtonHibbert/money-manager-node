BEGIN TRANSACTION;

ALTER TABLE household_budget_category_item ADD constraint fk_household_budget_category_id FOREIGN KEY(household_budget_category_id) REFERENCES household_budget_category(household_budget_category_id) ON DELETE CASCADE;
ALTER TABLE household_budget_category_item ADD constraint fk_category_item_id FOREIGN KEY (category_item_id) REFERENCES category_item(category_item_id);
ALTER TABLE household_budget_category_item ADD constraint unique_household_category_item_per_household_category EXCLUDE USING gist(household_budget_category_id WITH =, category_item_id WITH =);

COMMIT;
