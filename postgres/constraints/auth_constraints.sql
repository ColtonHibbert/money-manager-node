BEGIN TRANSACTION;

ALTER TABLE auth ADD constraint fk_user_id FOREIGN KEY (user_id) REFERENCES user_(user_id) ON DELETE CASCADE;
ALTER TABLE auth ADD constraint fk_role_id FOREIGN KEY (role_id) REFERENCES role(role_id);

COMMIT;
