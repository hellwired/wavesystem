-- Upgrade Schema V2: Add Categories and Suppliers support for Stock Import

-- 1. Create Suppliers Table
CREATE TABLE IF NOT EXISTS Suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contactInfo VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_supplier_name (name)
) ENGINE=InnoDB;

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    groupName VARCHAR(100), -- Finds 'Agrupamiento' from CSV
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_name (name)
) ENGINE=InnoDB;

-- 3. Modify Products Table
-- Check if columns exist before adding (using a workaround for MySQL/MariaDB purely in SQL script is hard without procedures, 
-- but IF NOT EXISTS is not supported for ADD COLUMN in standard MariaDB widely used versions comfortably in one line).
-- We assume these columns don't exist yet or we ignore errors.
ALTER TABLE Products ADD COLUMN IF NOT EXISTS categoryId INT;
ALTER TABLE Products ADD COLUMN IF NOT EXISTS supplierId INT;

-- 4. Add Constraints
-- (Dropping first to avoid errors if re-running)
-- ALTER TABLE Products DROP FOREIGN KEY IF EXISTS fk_product_category;
-- ALTER TABLE Products DROP FOREIGN KEY IF EXISTS fk_product_supplier;

ALTER TABLE Products 
ADD CONSTRAINT fk_product_category 
FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL;

ALTER TABLE Products 
ADD CONSTRAINT fk_product_supplier 
FOREIGN KEY (supplierId) REFERENCES Suppliers(id) ON DELETE SET NULL;
