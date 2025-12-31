'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { SlidersHorizontal, Plus, Search, Trash, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function ProductsDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 p-1">
                {/* Search & Filters */}
                <div className="flex items-center flex-1 gap-2">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                        <input
                            placeholder="Buscar productos..."
                            value={globalFilter ?? ''}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="w-full h-9 pl-9 pr-4 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Faceted Filter Mockups */}
                    <Button variant="outline" size="sm" className="h-9 border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white border-dashed">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                    </Button>
                </div>
            </div>

            {/* Bulk Actions Floating Bar */}
            {Object.keys(rowSelection).length > 0 && (
                <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-2 flex items-center justify-between animate-in slide-in-from-bottom-2 fade-in">
                    <span className="text-sm text-emerald-400 font-medium px-2">
                        {Object.keys(rowSelection).length} productos seleccionados
                    </span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20 h-8">
                            <DollarSign className="mr-2 h-3.5 w-3.5" /> Actualizar Precios
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-200 hover:bg-red-500/20 h-8">
                            <Trash className="mr-2 h-3.5 w-3.5" /> Desactivar
                        </Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-md border border-neutral-800 overflow-hidden">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b [&_tr]:border-neutral-800">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b transition-colors hover:bg-neutral-900/50 data-[state=selected]:bg-neutral-900">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id} className="h-10 px-4 text-left align-middle font-medium text-neutral-400 bg-neutral-950">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b border-neutral-800 transition-colors hover:bg-neutral-900/30 data-[state=selected]:bg-neutral-900/50 group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 align-middle">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="h-24 text-center text-neutral-500"
                                >
                                    No hay resultados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-neutral-500">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="border-neutral-800 bg-neutral-900 text-neutral-300"
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="border-neutral-800 bg-neutral-900 text-neutral-300"
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
