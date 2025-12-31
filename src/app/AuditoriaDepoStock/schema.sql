-- Database Schema for AuditoriaDepoStock

-- Table: auditorias
CREATE TABLE IF NOT EXISTS auditorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE, -- e.g., AUD-2024-001
    descripcion TEXT,
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME,
    estado ENUM('borrador', 'en_progreso', 'pausada', 'finalizada', 'cancelada') DEFAULT 'borrador',
    responsable_id INT, -- Link to user system if available
    tipo ENUM('ciclica', 'general', 'especial') DEFAULT 'ciclica',
    zona VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: ubicaciones (Warehouse Slots)
CREATE TABLE IF NOT EXISTS ubicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE, -- e.g., A-01-01
    zona VARCHAR(50) NOT NULL,
    pasillo VARCHAR(50),
    estante VARCHAR(50),
    nivel VARCHAR(50),
    estado ENUM('vacia', 'ocupada', 'bloqueada') DEFAULT 'vacia',
    capacidad_maxima DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: productos (Local copy or reference for audit purposes)
-- Assuming we might need to sync this or just reference SKUs
CREATE TABLE IF NOT EXISTS productos_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    costo DECIMAL(10, 2),
    stock_teorico INT DEFAULT 0,
    ubicacion_default_id INT,
    FOREIGN KEY (ubicacion_default_id) REFERENCES ubicaciones(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: conteos (Count Records)
CREATE TABLE IF NOT EXISTS conteos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auditoria_id INT NOT NULL,
    producto_sku VARCHAR(50) NOT NULL,
    ubicacion_id INT,
    cantidad_esperada INT DEFAULT 0,
    cantidad_real INT,
    diferencia INT GENERATED ALWAYS AS (cantidad_real - cantidad_esperada) VIRTUAL,
    fecha_conteo DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT, -- Auditor
    estado ENUM('pendiente', 'contado', 'verificado', 'rechazado') DEFAULT 'pendiente',
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE,
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: checklists
CREATE TABLE IF NOT EXISTS checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria ENUM('seguridad', 'equipos', 'operaciones', 'limpieza', 'otros') DEFAULT 'otros',
    estado ENUM('borrador', 'activo', 'archivado') DEFAULT 'borrador',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: checklist_items
CREATE TABLE IF NOT EXISTS checklist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checklist_id INT NOT NULL,
    pregunta TEXT NOT NULL,
    tipo_respuesta ENUM('si_no', 'texto', 'numero', 'foto') DEFAULT 'si_no',
    orden INT DEFAULT 0,
    FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE
);

-- Table: checklist_respuestas (Responses to checklists during an audit)
CREATE TABLE IF NOT EXISTS checklist_respuestas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auditoria_id INT NOT NULL,
    checklist_item_id INT NOT NULL,
    respuesta TEXT,
    comentario TEXT,
    usuario_id INT,
    fecha_respuesta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auditoria_id) REFERENCES auditorias(id) ON DELETE CASCADE,
    FOREIGN KEY (checklist_item_id) REFERENCES checklist_items(id) ON DELETE CASCADE
);

-- Table: configuracion (Settings)
CREATE TABLE IF NOT EXISTS configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descripcion TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial Configuration Data
INSERT INTO configuracion (clave, valor, descripcion) VALUES
('metodologia_conteo', 'abc', 'Metodología de conteo seleccionada (abc, aleatorio, control)'),
('frecuencia_generacion', 'diaria', 'Frecuencia de generación de tareas'),
('items_por_dia', '50', 'Cantidad máxima de items a contar por día'),
('abc_clase_a_porcentaje', '20', 'Porcentaje de items Clase A'),
('abc_clase_b_porcentaje', '30', 'Porcentaje de items Clase B'),
('abc_clase_c_porcentaje', '50', 'Porcentaje de items Clase C')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- Table: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'auditor') DEFAULT 'auditor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
