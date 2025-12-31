-- Manual SQL for RBAC (Try running this in your SQL client if node script fails)
ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN', 'MANAGER', 'AUXILIARY', 'CASHIER') NOT NULL DEFAULT 'CASHIER';
