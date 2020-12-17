--Seed default roles and types--

BEGIN TRANSACTION;

INSERT INTO role(role_name) VALUES ('personal'), ('household_member'), ('household_owner');

INSERT INTO account_type(type_name) VALUES ('checking'), ('savings'), ('credit');

INSERT INTO transaction_type(type_name) VALUES ('withdrawal'), ('deposit'), ('transfer');

COMMIT;

--Seed default category--

BEGIN TRANSACTION;

INSERT INTO category(category_name) VALUES ('clothing'), ('debt'), ('donation'), ('food'), ('gifts'), ('housing'), ('medical'), ('pet'), ('personal care'), ('school'), ('shopping'), ('subscriptions'), ('transportation'), ('utilities');

COMMIT;

--Seed default category_items--

BEGIN TRANSACTION;

INSERT INTO category_item(category_item_name) VALUES
('other'),
('misc'),
('accessories'),
('coats'),
('dresses'),
('hats'),
('pants'),
('shirts'),
('shoes'),
('credit cards'),
('student loans'),
('medical debt'),
('charity'),
('religious'),
('political'),
('groceries'),
('restaurants'),
('supplements'),
('holiday'),
('birthday'),
('service'),
('maintenance'),
('mortgage'),


COMMIT;