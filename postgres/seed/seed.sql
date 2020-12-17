--Seed Development Database--


--Seed default roles and types--

BEGIN TRANSACTION;

INSERT INTO role(role_name) VALUES ('personal'), ('household_member'), ('household_owner');

INSERT INTO account_type(type_name) VALUES ('checking'), ('savings'), ('debt');

INSERT INTO transaction_type(type_name) VALUES ('withdrawal'), ('deposit'), ('transfer');

COMMIT;

--Seed default category--

BEGIN TRANSACTION;

INSERT INTO category(category_name) VALUES ('clothing'), ('debt'), ('donation'), ('food'), ('gifts'), ('housing'), ('medical'), ('pet'), ('personal care'), ('school'), ('shopping'), ('subscriptions'), ('technology'), ('transportation'), ('utilities');

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
('vehicle payment'),
('fuel'),
('repairs'),
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

INSERT INTO user_(first_name, last_name, email, address, phone, about, role_id) VALUES (
    'Steve',
    'Jobs',
    'stevejobs@moneymanagerexample.com',
    '123 State Street, Salt Lake City, UT 84123',
    '801-555-7777',
    'I am really excited to budget!',
    1
);

INSERT INTO auth(password_hash, session_id, csrf_token, user_id, role_id) VALUES(
    'futurehash',
    'futuresessionid',
    'futurecsrftoken',
    1,
    1
);

INSERT INTO account(account_name, current_balance, low_alert_balance, user_id, account_type_id) VALUES (
    'Wells Fargo', 
    8000.00, 
    2000.00,
    1,
    1
),
(
    'Chase Bank',
    65,000.00,
    5,000.00,
    1,
    2
),
(
    'Bank of America',
    -3400.00,
    -5000.00,
    1,
    3
);

INSERT INTO transaction_(amount, memo_note, category_id, transaction_type_id, user_id, account_id) VALUES 
(
    -75.00,
    'cheesecake factory',
    4,
    1,
    1,
    1
),
(
    50.00,
    'venmo for trip',
    null,
    2,
    1
),
(
    
),
(),
(),
(),
(

),
(),
();



COMMIT;

-- Seed Auth -- 


