BEGIN TRANSACTION;

ALTER TABLE personal_budget_category ADD constraint fk_category_id FOREIGN KEY(category_id) REFERENCES category(category_id);
ALTER TABLE personal_budget_category ADD constraint fk_user_id FOREIGN KEY(user_id) REFERENCES user_(user_id) ON DELETE CASCADE;

COMMIT;
