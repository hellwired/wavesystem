-- Migration Fix: Login & Base Tables for Logistica

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS usuario_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nivel_permiso INT DEFAULT 2 COMMENT '1: Admin, 2: Chofer'
);

-- 2. Create Motos Table (Base version if missing)
CREATE TABLE IF NOT EXISTS motos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    patente VARCHAR(20) UNIQUE,
    estado ENUM('disponible', 'en_viaje', 'mantenimiento') DEFAULT 'disponible',
    usuario_id INT,
    capacidad_volumen DECIMAL(10, 2) DEFAULT 0,
    capacidad_peso DECIMAL(10, 2) DEFAULT 0,
    ubicacion_actual_lat DECIMAL(10, 8),
    ubicacion_actual_lng DECIMAL(11, 8),
    FOREIGN KEY (usuario_id) REFERENCES usuario_sistema(id)
);

-- 3. Create Orders Table (Base version if missing)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    estado ENUM('pendiente', 'planificado', 'preparado', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    moto_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (moto_id) REFERENCES motos(id)
);

-- 4. Insert Demo User (if not exists)
INSERT IGNORE INTO usuario_sistema (username, password, nivel_permiso) VALUES ('demo', 'demo', 1);

-- 5. Insert a Demo Driver (chofer) for testing
INSERT IGNORE INTO usuario_sistema (username, password, nivel_permiso) VALUES ('chofer', 'chofer', 2);
