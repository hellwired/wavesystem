-- Database Schema for Venta POS (MariaDB/MySQL)
-- Corrected Order to prevent Foreign Key Errors

-- 1. Users Table (Independent)
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CASHIER') NOT NULL DEFAULT 'CASHIER',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Clients Table (Independent)
CREATE TABLE IF NOT EXISTS Clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuit VARCHAR(20),
    address VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(100),
    currentAccountBalance DECIMAL(10, 2) DEFAULT 0.00,
    isActive BOOLEAN DEFAULT TRUE,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Products Table (Independent)
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    barcode VARCHAR(100),
    description VARCHAR(255) NOT NULL,
    costPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    salePrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    minStockAlert INT DEFAULT 5,
    isService BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_barcode (barcode),
    INDEX idx_description (description)
) ENGINE=InnoDB;

-- 4. Cash Registers (Independent)
CREATE TABLE IF NOT EXISTS CashRegisters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Cash Sessions (Depends on: Users, CashRegisters)
CREATE TABLE IF NOT EXISTS CashSessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    cashRegisterId INT NOT NULL,
    openingAmount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    closingAmount DECIMAL(10, 2) NULL,
    calculatedAmount DECIMAL(10, 2) NULL,
    difference DECIMAL(10, 2) NULL,
    openedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closedAt TIMESTAMP NULL,
    status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (cashRegisterId) REFERENCES CashRegisters(id)
) ENGINE=InnoDB;

-- 6. Cash Movements (Depends on: CashSessions)
CREATE TABLE IF NOT EXISTS CashMovements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessionId INT NOT NULL,
    type ENUM('DEPOSIT', 'WITHDRAWAL') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sessionId) REFERENCES CashSessions(id)
) ENGINE=InnoDB;

-- 7. Orders (Depends on: CashSessions, Clients, Users)
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessionId INT NOT NULL,
    clientId INT,
    userId INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('COMPLETED', 'CANCELED') DEFAULT 'COMPLETED',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sessionId) REFERENCES CashSessions(id),
    FOREIGN KEY (clientId) REFERENCES Clients(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
) ENGINE=InnoDB;

-- 8. Order Items (Depends on: Orders, Products)
-- This was causing the error because Orders must exist first
CREATE TABLE IF NOT EXISTS OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    priceAtSale DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id)
) ENGINE=InnoDB;

-- 9. Payments (Depends on: Orders)
CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    method ENUM('CASH', 'CARD', 'QR', 'TRANSFER', 'CURRENT_ACCOUNT') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Inventory Logs (Depends on: Products, Users)
CREATE TABLE IF NOT EXISTS InventoryLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    userId INT,
    type ENUM('SALE', 'PURCHASE', 'ADJUSTMENT', 'RETURN', 'CANCELLATION') NOT NULL,
    quantity INT NOT NULL,
    reason VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
) ENGINE=InnoDB;

-- Initialization Data
INSERT IGNORE INTO CashRegisters (name) VALUES ('Caja Principal');
