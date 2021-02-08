-- Deploy fresh database tables.--

\i '/docker-entrypoint-initdb.d/tables/account_type.sql'
\i '/docker-entrypoint-initdb.d/tables/account.sql'
\i '/docker-entrypoint-initdb.d/tables/auth.sql'
\i '/docker-entrypoint-initdb.d/tables/category_item.sql'
\i '/docker-entrypoint-initdb.d/tables/category.sql'
\i '/docker-entrypoint-initdb.d/tables/household_budget_category_item.sql'
\i '/docker-entrypoint-initdb.d/tables/household_budget_category.sql'
\i '/docker-entrypoint-initdb.d/tables/household_member.sql'
\i '/docker-entrypoint-initdb.d/tables/household_owner.sql'
\i '/docker-entrypoint-initdb.d/tables/household.sql'
\i '/docker-entrypoint-initdb.d/tables/personal_budget_category_item.sql'
\i '/docker-entrypoint-initdb.d/tables/personal_budget_category.sql'
\i '/docker-entrypoint-initdb.d/tables/role.sql'
\i '/docker-entrypoint-initdb.d/tables/session.sql'
\i '/docker-entrypoint-initdb.d/tables/transaction_.sql'
\i '/docker-entrypoint-initdb.d/tables/transaction_type.sql'
\i '/docker-entrypoint-initdb.d/tables/user_.sql'

-- Add foreign key constraints. --
\i '/docker-entrypoint-initdb.d/constraints/a_create_gist_for_exclusion_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/account_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/auth_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/household_budget_category_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/household_budget_category_item_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/household_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/household_member_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/household_owner_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/personal_budget_category_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/personal_budget_category_item_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/session_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/transaction_constraints.sql'
\i '/docker-entrypoint-initdb.d/constraints/user_constraints.sql'


-- Seed database. --
\i '/docker-entrypoint-initdb.d/seed/seed.sql'