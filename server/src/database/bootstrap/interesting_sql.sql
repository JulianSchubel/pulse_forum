-- Drop all foregin keys
SELECT concat('ALTER TABLE `', TABLE_NAME, '` DROP FOREIGN KEY `', CONSTRAINT_NAME, '`;') 
FROM information_schema.key_column_usage 
WHERE CONSTRAINT_SCHEMA = 'forum'
AND referenced_table_name IS NOT NULL;
