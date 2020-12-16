FROM postgres:10.6

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /constraints/ /docker-entrypoint-initdb.d/constraints/
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/