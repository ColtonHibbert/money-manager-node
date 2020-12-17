FROM postgres:10.6

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /constraints/ /docker-entrypoint-initdb.d/constraints/
ADD /seed/ /docker-entrypoint-initdb.d/seed/
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/