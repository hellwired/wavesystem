import { z } from 'zod';

// --- ENUMS ---
export const RoleEnum = z.enum(['ADMIN', 'MANAGER', 'AUXILIARY', 'CASHIER']);
export const CashSessionStatusEnum = z.enum(['OPEN', 'CLOSED']);
export const CashMovementTypeEnum = z.enum(['DEPOSIT', 'WITHDRAWAL']);
export const OrderStatusEnum = z.enum(['COMPLETED', 'CANCELED']);
export const PaymentMethodEnum = z.enum(['CASH', 'CARD', 'QR', 'TRANSFER', 'CURRENT_ACCOUNT']);
export const InventoryLogTypeEnum = z.enum(['SALE', 'PURCHASE', 'ADJUSTMENT', 'RETURN', 'CANCELLATION']);

// --- ENTITY SCHEMAS ---

export const ProductSchema = z.object({
    id: z.number().optional(),
    code: z.string().max(50).optional(),
    barcode: z.string().max(100).optional(),
    description: z.string().min(1, "Description is required").max(255),
    costPrice: z.number().min(0),
    salePrice: z.number().min(0),
    stock: z.number().int(),
    minStockAlert: z.number().int().default(5),
    isService: z.boolean().default(false),
    isActive: z.boolean().default(true),
    categoryId: z.number().optional().nullable(),
    supplierId: z.number().optional().nullable(),
});

export const CategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1).max(100),
    groupName: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
});

export const SupplierSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1).max(100),
    contactInfo: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
});

export const ClientSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required").max(100),
    cuit: z.string().max(20).optional(),
    address: z.string().max(255).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional().or(z.literal('')),
    currentAccountBalance: z.number().default(0),
    isActive: z.boolean().default(true),
});

export const CashRegisterSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1).max(50),
    isActive: z.boolean().default(true),
});

export const CashSessionSchema = z.object({
    id: z.number().optional(),
    userId: z.number(),
    cashRegisterId: z.number(),
    openingAmount: z.number().min(0),
    closingAmount: z.number().min(0).nullable().optional(),
    calculatedAmount: z.number().nullable().optional(),
    difference: z.number().nullable().optional(),
    status: CashSessionStatusEnum.default('OPEN'),
    openedAt: z.date().optional(),
    closedAt: z.date().nullable().optional(),
});

export const CashMovementSchema = z.object({
    id: z.number().optional(),
    sessionId: z.number(),
    type: CashMovementTypeEnum,
    amount: z.number().positive(),
    reason: z.string().min(1, "Reason is required").max(255),
});

export const OrderItemSchema = z.object({
    productId: z.number(),
    quantity: z.number().int().positive(),
    priceAtSale: z.number().min(0),
    subtotal: z.number().min(0),
});

export const PaymentSchema = z.object({
    method: PaymentMethodEnum,
    amount: z.number().positive(),
});

export const OrderSchema = z.object({
    id: z.number().optional(),
    sessionId: z.number(),
    clientId: z.number().nullable().optional(),
    userId: z.number(),
    total: z.number().min(0),
    status: OrderStatusEnum.default('COMPLETED'),
    items: z.array(OrderItemSchema).min(1),
    payments: z.array(PaymentSchema).min(1),
});

// --- INFER TYPES ---
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Supplier = z.infer<typeof SupplierSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type CashRegister = z.infer<typeof CashRegisterSchema>;
export type CashSession = z.infer<typeof CashSessionSchema>;
export type CashMovement = z.infer<typeof CashMovementSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
