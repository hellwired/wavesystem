-- Asegurar que existe el Local Uruguay (ID 2)
INSERT INTO depositos (id, nombre, direccion, activo)
VALUES (2, 'Local Uruguay', 'Showroom Principal', 1)
ON DUPLICATE KEY UPDATE nombre = 'Local Uruguay';
