import { create } from 'zustand';
import { Product } from '../schemas';

export interface CartItem extends Product {
    quantity: number;
    subtotal: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

// Helper to ensure number
const toNum = (val: any) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
};

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (product) => {
        const { items } = get();
        const existing = items.find((i) => i.id === product.id);
        const price = toNum(product.salePrice);

        if (existing) {
            set({
                items: items.map((i) =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * price }
                        : i
                ),
            });
        } else {
            set({
                // Store safe numbers in the item itself to avoid repeat casting issues
                items: [...items, { ...product, salePrice: price, quantity: 1, subtotal: price }],
            });
        }
    },
    removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
    },
    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }

        set({
            items: get().items.map((i) => {
                if (i.id === productId) {
                    const price = toNum(i.salePrice);
                    return { ...i, quantity, subtotal: quantity * price };
                }
                return i;
            }),
        });
    },
    clearCart: () => set({ items: [] }),
    total: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
}));
