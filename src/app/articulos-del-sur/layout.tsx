import React from 'react';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'ArticulosDelSur | Tecnología y Hogar',
    description: 'Tu tienda de confianza para artículos del hogar y tecnología.',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function ArticulosDelSurLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.className} min-h-screen bg-gray-50 text-slate-900`}>
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-orange-500">ArticulosDelSur</h3>
                            <p className="text-gray-400">
                                Llevando la mejor tecnología y confort a tu hogar desde hace más de 20 años.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Inicio</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Productos</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Ofertas</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Contacto</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contacto</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>info@articulosdelsur.com</li>
                                <li>+54 11 1234-5678</li>
                                <li>Av. Siempre Viva 742</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} ArticulosDelSur. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
