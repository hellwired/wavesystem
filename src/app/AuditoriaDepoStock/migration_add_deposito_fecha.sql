-- Migration: Add deposito and fecha_datos to productos_audit
ALTER TABLE productos_audit 
ADD COLUMN deposito VARCHAR(100) DEFAULT NULL AFTER ubicacion_default_id,
ADD COLUMN fecha_datos DATE DEFAULT NULL AFTER deposito;
