BEGIN TRANSACTION;

ALTER TABLE personal_budget_category_item ADD constraint fk_personal_budget_category_id FOREIGN KEY(personal_budget_category_id) REFERENCES personal_budget_category(personal_budget_category_id) ON DELETE CASCADE;
ALTER TABLE personal_budget_category_item ADD constraint fk_category_item_id FOREIGN KEY(category_item_id) REFERENCES category_item(category_item_id);
ALTER TABLE personal_budget_category_item ADD constraint fk_user_id FOREIGN KEY(user_id) REFERENCES user_(user_id) ON DELETE CASCADE; 
ALTER TABLE personal_budget_category ADD constraint unique_category_items_per_category_per_user EXCLUDE USING gist (user_id WITH =, category_item_id WITH =, personal_budget_category_id WITH =);

COMMIT;