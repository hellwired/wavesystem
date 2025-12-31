import { Product as SharedProduct } from '../../schemas';

// Admin table expects an ID to function correctly (for keys, actions, etc.)
// We extend the shared schema but enforce 'id' and add UI fields.
export type Product = Omit<SharedProduct, 'id' | 'categoryId' | 'supplierId' | 'code' | 'barcode'> & {
    id: number; // Enforce ID
    code: string | null;
    barcode: string | null;
    markup_percentage?: number;
    categoryId?: number | null;
    supplierId?: number | null;
};

export type Category = {
    id: number;
    name: string;
};

export type Supplier = {
    id: number;
    name: string;
};
