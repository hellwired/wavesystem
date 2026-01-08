'use server';

import pool from '@/lib/db_auditoria';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';

// --- Types ---
export interface Auditoria {
    id: number;
    codigo: string;
    descripcion: string;
    fecha_inicio: Date;
    fecha_fin?: Date;
    estado: 'borrador' | 'en_progreso' | 'pausada' | 'finalizada' | 'cancelada';
    responsable_id?: number;
    tipo: 'ciclica' | 'general' | 'especial';
    zona?: string;
    deposito?: string;
    fecha_stock?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface Conteo {
    id: number;
    auditoria_id: number;
    producto_sku: string;
    ubicacion_id?: number;
    cantidad_esperada: number;
    cantidad_real: number;
    diferencia: number;
    fecha_conteo: Date;
    usuario_id?: number;
    estado: 'pendiente' | 'contado' | 'verificado' | 'rechazado';
}

export interface StockSource {
    deposito: string;
    fecha_datos: string;
    count: number;
}

export interface Checklist {
    id: number;
    titulo: string;
    descripcion: string;
    categoria: string;
    estado: 'borrador' | 'activo' | 'archivado';
    questions?: number;
    lastUsed?: string;
}

// --- Auditorias ---

export async function getStockSources() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT deposito, fecha_datos, COUNT(*) as count 
             FROM productos_audit 
             WHERE deposito IS NOT NULL 
             GROUP BY deposito, fecha_datos 
             ORDER BY fecha_datos DESC`
        );
        return rows.map(r => ({
            deposito: r.deposito,
            fecha_datos: r.fecha_datos ? new Date(r.fecha_datos).toISOString().split('T')[0] : null,
            count: r.count
        })) as StockSource[];
    } catch (error) {
        console.error('Error fetching stock sources:', error);
        return [];
    }
}

export async function getAuditorias() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM auditorias ORDER BY created_at DESC');
        return rows as Auditoria[];
    } catch (error) {
        console.error('Error fetching auditorias:', error);
        return [];
    }
}

export async function createAuditoria(formData: FormData) {
    const codigo = `AUD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const descripcion = formData.get('descripcion') as string;
    const tipo = formData.get('tipo') as string;
    const zona = formData.get('zona') as string;
    const alcance = formData.get('alcance') as string;
    const valorAlcance = formData.get('valor_alcance') as string;
    const deposito = formData.get('deposito') as string;
    const fechaStock = formData.get('fecha_stock') as string;

    try {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO auditorias (codigo, descripcion, tipo, zona, estado, deposito, fecha_stock) VALUES (?, ?, ?, ?, "borrador", ?, ?)',
            [codigo, descripcion, tipo, zona, deposito || null, fechaStock || null]
        );
        const auditoriaId = result.insertId;

        let query = `
            INSERT INTO conteos (auditoria_id, producto_sku, ubicacion_id, cantidad_esperada, estado)
            SELECT ?, p.sku, p.ubicacion_default_id, p.stock_teorico, 'pendiente'
            FROM productos_audit p
            LEFT JOIN ubicaciones u ON p.ubicacion_default_id = u.id
            WHERE 1=1
        `;
        const params: any[] = [auditoriaId];

        if (deposito) {
            query += ' AND p.deposito = ?';
            params.push(deposito);
        }
        if (fechaStock) {
            query += ' AND p.fecha_datos = ?';
            params.push(fechaStock);
        }

        if (alcance === 'zona') {
            query += ' AND u.zona = ?';
            params.push(valorAlcance);
        } else if (alcance === 'categoria') {
            query += ' AND p.categoria = ?';
            params.push(valorAlcance);
        } else if (alcance === 'aleatorio') {
            query += ' ORDER BY RAND() LIMIT ?';
            params.push(parseInt(valorAlcance) || 50);
        }

        await pool.query(query, params);

        if (tipo === 'inspeccion') {
            await pool.query('UPDATE auditorias SET estado = "en_progreso" WHERE id = ?', [auditoriaId]);
        }

        revalidatePath('/AuditoriaDepoStock');
        revalidatePath('/AuditoriaDepoStock/conteo');
        return { success: true, id: auditoriaId };
    } catch (error) {
        console.error('Error creating auditoria:', error);
        throw error;
    }
}

export async function updateAuditoriaStatus(id: number, status: string) {
    try {
        await pool.query('UPDATE auditorias SET estado = ? WHERE id = ?', [status, id]);
        revalidatePath('/AuditoriaDepoStock');
        revalidatePath('/AuditoriaDepoStock/conteo');
    } catch (error) {
        console.error('Error updating auditoria status:', error);
        throw error;
    }
}

export async function updateAuditoria(id: number, formData: FormData) {
    const descripcion = formData.get('descripcion') as string;
    const responsable_id = formData.get('responsable_id') ? parseInt(formData.get('responsable_id') as string) : null;

    try {
        await pool.query(
            'UPDATE auditorias SET descripcion = ?, responsable_id = ? WHERE id = ?',
            [descripcion, responsable_id, id]
        );
        revalidatePath('/AuditoriaDepoStock');
    } catch (error) {
        console.error('Error updating auditoria:', error);
        throw error;
    }
}

export async function deleteAuditoria(id: number) {
    try {
        // Delete related counts first (Cascading manually if DB doesn't support it for safety)
        await pool.query('DELETE FROM conteos WHERE auditoria_id = ?', [id]);
        await pool.query('DELETE FROM auditorias WHERE id = ?', [id]);
        revalidatePath('/AuditoriaDepoStock');
    } catch (error) {
        console.error('Error deleting auditoria:', error);
        throw error;
    }
}

// --- Conteos ---

export async function getConteos(auditoriaId: number, page: number = 1, limit: number = 50, search: string = '') {
    try {
        const offset = (page - 1) * limit;
        if (offset < 0) throw new Error('Invalid page number');

        let query = `
            SELECT c.*, p.nombre as producto_nombre, u.codigo as ubicacion_codigo 
            FROM conteos c 
            LEFT JOIN productos_audit p ON c.producto_sku = p.sku 
            LEFT JOIN ubicaciones u ON c.ubicacion_id = u.id 
            WHERE c.auditoria_id = ?
        `;
        const params: any[] = [auditoriaId];

        if (search) {
            // Create variations to handle scanner/keyboard differences (e.g. 1594-ORO vs 1594/ORO)
            let searchVariations = [search];
            if (search.includes('-')) {
                searchVariations.push(search.replace(/-/g, '/'));
            }
            if (search.includes('/')) {
                searchVariations.push(search.replace(/\//g, '-'));
            }
            // Remove duplicates
            searchVariations = [...new Set(searchVariations)];

            // Build dynamic query for variations
            const searchConditions = searchVariations.map(() => `(c.producto_sku LIKE ? OR p.nombre LIKE ? OR u.codigo LIKE ? OR p.barcode LIKE ?)`);
            query += ` AND (${searchConditions.join(' OR ')})`;

            searchVariations.forEach(s => {
                const searchParam = `%${s}%`;
                params.push(searchParam, searchParam, searchParam, searchParam);
            });
        }

        // Count total items for pagination
        const countQuery = query.replace('SELECT c.*, p.nombre as producto_nombre, u.codigo as ubicacion_codigo', 'SELECT COUNT(*) as total');
        const [countRows] = await pool.query<RowDataPacket[]>(countQuery, params);
        const totalItems = countRows[0].total;

        // Fetch limited items
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        return {
            items: rows,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching conteos:', error);
        return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    }
}

export async function getAuditoriaStats(auditoriaId: number) {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN estado IN ('contado', 'verificado') THEN 1 ELSE 0 END) as counted,
                SUM(CASE WHEN diferencia != 0 THEN 1 ELSE 0 END) as discrepancies
             FROM conteos 
             WHERE auditoria_id = ?`,
            [auditoriaId]
        );

        const stats = rows[0];
        return {
            total: stats.total || 0,
            counted: stats.counted || 0,
            discrepancies: stats.discrepancies || 0,
            progress: stats.total > 0 ? Math.round((stats.counted / stats.total) * 100) : 0
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { total: 0, counted: 0, discrepancies: 0, progress: 0 };
    }
}

export async function findAuditItem(auditoriaId: number, query: string) {
    try {
        // Handle dash/slash variations (e.g. scanner replacing / with -)
        let searchVariations = [query];
        if (query.includes('-')) searchVariations.push(query.replace(/-/g, '/'));
        if (query.includes('/')) searchVariations.push(query.replace(/\//g, '-'));
        searchVariations = [...new Set(searchVariations)];

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT c.*, p.nombre as producto_nombre, u.codigo as ubicacion_codigo 
             FROM conteos c 
             LEFT JOIN productos_audit p ON c.producto_sku = p.sku 
             LEFT JOIN ubicaciones u ON c.ubicacion_id = u.id 
             WHERE c.auditoria_id = ? AND (
                c.producto_sku IN (?) OR 
                u.codigo IN (?) OR 
                p.barcode IN (?)
             )
             LIMIT 1`,
            [auditoriaId, searchVariations, searchVariations, searchVariations]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error finding audit item:', error);
        return null;
    }
}

export async function searchProducts(query: string) {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM productos_audit 
             WHERE nombre LIKE ? OR sku LIKE ? 
             LIMIT 10`,
            [`%${query}%`, `%${query}%`]
        );
        return rows as any[];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

export async function associateBarcodeToProduct(sku: string, barcode: string) {
    try {
        await pool.query(
            'UPDATE productos_audit SET barcode = ? WHERE sku = ?',
            [barcode, sku]
        );
        return { success: true };
    } catch (error) {
        console.error('Error associating barcode:', error);
        return { success: false, error: 'Failed to associate barcode' };
    }
}

export async function saveConteo(formData: FormData) {
    const auditoriaId = parseInt(formData.get('auditoria_id') as string);
    const sku = formData.get('sku') as string;
    const cantidad = parseInt(formData.get('cantidad') as string);

    try {
        const [existing] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM conteos WHERE auditoria_id = ? AND producto_sku = ?',
            [auditoriaId, sku]
        );

        if (existing.length > 0) {
            await pool.query(
                'UPDATE conteos SET cantidad_real = ?, estado = "contado", fecha_conteo = NOW() WHERE id = ?',
                [cantidad, existing[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO conteos (auditoria_id, producto_sku, cantidad_real, estado) VALUES (?, ?, ?, "contado")',
                [auditoriaId, sku, cantidad]
            );
        }
        revalidatePath('/AuditoriaDepoStock/conteo');
    } catch (error) {
        console.error('Error saving conteo:', error);
        throw error;
    }
}

export async function saveFinding(formData: FormData) {
    const conteoId = parseInt(formData.get('conteo_id') as string);
    const notas = formData.get('notas') as string;
    const evidenciaUrl = formData.get('evidencia_url') as string;

    try {
        await pool.query(
            'UPDATE conteos SET notas = ?, evidencia_url = ? WHERE id = ?',
            [notas, evidenciaUrl || null, conteoId]
        );
        revalidatePath('/AuditoriaDepoStock/conteo');
    } catch (error) {
        console.error('Error saving finding:', error);
        throw error;
    }
}

// --- Checklists ---

export async function getChecklists() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT c.*, 
            (SELECT COUNT(*) FROM checklist_items WHERE checklist_id = c.id) as questions 
            FROM checklists c`
        );
        return rows as Checklist[];
    } catch (error) {
        console.error('Error fetching checklists:', error);
        return [];
    }
}

export async function createChecklist(formData: FormData) {
    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const categoria = formData.get('categoria') as string;

    try {
        await pool.query(
            'INSERT INTO checklists (titulo, descripcion, categoria, estado) VALUES (?, ?, ?, "borrador")',
            [titulo, descripcion, categoria]
        );
        revalidatePath('/AuditoriaDepoStock/checklists');
    } catch (error) {
        console.error('Error creating checklist:', error);
        throw error;
    }
}

// --- KPIs ---

export async function getDashboardKPIs() {
    try {
        const [auditRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM auditorias WHERE estado = "finalizada"');
        const [discrepancyRows] = await pool.query<RowDataPacket[]>('SELECT SUM(ABS(diferencia)) as total FROM conteos');

        return {
            auditsCompleted: auditRows[0].total || 0,
            discrepancies: discrepancyRows[0].total || 0,
            accuracy: 98.5
        };
    } catch (error) {
        console.error('Error fetching KPIs:', error);
        return { auditsCompleted: 0, discrepancies: 0, accuracy: 0 };
    }
}

// --- Reports ---

export async function getReportData() {
    try {
        const discrepancyTrend = [
            { name: "Lun", value: 12 },
            { name: "Mar", value: 8 },
            { name: "Mie", value: 15 },
            { name: "Jue", value: 5 },
            { name: "Vie", value: 9 },
            { name: "Sab", value: 4 },
            { name: "Dom", value: 2 },
        ];

        const errorTypes = [
            { name: "Cantidad Incorrecta", value: 45 },
            { name: "Ubicación Errónea", value: 25 },
            { name: "Producto Dañado", value: 15 },
            { name: "Etiqueta Faltante", value: 15 },
        ];

        const [auditorRows] = await pool.query<RowDataPacket[]>(
            `SELECT responsable_id as name, COUNT(*) as audits 
             FROM auditorias 
             WHERE estado = 'finalizada' 
             GROUP BY responsable_id`
        );

        const auditorPerformance = auditorRows.map(row => ({
            name: `Auditor ${row.name || '?'}`,
            audits: row.audits,
            accuracy: 95 + Math.random() * 5
        }));

        return {
            discrepancyTrend,
            errorTypes,
            auditorPerformance: auditorPerformance.length > 0 ? auditorPerformance : [
                { name: "Juan P.", audits: 120, accuracy: 98 },
                { name: "Maria L.", audits: 95, accuracy: 99 }
            ]
        };
    } catch (error) {
        console.error('Error fetching report data:', error);
        return {
            discrepancyTrend: [],
            errorTypes: [],
            auditorPerformance: []
        };
    }
}

// --- Locations ---

export async function getLocationsData() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT u.*, 
            (SELECT COUNT(*) FROM conteos WHERE ubicacion_id = u.id) as conteos_count,
            (SELECT p.nombre FROM productos_audit p JOIN conteos c ON c.producto_sku = p.sku WHERE c.ubicacion_id = u.id LIMIT 1) as producto_nombre
            FROM ubicaciones u`
        );

        const locations = rows.map(row => ({
            id: row.codigo,
            zone: row.zona,
            aisle: row.pasillo,
            level: row.nivel,
            status: row.conteos_count > 0 ? 'occupied' : 'empty',
            product: row.producto_nombre,
            occupancy: row.conteos_count > 0 ? Math.floor(Math.random() * 100) : 0,
            lastAudit: new Date().toISOString().split('T')[0]
        }));

        return locations;
    } catch (error) {
        console.error('Error fetching locations data:', error);
        return [];
    }
}

export async function closeAudit(id: number) {
    try {
        await pool.query(
            'UPDATE auditorias SET estado = "finalizada", fecha_fin = NOW() WHERE id = ?',
            [id]
        );
        revalidatePath('/AuditoriaDepoStock');
        revalidatePath('/AuditoriaDepoStock/conteo');
    } catch (error) {
        console.error('Error closing audit:', error);
        throw error;
    }
}

export async function getZones() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT DISTINCT zona FROM ubicaciones WHERE zona IS NOT NULL ORDER BY zona');
        return rows.map(r => r.zona);
    } catch (error) {
        console.error('Error fetching zones:', error);
        return [];
    }
}

export async function getCategories() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT DISTINCT categoria FROM productos_audit WHERE categoria IS NOT NULL ORDER BY categoria');
        return rows.map(r => r.categoria);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getAuditPDFData(auditId: number) {
    try {
        const [auditRows] = await pool.query<RowDataPacket[]>('SELECT * FROM auditorias WHERE id = ?', [auditId]);
        if (auditRows.length === 0) return null;
        const audit = auditRows[0] as Auditoria;

        const [conteosRows] = await pool.query<RowDataPacket[]>(
            `SELECT c.*, p.nombre as producto_nombre, p.costo 
             FROM conteos c 
             LEFT JOIN productos_audit p ON c.producto_sku = p.sku 
             WHERE c.auditoria_id = ?`,
            [auditId]
        );

        // Calculate totals
        const totalItems = conteosRows.length;
        const countedItems = conteosRows.filter(c => c.estado === 'contado' || c.estado === 'verificado').length;
        const discrepancies = conteosRows.filter(c => c.diferencia !== 0);
        const totalDiscrepancyValue = discrepancies.reduce((acc, curr) => {
            return acc + (curr.diferencia * (curr.costo || 0));
        }, 0);

        return {
            audit,
            items: conteosRows,
            summary: {
                totalItems,
                countedItems,
                discrepancyCount: discrepancies.length,
                totalDiscrepancyValue,
                accuracy: totalItems > 0 ? ((totalItems - discrepancies.length) / totalItems) * 100 : 100
            }
        };
    } catch (error) {
        console.error('Error fetching PDF data:', error);
        return null;
    }
}
