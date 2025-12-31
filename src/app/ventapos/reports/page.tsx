import Link from 'next/link';
import {
    getSalesLast7Days,
    getTopProducts,
    getTodaysKPIs
} from '../actions/reports';
import { SalesTrendChart } from '../components/charts/SalesTrendChart';
import { TopProductsChart } from '../components/charts/TopProductsChart';
import { KPICards } from '../components/charts/KPICards';
import { Calendar } from 'lucide-react';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    // Parallel data fetching
    const [salesRes, productsRes, kpisRes] = await Promise.all([
        getSalesLast7Days(),
        getTopProducts(),
        getTodaysKPIs()
    ]);

    const salesData = salesRes.success ? salesRes.data! : [];
    const topProducts = productsRes.success ? productsRes.data! : [];
    const kpis = kpisRes.success ? kpisRes.data! : { totalRevenue: 0, totalOrders: 0, averageTicket: 0 };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
            <div className="container mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/ventapos/dashboard" className="text-neutral-500 hover:text-emerald-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </Link>
                            <span className="text-sm font-medium text-emerald-500 uppercase tracking-wider">Analytics</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Reportes de Venta</h1>
                    </div>

                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-neutral-400">
                        <Calendar className="w-4 h-4" />
                        <span>Últimos 7 días</span>
                    </div>
                </div>

                {/* KPI Cards */}
                <KPICards data={kpis} />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Trend */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Tendencia de Ingresos</h3>
                        <SalesTrendChart data={salesData} />
                    </div>

                    {/* Top Products */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Productos Más Vendidos</h3>
                        <TopProductsChart data={topProducts} />
                    </div>
                </div>
            </div>
        </div>
    );
}
