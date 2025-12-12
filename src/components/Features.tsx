'use client';
import React from 'react';
import { Feature } from '../types';
import { Zap, Shield, Smartphone, Globe, Layers, BarChart } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features: Feature[] = [
    {
      id: '1',
      title: t.features.items['1'].title,
      description: t.features.items['1'].description,
      icon: <Layers className="w-6 h-6" />,
    },
    {
      id: '2',
      title: t.features.items['2'].title,
      description: t.features.items['2'].description,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: '3',
      title: t.features.items['3'].title,
      description: t.features.items['3'].description,
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      id: '4',
      title: t.features.items['4'].title,
      description: t.features.items['4'].description,
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: '5',
      title: t.features.items['5'].title,
      description: t.features.items['5'].description,
      icon: <Globe className="w-6 h-6" />,
    },
    {
      id: '6',
      title: t.features.items['6'].title,
      description: t.features.items['6'].description,
      icon: <BarChart className="w-6 h-6" />,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">{t.features.sectionTitle}</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t.features.mainTitle}
          </p>
          <p className="mt-4 text-xl text-gray-500">
            {t.features.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="inline-flex items-center justify-center p-3 bg-white text-primary-600 rounded-xl shadow-sm border border-gray-100 mb-5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;