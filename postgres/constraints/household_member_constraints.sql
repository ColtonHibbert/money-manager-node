BEGIN TRANSACTION;

ALTER TABLE household_member ADD constraint fk_user_id FOREIGN KEY(user_id) REFERENCES user_(user_id) ON DELETE CASCADE;
ALTER TABLE household_member ADD constraint fk_household_id FOREIGN KEY(household_id) REFERENCES household(household_id) ON DELETE CASCADE;

COMMIT;