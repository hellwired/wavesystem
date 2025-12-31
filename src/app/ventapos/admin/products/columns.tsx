'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Product } from './types';
import { ArrowUpDown, AlertCircle, CheckCircle2, XCircle, Pencil, Trash2, Copy } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// Helper for formatting currency
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

export const columns: ColumnDef<Product>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onChange={(e) => row.toggleSelected(!!e.target.checked)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hover:bg-neutral-800 hover:text-emerald-400 p-0"
                >
                    Producto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-neutral-200">{product.description}</span>
                    <div className="flex gap-2 text-xs text-neutral-500">
                        <span>{product.code || 'S/C'}</span>
                        {product.barcode && <span className="font-mono bg-neutral-900 px-1 rounded">{product.barcode}</span>}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'costPrice',
        header: 'Costo',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('costPrice'));
            return (
                <div className="flex items-center gap-1">
                    <span className="text-neutral-500 text-xs">$</span>
                    <input
                        type="number"
                        defaultValue={amount.toFixed(2)}
                        className="w-20 bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-emerald-500 focus:outline-none text-right font-mono text-sm text-neutral-300 transition-colors"
                        onBlur={(e) => console.log('Update Cost:', row.original.id, e.target.value)}
                    />
                </div>
            );
        },
    },
    {
        id: 'markup',
        header: 'Margen %',
        cell: ({ row }) => {
            const cost = row.original.costPrice;
            const price = row.original.salePrice;
            const markup = cost > 0 ? ((price / cost) - 1) * 100 : 0;

            return (
                <div className="flex items-center gap-1 group">
                    <input
                        type="number"
                        defaultValue={markup.toFixed(2)}
                        className="w-16 bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-emerald-500 focus:outline-none text-right font-mono text-sm text-blue-400 group-hover:text-blue-300 transition-colors"
                        onBlur={(e) => console.log('Update Markup:', row.original.id, e.target.value)}
                    />
                    <span className="text-neutral-600 text-xs">%</span>
                </div>
            )
        }
    },
    {
        accessorKey: 'salePrice',
        header: 'Precio Venta',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('salePrice'));
            return (
                <div className="flex items-center gap-1">
                    <span className="text-neutral-500 text-xs">$</span>
                    <input
                        type="number"
                        defaultValue={amount.toFixed(2)}
                        className="w-24 bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-emerald-500 focus:outline-none text-right font-mono font-bold text-emerald-400 transition-colors"
                        onBlur={(e) => console.log('Update Price:', row.original.id, e.target.value)}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
            const stock = parseFloat(row.getValue('stock'));
            const min = row.original.minStockAlert || 5;

            let colorClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"; // OK
            let icon = <CheckCircle2 className="w-3 h-3" />;

            if (stock <= 0) {
                colorClass = "bg-red-500/20 text-red-400 border-red-500/30"; // Critical
                icon = <XCircle className="w-3 h-3" />;
            } else if (stock <= min) {
                colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"; // Warning
                icon = <AlertCircle className="w-3 h-3" />;
            }

            return (
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${colorClass} text-xs font-medium`}>
                        {icon}
                        <input
                            type="number"
                            defaultValue={stock}
                            className="w-10 bg-transparent text-center focus:outline-none focus:underline"
                            onBlur={(e) => console.log('Update Stock:', row.original.id, e.target.value)}
                        />
                    </div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" title="Copiar" onClick={() => navigator.clipboard.writeText(product.code || '')}>
                        <Copy className="h-4 w-4 text-neutral-500" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Editar">
                        <Pencil className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Desactivar">
                        <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                </div>
            );
        },
    },
];
