-- Migration Phase 1: WMS Core

-- 1. Update Products Table
-- Adding SKU, dimensions, weight to existing 'productos' table
-- Note: Assuming 'productos' exists. If not, we create it.
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto VARCHAR(255) NOT NULL,
    stock INT DEFAULT 0,
    precio_min DECIMAL(10, 2) DEFAULT 0
);

ALTER TABLE productos
ADD COLUMN IF NOT EXISTS sku VARCHAR(50) UNIQUE AFTER id,
ADD COLUMN IF NOT EXISTS descripcion TEXT,
ADD COLUMN IF NOT EXISTS ancho DECIMAL(10, 2) COMMENT 'cm',
ADD COLUMN IF NOT EXISTS alto DECIMAL(10, 2) COMMENT 'cm',
ADD COLUMN IF NOT EXISTS largo DECIMAL(10, 2) COMMENT 'cm',
ADD COLUMN IF NOT EXISTS peso DECIMAL(10, 2) COMMENT 'kg',
ADD COLUMN IF NOT EXISTS punto_reorden INT DEFAULT 10;

-- 2. Warehouses (Almacenes)
CREATE TABLE IF NOT EXISTS almacenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    capacidad_total DECIMAL(10, 2) COMMENT 'm3',
    activo BOOLEAN DEFAULT TRUE
);

-- 3. Locations (Ubicaciones / Bins)
CREATE TABLE IF NOT EXISTS ubicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    almacen_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL COMMENT 'e.g., A-INT-01-01',
    pasillo VARCHAR(10),
    estanteria VARCHAR(10),
    altura VARCHAR(10),
    tipo ENUM('picking', 'almacenamiento', 'recepcion', 'despacho') DEFAULT 'almacenamiento',
    capacidad_max_peso DECIMAL(10, 2),
    ocupado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id) ON DELETE CASCADE,
    UNIQUE(almacen_id, codigo)
);

-- 4. Detailed Inventory (Inventario Detallado)
-- Tracks stock at a granular level (batch, location)
CREATE TABLE IF NOT EXISTS inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    ubicacion_id INT NOT NULL,
    lote VARCHAR(50),
    fecha_vencimiento DATE,
    cantidad INT NOT NULL DEFAULT 0,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id)
);

-- 5. Stock Movements (Movimientos)
-- Audit trail
CREATE TABLE IF NOT EXISTS movimientos_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('entrada', 'salida', 'movimiento', 'ajuste', 'reserva') NOT NULL,
    cantidad INT NOT NULL,
    ubicacion_origen_id INT,
    ubicacion_destino_id INT,
    usuario_id INT, -- Link to usuario_sistema if available
    referencia VARCHAR(100) COMMENT 'Order ID, PO Number, etc.',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Initial Data for default warehouse
INSERT IGNORE INTO almacenes (nombre, direccion) VALUES ('Almacén Central', 'Calle Principal 123');
