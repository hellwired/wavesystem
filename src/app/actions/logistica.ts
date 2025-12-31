'use server';

import pool from '@/lib/db_logistica';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// --- Types ---
export interface User {
    id: number;
    username: string;
    nivel_permiso: number;
}

export interface Product {
    id: number;
    nombre: string;
    stock: number;
    precio: number;
    sku: string;
    ancho: number;
    alto: number;
    largo: number;
    peso: number;
    punto_reorden: number;
}

export interface Moto {
    id: number;
    nombre: string;
    patente: string;
    estado: 'disponible' | 'en_viaje' | 'mantenimiento';
    usuario_id?: number;
}

export interface Order {
    id: number;
    cliente: string;
    direccion: string;
    estado: 'pendiente' | 'preparado' | 'en_camino' | 'entregado';
    moto_id?: number;
    fecha: Date;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    nombre_producto?: string;
    lote_id?: number;
}

// --- Auth ---

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    let user: User | null = null;
    let loginError: string | null = null;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM usuario_sistema WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            user = rows[0] as User;
            (await cookies()).set('user_session', JSON.stringify(user), { httpOnly: true, path: '/' });
        } else {
            loginError = 'Credenciales inválidas';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError = 'Error en el servidor';
    }

    if (loginError) {
        return { error: loginError };
    }

    if (user) {
        if (user.nivel_permiso === 1) { // Admin
            redirect('/logistica/dashboard');
        } else { // Chofer
            redirect('/logistica/chofer');
        }
    }
}

export async function logout() {
    (await cookies()).delete('user_session');
    redirect('/logistica/login');
}

export async function getSession() {
    const session = (await cookies()).get('user_session')?.value;
    return session ? JSON.parse(session) as User : null;
}

// --- Users CRUD ---

export async function getUsers() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, username, nivel_permiso FROM usuario_sistema');
        return rows as User[];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function createUser(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const nivel_permiso = parseInt(formData.get('nivel_permiso') as string);

    try {
        await pool.query('INSERT INTO usuario_sistema (username, password, nivel_permiso) VALUES (?, ?, ?)', [username, password, nivel_permiso]);
        revalidatePath('/logistica/usuarios');
    } catch (error) {
        console.error('Error creating user:', error);
        // In a real app we would return { error: ... } but for now valid HTML form submission just needs to not crash
    }
}

export async function deleteUser(id: number) {
    try {
        await pool.query('DELETE FROM usuario_sistema WHERE id = ?', [id]);
        revalidatePath('/logistica/usuarios');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// --- Products CRUD ---

export async function getProducts() {
    // Mapping 'producto' column to 'nombre' for consistency with interface
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, producto as nombre, stock, precio_min as precio, sku, ancho, alto, largo, peso, punto_reorden FROM productos');
    return rows as Product[];
}

export async function createProduct(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const stock = parseInt(formData.get('stock') as string);
    const precio = parseFloat(formData.get('precio') as string);

    const sku = formData.get('sku') as string;
    const ancho = parseFloat(formData.get('ancho') as string) || 0;
    const alto = parseFloat(formData.get('alto') as string) || 0;
    const largo = parseFloat(formData.get('largo') as string) || 0;
    const peso = parseFloat(formData.get('peso') as string) || 0;
    const punto_reorden = parseInt(formData.get('punto_reorden') as string) || 10;

    await pool.query(
        'INSERT INTO productos (producto, stock, precio_min, sku, ancho, alto, largo, peso, punto_reorden) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, stock, precio, sku, ancho, alto, largo, peso, punto_reorden]
    );
    revalidatePath('/logistica/productos');
}

// --- Motos CRUD ---

export async function getMotos() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM motos');
    return rows as Moto[];
}

export async function createMoto(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const patente = formData.get('patente') as string;
    const usuario_id = formData.get('usuario_id') ? parseInt(formData.get('usuario_id') as string) : null;

    await pool.query('INSERT INTO motos (nombre, patente, estado, usuario_id) VALUES (?, ?, "disponible", ?)', [nombre, patente, usuario_id]);
    revalidatePath('/logistica/motos');
}

// --- Orders ---

export async function getOrders() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pedidos ORDER BY fecha DESC');
    return rows as Order[];
}

export async function getOrderDetails(orderId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT dp.*, p.producto as nombre_producto 
     FROM detalle_pedido dp 
     JOIN productos p ON dp.producto_id = p.id 
     WHERE dp.pedido_id = ?`,
        [orderId]
    );
    return rows as OrderItem[];
}

export async function createOrder(formData: FormData) {
    const cliente = formData.get('cliente') as string;
    const direccion = formData.get('direccion') as string;
    // For this demo, we'll assume a single product order for simplicity, 
    // or we'd need a complex UI to pass multiple items.
    // Let's assume we receive product_id and quantity from the form for now.
    const producto_id = parseInt(formData.get('producto_id') as string);
    const cantidad = parseInt(formData.get('cantidad') as string);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create Order Header
        const [orderResult] = await connection.query<ResultSetHeader>(
            'INSERT INTO pedidos (cliente, direccion, estado, picking_strategy, fecha) VALUES (?, ?, "pendiente", "FIFO", NOW())',
            [cliente, direccion]
        );
        const orderId = orderResult.insertId;

        // 2. FIFO Stock Allocation
        // Get batches (lotes) for this product ordered by entry date (FIFO)
        const [lotes] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM lotes WHERE producto_id = ? AND cantidad > 0 ORDER BY fecha_ingreso ASC',
            [producto_id]
        );

        let remainingQty = cantidad;

        // If no lots, we might check main product stock, but let's assume we use lots.
        // If we don't have lots system fully populated yet, we fallback to simple stock deduction.
        if (lotes.length === 0) {
            // Fallback: Simple stock deduction
            await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, producto_id]);
            await connection.query(
                'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario) SELECT ?, ?, ?, precio_min FROM productos WHERE id = ?',
                [orderId, producto_id, cantidad, producto_id]
            );
        } else {
            for (const lote of lotes) {
                if (remainingQty <= 0) break;

                const take = Math.min(remainingQty, lote.cantidad);

                // Deduct from lot
                await connection.query('UPDATE lotes SET cantidad = cantidad - ? WHERE id = ?', [take, lote.id]);

                // Add to order detail with lot reference
                // We need price from product
                const [prodRows] = await connection.query<RowDataPacket[]>('SELECT precio_min FROM productos WHERE id = ?', [producto_id]);
                const price = prodRows[0].precio_min;

                await connection.query(
                    'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, lote_id) VALUES (?, ?, ?, ?, ?)',
                    [orderId, producto_id, take, price, lote.id]
                );

                remainingQty -= take;
            }

            // Update main product stock count
            await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, producto_id]);
        }

        // 3. Check Reorder Point
        const [prodCheck] = await connection.query<RowDataPacket[]>(
            'SELECT stock, punto_reorden, producto FROM productos WHERE id = ?',
            [producto_id]
        );

        if (prodCheck[0].stock <= prodCheck[0].punto_reorden) {
            console.warn(`ALERT: Product ${prodCheck[0].producto} is below reorder point!`);
            // Here we could insert into a notifications table
        }

        await connection.commit();
        revalidatePath('/logistica/pedidos');
        revalidatePath('/logistica/dashboard');
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function assignMoto(orderId: number, motoId: number) {
    await pool.query('UPDATE pedidos SET moto_id = ?, estado = "preparado" WHERE id = ?', [motoId, orderId]);
    revalidatePath('/logistica/pedidos');
}

// --- Driver Actions ---

export async function getDriverOrders(userId: number) {
    // Find moto assigned to this user
    const [motos] = await pool.query<RowDataPacket[]>('SELECT id FROM motos WHERE usuario_id = ?', [userId]);

    if (motos.length === 0) return [];

    const motoId = motos[0].id;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pedidos WHERE moto_id = ? AND estado IN ("preparado", "en_camino")', [motoId]);
    return rows as Order[];
}

export async function startTrip(orderId: number, lat: number, lng: number) {
    await pool.query('UPDATE pedidos SET estado = "en_camino" WHERE id = ?', [orderId]);
    // Log start location?
    revalidatePath('/logistica/chofer');
}

export async function completeDelivery(orderId: number) {
    await pool.query('UPDATE pedidos SET estado = "entregado" WHERE id = ?', [orderId]);
    revalidatePath('/logistica/chofer');
}
