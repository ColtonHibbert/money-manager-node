BEGIN TRANSACTION;

ALTER TABLE transaction_ ADD constraint fk_category_id FOREIGN KEY(category_id) REFERENCES category(category_id);
ALTER TABLE transaction_ ADD constraint fk_transaction_type_id FOREIGN KEY(transaction_type_id) REFERENCES transaction_type(transaction_type_id);
ALTER TABLE transaction_ ADD constraint fk_user_id FOREIGN KEY(user_id) REFERENCES user_(user_id) ON DELETE CASCADE;
ALTER TABLE transaction_ ADD constraint fk_account_id FOREIGN KEY(account_id) REFERENCES account(account_id) ON DELETE CASCADE;

COMMIT;
