import { DollarSign, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';
import { KPIData } from '../../actions/reports';

export function KPICards({ data }: { data: KPIData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <DollarSign className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-neutral-400 font-medium mb-1">Ventas Hoy</p>
                    <h3 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                        ${data.totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShoppingBag className="w-16 h-16 text-blue-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-neutral-400 font-medium mb-1">Pedidos Hoy</p>
                    <h3 className="text-3xl font-bold text-white text-blue-100">
                        {data.totalOrders}
                    </h3>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-16 h-16 text-purple-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-neutral-400 font-medium mb-1">Ticket Promedio</p>
                    <h3 className="text-3xl font-bold text-white text-purple-100">
                        ${data.averageTicket.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>
        </div>
    );
}
