
import { getSession } from '@/app/actions/logistica';
import { getDriverCurrentRoute, updateStopStatus, startRoute } from '@/app/actions/tms';

export default async function ChoferPage() {
    const user = await getSession();
    if (!user) return <div>Acceso Denegado</div>;

    const activeRoute = await getDriverCurrentRoute(user.id);

    if (!activeRoute) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Mis Envíos</h1>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="text-6xl mb-4">🚚</div>
                    <p className="text-gray-600 text-lg">No tienes rutas asignadas en este momento.</p>
                    <p className="text-sm text-gray-400 mt-2">Espera a que el despachador te asigne una.</p>
                </div>
            </div>
        );
    }

    // Calculamos progreso
    const totalStops = activeRoute.stops!.length; // WE know stops is there from action
    const completedStops = activeRoute.stops!.filter((s: any) => s.estado === 'entregado' || s.estado === 'no_entregado').length;
    const progress = Math.round((completedStops / totalStops) * 100);

    // Find next pending stop
    const nextStop = activeRoute.stops!.find((s: any) => s.estado === 'pendiente');

    return (
        <div className="max-w-md mx-auto pb-20">
            {/* Header Sticky */}
            <div className="bg-slate-800 text-white p-4 sticky top-0 z-10 shadow-md">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl font-bold">Ruta #{activeRoute.id}</h1>
                    <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold text-slate-800 ${activeRoute.estado === 'en_curso' ? 'bg-green-400' : 'bg-yellow-400'}`}>
                        {activeRoute.estado}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-400 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                    <span>{completedStops} / {totalStops} Entregas</span>
                    <span>{progress}% Completo</span>
                </div>

                {activeRoute.estado === 'planificada' && (
                    <form action={startRoute.bind(null, activeRoute.id)} className="mt-4">
                        <button className="w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-600 transition-transform active:scale-95">
                            INICIAR RUTA 🚀
                        </button>
                    </form>
                )}
            </div>

            {/* Stop List */}
            <div className="p-4 space-y-4">
                {activeRoute.stops!.map((stop: any, index: number) => {
                    const isNext = nextStop && stop.id === nextStop.id;
                    const isCompleted = stop.estado === 'entregado' || stop.estado === 'no_entregado';

                    return (
                        <div key={stop.id} className={`
                            relative pl-8 pb-8 last:pb-0 border-l-2 
                            ${isCompleted ? 'border-green-500' : isNext ? 'border-blue-500' : 'border-gray-200'}
                        `}>
                            {/* Dot Indicator */}
                            <div className={`
                                absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
                                ${isCompleted ? 'bg-green-500 border-green-500' : isNext ? 'bg-white border-blue-500 animate-pulse' : 'bg-gray-200 border-gray-300'}
                            `}></div>

                            <div className={`
                                bg-white p-4 rounded-lg shadow-sm border
                                ${isNext ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-gray-100'}
                                ${isCompleted ? 'opacity-60 grayscale' : ''}
                            `}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-500 text-xs">PARADA {stop.secuencia}</span>
                                    <span className={`text-xs font-bold uppercase ${stop.estado === 'entregado' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {stop.estado}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800">{stop.cliente}</h3>
                                <p className="text-gray-600 mb-3">{stop.direccion}</p>

                                <div className="flex gap-2">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.direccion || '')}`}
                                        target="_blank"
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-center text-sm font-medium hover:bg-gray-200"
                                    >
                                        🗺️ Mapa
                                    </a>
                                    <a href="tel:12345678" className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-center text-sm font-medium hover:bg-gray-200">
                                        📞 Llamar
                                    </a>
                                </div>

                                {isNext && activeRoute.estado === 'en_curso' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                                        <form action={updateStopStatus.bind(null, stop.id, 'no_entregado', 'Cliente ausente')}>
                                            <button className="w-full py-3 rounded-lg border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-50">
                                                ❌ FALLIDO
                                            </button>
                                        </form>
                                        <form action={updateStopStatus.bind(null, stop.id, 'entregado', '')}>
                                            <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md">
                                                ✅ ENTREGADO
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Completion Message */}
            {progress === 100 && (
                <div className="p-4">
                    <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center font-bold">
                        🎉 ¡Ruta Completada!
                        <p className="text-sm font-normal mt-2">Regresa a base para finalizar.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
