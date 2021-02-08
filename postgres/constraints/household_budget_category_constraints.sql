BEGIN TRANSACTION;

ALTER TABLE household_budget_category ADD constraint fk_category_id FOREIGN KEY(category_id) REFERENCES category(category_id);
ALTER TABLE household_budget_category ADD constraint fk_household_id FOREIGN KEY(household_id) REFERENCES household(household_id) ON DELETE CASCADE;
ALTER TABLE household_budget_category ADD constraint fk_user_id FOREIGN KEY(user_id) REFERENCES user_(user_id) ON DELETE CASCADE;
ALTER TABLE household_budget_category ADD constraint unique_household_category_per_household EXCLUDE USING gist(household_id WITH =, category_id WITH =);


COMMIT;
