-- Migration Phase 2: Transport & Last Mile (TMS)

-- 1. Update Motos (Vehicles)
-- Add capacity fields
ALTER TABLE motos
ADD COLUMN IF NOT EXISTS capacidad_volumen DECIMAL(10, 2) DEFAULT 0 COMMENT 'm3',
ADD COLUMN IF NOT EXISTS capacidad_peso DECIMAL(10, 2) DEFAULT 0 COMMENT 'kg',
ADD COLUMN IF NOT EXISTS ubicacion_actual_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS ubicacion_actual_lng DECIMAL(11, 8);

-- 2. Routes (Rutas de Entrega)
-- Groups multiple orders into a single trip
CREATE TABLE IF NOT EXISTS rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    moto_id INT NOT NULL,
    chofer_id INT COMMENT 'Redundant but useful for history if moto reassigned',
    fecha DATE NOT NULL,
    estado ENUM('planificada', 'en_curso', 'completada', 'cancelada') DEFAULT 'planificada',
    km_estimados DECIMAL(10, 2),
    tiempo_estimado_min INT,
    fecha_inicio TIMESTAMP NULL,
    fecha_fin TIMESTAMP NULL,
    FOREIGN KEY (moto_id) REFERENCES motos(id)
);

-- 3. Route Stops (Paradas)
-- Links orders to a route in a specific sequence
CREATE TABLE IF NOT EXISTS paradas_ruta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    pedido_id INT NOT NULL,
    secuencia INT NOT NULL COMMENT '1, 2, 3...',
    estado ENUM('pendiente', 'en_camino', 'entregado', 'no_entregado') DEFAULT 'pendiente',
    hora_estimada TIMESTAMP NULL,
    hora_real TIMESTAMP NULL,
    notas TEXT,
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- 4. Update Orders
-- Add 'planificado' state to orders
ALTER TABLE pedidos 
MODIFY COLUMN estado ENUM('pendiente', 'planificado', 'preparado', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente';
