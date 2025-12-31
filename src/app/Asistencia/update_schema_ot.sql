USE Asistencia;

-- Agregar columna para permiso de horas extras
ALTER TABLE empleados 
ADD COLUMN permite_horas_extras BOOLEAN DEFAULT FALSE;
