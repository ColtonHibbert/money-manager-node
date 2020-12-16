BEGIN TRANSACTION;

CREATE TABLE category_item(
	category_item_id SERIAL NOT NULL PRIMARY KEY,
	category_item_name VARCHAR(200) UNIQUE
);

COMMIT;
