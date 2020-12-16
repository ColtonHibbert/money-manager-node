BEGIN TRANSACTION;

ALTER TABLE account ADD constraint fk_user_id FOREIGN KEY(user_id) REFERENCES user_(user_id) ON DELETE CASCADE;
ALTER TABLE account ADD constraint fk_account_type_id FOREIGN KEY(account_type_id) REFERENCES account_type(account_type_id);

COMMIT;