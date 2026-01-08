-- Script Fase 5: Soporte POS (Pagos y Cuotas)

ALTER TABLE orders 
ADD COLUMN payment_method ENUM('cash', 'credit_card', 'mercado_pago') DEFAULT 'cash',
ADD COLUMN installments INT DEFAULT 1,
ADD COLUMN card_details VARCHAR(255) NULL;

-- Opcional: Agregar columna de descuento o recargo si se necesita en el futuro
-- ALTER TABLE orders ADD COLUMN surcharge DECIMAL(10,2) DEFAULT 0.00;
