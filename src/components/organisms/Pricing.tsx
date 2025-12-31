import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Planes de Desarrollo
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Soluciones de software a medida para escalar tu negocio
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Desarrollo a Medida</h3>
            <div className="text-gray-500 mb-4">Software personalizado</div>
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-bold text-blue-600">$150.000</span>
              <span className="text-gray-500">/mes (mínimo)</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Pago inicial único de <span className="font-semibold text-gray-900">$350.000</span>
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Primer versión en 20 días</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Implementación: 1-2 meses una vez acordado</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-gray-600">
                <span className="block font-medium text-gray-900">Soporte Técnico</span>
                <span className="text-sm">Lun-Vie: 8:00 - 18:00</span>
                <br />
                <span className="text-sm">Sáb: 8:00 - 12:30</span>
              </div>
            </li>
             <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Mantenimiento evolutivo</span>
            </li>
          </ul>

          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Comenzar Ahora
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
