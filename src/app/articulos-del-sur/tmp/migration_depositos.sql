-- Script de Migración para Artículos del Sur: Gestión de Depósitos
-- Generado por Antigravity DBA
-- Fecha: 2026-01-06

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. Crear tabla 'depositos'
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

-- Insertar Depósito Central por defecto para migración
INSERT INTO `depositos` (`id`, `nombre`, `direccion`, `activo`) 
VALUES (1, 'Depósito Central', 'Ubicación Principal', 1)
ON DUPLICATE KEY UPDATE nombre = nombre;

-- --------------------------------------------------------
-- 2. Crear tabla 'stock_depositos'
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
-- 3. Modificar tabla 'stock_movements'
-- --------------------------------------------------------

-- Agregar columna deposito_id si no existe (MariaDB no tiene IF NOT EXISTS para columnas, usamos un bloque condicional o asumimos que es nuevo)
-- Nota: Si esto falla porque la columna ya existe, se puede ignorar.
ALTER TABLE `stock_movements` 
ADD COLUMN `deposito_id` int(11) DEFAULT NULL AFTER `user_id`;

-- Agregar Foreign Key para stock_movements
ALTER TABLE `stock_movements`
ADD CONSTRAINT `fk_movement_deposito` FOREIGN KEY (`deposito_id`) REFERENCES `depositos` (`id`) ON DELETE SET NULL;

-- --------------------------------------------------------
-- 4. Migración de Datos (Logica de Negocio)
-- --------------------------------------------------------

-- Mover el stock existente en la tabla 'products' a 'stock_depositos' asignándolo al Depósito Central (ID 1)
INSERT INTO `stock_depositos` (`product_id`, `deposito_id`, `cantidad`)
SELECT `id`, 1, `stock`
FROM `products`
WHERE `stock` > 0
ON DUPLICATE KEY UPDATE `cantidad` = VALUES(`cantidad`);

-- Actualizar movimientos históricos para que apunten al Depósito Central (opcional, para consistencia)
UPDATE `stock_movements` SET `deposito_id` = 1 WHERE `deposito_id` IS NULL;

COMMIT;
