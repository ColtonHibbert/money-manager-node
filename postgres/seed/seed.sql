--Seed Development Database--


--Seed default roles and types--

BEGIN TRANSACTION;

INSERT INTO role(role_name) VALUES ('personal'), ('household_member'), ('household_owner');

INSERT INTO account_type(type_name) VALUES ('checking'), ('savings'), ('debt');

INSERT INTO transaction_type(type_name) VALUES ('withdrawal'), ('deposit'), ('transfer');

COMMIT;

--Seed default category--

BEGIN TRANSACTION;

INSERT INTO category(category_name) VALUES ('clothing'), ('debt'), ('deposit'), ('donation'), ('food'), ('gifts'), ('housing'), ('medical'), ('pet'), ('personal care'), ('school'), ('shopping'), ('subscriptions'), ('technology'), ('transfer'), ('transportation'), ('utilities');

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
('deposit'),
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
('rent'),
('repairs'),
('taxes'),
('medical insurance'),
('dental insurance'),
('vision insurance'),
('disability insurance'),
('life insurance'),
('medical bills'),
('medication'),
('pet food'),
('pet medication'),
('pet toys'),
('veterinarian'),
('haircuts'),
('cosmetics'),
('salon'),
('spa'),
('tuition'),
('books'),
('furniture'),
('outdoors'),
('sporting'),
('technology'),
('gym membership'),
('streaming'),
('television'),
('phone'),
('computers'),
('devices'),
('transfer'),
('vehicle payment'),
('fuel'),
('registration/taxes'),
('parking'),
('insurance'),
('public transportation'),
('internet'),
('cable'),
('heating'),
('garbage'),
('electricity'),
('water'),
('sewage'),
('gas');

COMMIT;

-- Seed User --

BEGIN TRANSACTION;

INSERT INTO user_(first_name, last_name, email, address, phone, about, joined, role_id) VALUES (
    'Steve',
    'Jobs',
    'codingwithcolton@gmail.com',
    '123 State Street, Salt Lake City, UT 84123',
    '801-555-7777',
    'I am really excited to budget!',
    DEFAULT,
    1
);

INSERT INTO auth(password_hash, user_id, role_id) VALUES(
    '$2a$14$3965TlMgaVkP/4bhNgRKz.bnHDBdBDjtmsKxKNSLU3g5vF9t9llVy',
    1,
    1
);

INSERT INTO account(account_name, current_balance, low_alert_balance, user_id, account_type_id) VALUES 
(
    'Wells Fargo', 
    8000.00, 
    2000.00,
    1,
    1
),
(
    'Chase Bank',
    65000.00,
    5000.00,
    1,
    2
),
(
    'Bank of America Credit Card',
    -3400.00,
    -5000.00,
    1,
    3
),
(
    'US Bank', 
    7000.00, 
    1000.00,
    1,
    1
),
(
    'Midwest Bank',
    25000.00,
    5000.00,
    1,
    2
),
(
    'America Credit Union',
    15000.00,
    5000.00,
    1,
    2
),
(
    'Discover Credit Card',
    -3400.00,
    -5000.00,
    1,
    3
);

INSERT INTO transaction_(
    amount, 
    date,
    memo_note, 
    category_id,
    category_item_id, 
    transaction_type_id, 
    user_id, 
    account_id ) VALUES 
(
    -75.00,
    DEFAULT,
    'cheesecake factory',
    5,
    18,
    1,
    1,
    1
),
(
    50.00,
    DEFAULT,
    'venmo for trip',
    3,
    13,
    2,
    1,
    2
),
(
    -100.00,
    DEFAULT,
    'new shoes',
    1,
    9,
    1,
    1,
    3
);

INSERT INTO personal_budget_category(
    budget_amount,
    category_id,
    user_id
) VALUES 
(0.00, 1, 1),
(0.00, 2, 1),
(0.00, 3, 1),
(0.00, 4, 1),
(0.00, 5, 1),
(0.00, 6, 1),
(0.00, 7, 1),
(0.00, 8, 1),
(0.00, 9, 1),
(0.00, 10, 1),
(0.00, 11, 1),
(0.00, 12, 1),
(0.00, 13, 1),
(0.00, 14, 1),
(0.00, 15, 1),
(0.00, 16, 1),
(0.00, 17, 1);

INSERT INTO personal_budget_category_item(
    personal_budget_category_id,
    category_item_id,
    user_id
) VALUES 
(1,3,1),
(1,4,1),
(1,5,1),
(1,6,1),
(1,7,1),
(1,8,1),
(1,9,1),
(1,1,1),

(2,10,1),
(2,11,1),
(2,12,1),

(3,13,1),

(4,14,1),
(4,15,1),
(4,16,1),

(5,17,1),
(5,18,1),
(5,19,1),

(6,20,1),
(6,21,1),
(6,22,1),

(7,23,1),
(7,24,1),
(7,25,1),
(7,26,1),
(7,27,1),

(8,28,1),
(8,29,1),
(8,30,1),
(8,31,1),
(8,32,1),
(8,33,1),
(8,34,1),

(9,35,1),
(9,36,1),
(9,37,1),
(9,38,1),

(10,39,1),
(10,40,1),
(10,41,1),
(10,42,1),

(11,43,1),
(11,44,1),

(12,45,1),
(12,46,1),
(12,47,1),
(12,48,1),

(13,49,1),
(13,50,1),
(13,51,1),

(14,52,1),
(14,53,1),
(14,54,1),

(15,55,1),

(16,56,1),
(16,57,1),
(16,58,1),
(16,59,1),
(16,60,1),
(16,61,1),
(16,26,1),

(17,62,1),
(17,63,1),
(17,64,1),
(17,65,1),
(17,66,1),
(17,67,1),
(17,68,1),
(17,69,1);


COMMIT;



