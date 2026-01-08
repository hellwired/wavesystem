-- Script de Migración Fase 2: Depósitos y Local
-- Generado por Antigravity DBA
-- Fecha: 2026-01-06

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. Asegurar tabla 'depositos' y crear LOCAL
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `depositos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Asegurar Depósito Central (ID 1)
INSERT INTO `depositos` (`id`, `nombre`, `direccion`, `activo`) 
VALUES (1, 'Depósito Central', 'Ubicación Almacén', 1)
ON DUPLICATE KEY UPDATE nombre = 'Depósito Central';

-- Crear LOCAL VENTA (ID 2)
INSERT INTO `depositos` (`id`, `nombre`, `direccion`, `activo`) 
VALUES (2, 'Local Venta', 'Showroom Principal', 1)
ON DUPLICATE KEY UPDATE nombre = 'Local Venta';

-- --------------------------------------------------------
-- 2. Asegurar tabla 'stock_depositos'
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `stock_depositos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `deposito_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_stock` (`product_id`, `deposito_id`),
  KEY `fk_stock_deposito` (`deposito_id`),
  CONSTRAINT `fk_stock_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_stock_deposito` FOREIGN KEY (`deposito_id`) REFERENCES `depositos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 3. Tabla Log de Transferencias
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `stock_transfers_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `from_deposito_id` int(11) NOT NULL,
  `to_deposito_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_transfer_product` (`product_id`),
  CONSTRAINT `fk_transfer_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 4. Reparación de Stock (Fallback)
-- --------------------------------------------------------
-- Si hay productos que no tienen stock en stock_depositos, inicializarlos en ID 1 con stock 0
INSERT IGNORE INTO `stock_depositos` (`product_id`, `deposito_id`, `cantidad`)
SELECT `id`, 1, 0 FROM `products`;

COMMIT;
