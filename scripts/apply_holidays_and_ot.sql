USE Asistencia;

-- 1. Create feriados table
CREATE TABLE IF NOT EXISTS feriados (
    fecha DATE PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add column permite_horas_extras
-- Note: If this fails with "Duplicate column name", it is safe to ignore.
ALTER TABLE empleados ADD COLUMN permite_horas_extras BOOLEAN DEFAULT FALSE;
