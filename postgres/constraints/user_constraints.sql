BEGIN TRANSACTION;

ALTER TABLE user_ ADD constraint fk_household_member_id FOREIGN KEY (household_member_id) REFERENCES household_member(household_member_id);
ALTER TABLE user_ ADD constraint fk_household_id FOREIGN KEY(household_id) REFERENCES household(household_id);
ALTER TABLE user_ ADD constraint fk_household_owner_id FOREIGN KEY (household_owner_id) REFERENCES household_owner(household_owner_id);
ALTER TABLE user_ ADD constraint fk_role_id FOREIGN KEY(role_id) REFERENCES role(role_id);

COMMIT;
