#!/bin/bash
set -e

echo "Initializing forum database schema..."

mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    SOURCE /docker-entrypoint-initdb.d/schema.sql;
EOSQL

mysql --protocol=socket -uroot -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    SOURCE /docker-entrypoint-initdb.d/seed.sql;
EOSQL

echo "Forum schema and stored procedures loaded successfully!"
