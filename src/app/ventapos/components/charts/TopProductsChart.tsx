'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TopProduct } from '../../actions/reports';

export function TopProductsChart({ data }: { data: TopProduct[] }) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-neutral-500">No hay datos de productos.</div>;
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="description"
                        type="category"
                        width={150}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', color: '#fff' }}
                        cursor={{ fill: '#333', opacity: 0.4 }}
                        formatter={(value: any, name: any) => [
                            name === 'quantity' ? value : `$${Number(value).toFixed(2)}`,
                            name === 'quantity' ? 'Cantidad' : 'Ingresos'
                        ]}
                    />
                    <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index < 3 ? '#3b82f6' : '#1e3a8a'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
