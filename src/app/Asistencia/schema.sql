CREATE DATABASE IF NOT EXISTS Asistencia;
USE Asistencia;

-- 1. Turnos y Reglas de Negocio
CREATE TABLE IF NOT EXISTS turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    margen_tolerancia_minutos INT DEFAULT 15, -- Rules: Tolerance
    inicio_descanso TIME,
    fin_descanso TIME,
    horas_jornada DECIMAL(4,2) DEFAULT 8.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Empleados
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    turno_id INT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (turno_id) REFERENCES turnos(id),
    INDEX idx_dni (dni)
);

-- 3. Registro de Asistencias (Entradas/Salidas)
CREATE TABLE IF NOT EXISTS asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada DATETIME, -- Check-IN
    hora_salida DATETIME,  -- Check-OUT
    tipo_entrada ENUM('presencial', 'remoto') DEFAULT 'presencial',
    latitud DECIMAL(10, 8), -- For Geolocation
    longitud DECIMAL(11, 8),
    estado_asistencia ENUM('puntual', 'tarde', 'ausente', 'horas_extras', 'no_marco_salida') DEFAULT 'puntual',
    es_hora_extra BOOLEAN DEFAULT FALSE, -- Flag for OT sessions
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id),
    INDEX idx_fecha_empleado (fecha, empleado_id)
);

-- 4. Justificaciones y Licencias
CREATE TABLE IF NOT EXISTS justificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    tipo ENUM('medica', 'examen', 'matrimonio', 'fallecimiento', 'otro') NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    documento_url VARCHAR(255), -- Proof attachment
    estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    aprobado_por INT, -- Manager ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
);

-- 5. Auditoría de Accesos Rechazados
CREATE TABLE IF NOT EXISTS auditoria_accesos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT,
    fecha_hora DATETIME NOT NULL,
    tipo_intento ENUM('entrada', 'salida', 'desconocido') DEFAULT 'desconocido',
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
);

-- 5. Logs de Auditoría (Immutables)
CREATE TABLE IF NOT EXISTS auditoria_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tabla VARCHAR(50) NOT NULL,
    accion VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    registro_id INT NOT NULL,
    usuario_sistema VARCHAR(50) DEFAULT 'sistema',
    datos_json JSON, -- Snapshot of data
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un turno por defecto para pruebas
INSERT INTO turnos (nombre, hora_entrada, hora_salida, margen_tolerancia_minutos) 
VALUES ('General', '09:00:00', '18:00:00', 15)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar un empleado de prueba (DNI Demo)
INSERT INTO empleados (dni, nombres, apellidos, turno_id)
VALUES ('12345678', 'Empleado', 'Prueba', 1)
ON DUPLICATE KEY UPDATE dni=dni;
