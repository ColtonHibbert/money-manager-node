BEGIN TRANSACTION;

ALTER TABLE session ADD constraint fk_user_id FOREIGN KEY(user_id) REFERENCES user_(user_id) ON DELETE CASCADE;
	
COMMIT;