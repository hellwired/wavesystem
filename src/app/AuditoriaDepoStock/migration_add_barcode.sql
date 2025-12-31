ALTER TABLE productos_audit ADD COLUMN barcode VARCHAR(100) DEFAULT NULL;
CREATE INDEX idx_productos_audit_barcode ON productos_audit(barcode);
