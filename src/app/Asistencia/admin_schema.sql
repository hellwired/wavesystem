USE Asistencia;

-- Tabla para usuarios del sistema web (Administradores / RRHH)
CREATE TABLE IF NOT EXISTS usuarios_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- En producción usar hash (bcrypt)
    rol ENUM('admin', 'supervisor') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador por defecto
-- Usuario: admin
-- Password: admin123
INSERT INTO usuarios_sistema (usuario, password, rol)
VALUES ('admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE usuario=usuario;
