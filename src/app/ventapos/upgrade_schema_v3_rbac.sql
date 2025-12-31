-- Upgrade Schema to support new RBAC Roles
-- Run this to update existing Users table

ALTER TABLE Users 
MODIFY COLUMN role ENUM('ADMIN', 'MANAGER', 'AUXILIARY', 'CASHIER') NOT NULL DEFAULT 'CASHIER';

-- Update types if necessary (already handled by schema update but good for documentation)
