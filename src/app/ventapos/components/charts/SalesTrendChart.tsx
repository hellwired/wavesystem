'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailySales } from '../../actions/reports';

export function SalesTrendChart({ data }: { data: DailySales[] }) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-neutral-500">No hay datos de ventas recientes.</div>;
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                        dataKey="date"
                        stroke="#888"
                        tick={{ fill: '#888' }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis
                        stroke="#888"
                        tick={{ fill: '#888' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', color: '#fff' }}
                        itemStyle={{ color: '#10b981' }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Ventas']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
