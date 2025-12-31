-- Migration Phase 3: Reverse Logistics (Returns)

-- 1. Returns Table (Devoluciones / RMA)
CREATE TABLE IF NOT EXISTS devoluciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255) NOT NULL COMMENT 'Dañado, Incorrecto, Arrepentimiento...',
    estado ENUM('pendiente', 'aprobada', 'rechazada', 'recibida', 'completada') DEFAULT 'pendiente',
    resolucion ENUM('reembolso', 'cambio', 'reparacion') DEFAULT 'reembolso',
    notas TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- 2. Return Items (Artículos a devolver)
CREATE TABLE IF NOT EXISTS detalle_devolucion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    devolucion_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    condicion_recibida ENUM('nuevo', 'abierto', 'danado', 'scrap') DEFAULT 'nuevo',
    FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- 3. Add 'reabastecido' specific movement type to movements enum?
ALTER TABLE movimientos_stock 
MODIFY COLUMN tipo ENUM('entrada', 'salida', 'movimiento', 'ajuste', 'reserva', 'devolucion', 'merma') NOT NULL;
