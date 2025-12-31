'use server';

import pool from '@/lib/ventapos-db';
import { ProductSchema, Product } from '../schemas';
import { revalidatePath } from 'next/cache';

export async function getProducts(query?: string) {
    try {
        let sql = `
      SELECT * FROM Products 
      WHERE isActive = TRUE
    `;
        const params: any[] = [];

        if (query) {
            sql += ` AND (description LIKE ? OR barcode LIKE ? OR code LIKE ?)`;
            params.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }

        sql += ` ORDER BY description ASC LIMIT 50`;

        const [rows] = await pool.query(sql, params);
        return { success: true, data: rows as Product[] };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: 'Failed to fetch products' };
    }
}

export async function getProductByBarcode(barcode: string) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM Products WHERE barcode = ? AND isActive = TRUE LIMIT 1`,
            [barcode]
        );
        const products = rows as Product[];
        return { success: true, data: products[0] || null };
    } catch (error) {
        console.error('Error fetching product by barcode:', error);
        return { success: false, error: 'Failed to fetch product' };
    }
}

export async function createProduct(data: Product) {
    const result = ProductSchema.safeParse(data);
    if (!result.success) {
        return { success: false, error: result.error.flatten() };
    }

    const { code, barcode, description, costPrice, salePrice, stock, minStockAlert, isService, categoryId, supplierId } = result.data;

    try {
        const [res] = await pool.query(
            `INSERT INTO Products (code, barcode, description, costPrice, salePrice, stock, minStockAlert, isService, categoryId, supplierId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, barcode, description, costPrice, salePrice, stock, minStockAlert, isService, categoryId, supplierId]
        );
        revalidatePath('/ventapos');
        // @ts-ignore
        return { success: true, id: res.insertId };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Failed to create product' };
    }
}

export async function updateProduct(id: number, data: Partial<Product>) {
    // Validate partial data? For now assuming simple updates
    try {
        const fields = [];
        const values = [];

        if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
        if (data.costPrice !== undefined) { fields.push('costPrice = ?'); values.push(data.costPrice); }
        if (data.salePrice !== undefined) { fields.push('salePrice = ?'); values.push(data.salePrice); }
        if (data.stock !== undefined) { fields.push('stock = ?'); values.push(data.stock); }
        if (data.minStockAlert !== undefined) { fields.push('minStockAlert = ?'); values.push(data.minStockAlert); }
        if (data.isService !== undefined) { fields.push('isService = ?'); values.push(data.isService); }
        if (data.categoryId !== undefined) { fields.push('categoryId = ?'); values.push(data.categoryId); }
        if (data.supplierId !== undefined) { fields.push('supplierId = ?'); values.push(data.supplierId); }

        if (fields.length === 0) return { success: false, error: 'No fields to update' };

        values.push(id);

        await pool.query(
            `UPDATE Products SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        revalidatePath('/ventapos');
        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Failed to update product' };
    }
}

export async function deleteProduct(id: number) {
    try {
        // Soft Delete: isActive = FALSE, deletedAt = NOW()
        await pool.query(
            `UPDATE Products SET isActive = FALSE, deletedAt = NOW() WHERE id = ?`,
            [id]
        );
        revalidatePath('/ventapos');
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}
