'use client';
import React from 'react';
import { Feature } from '../../types';
import { Zap, Shield, Smartphone, Globe, Layers, BarChart } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import Link from 'next/link';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features: Feature[] = [
    {
      id: '1',
      title: t.features.items['1'].title,
      description: t.features.items['1'].description,
      icon: <Layers className="w-12 h-12 stroke-[2]" />,
    },
    {
      id: '2',
      title: t.features.items['2'].title,
      description: t.features.items['2'].description,
      icon: <Zap className="w-12 h-12 stroke-[2]" />,
    },
    {
      id: '3',
      title: t.features.items['3'].title,
      description: t.features.items['3'].description,
      icon: <Smartphone className="w-12 h-12 stroke-[2]" />,
    },
    {
      id: '4',
      title: t.features.items['4'].title,
      description: t.features.items['4'].description,
      icon: <Shield className="w-12 h-12 stroke-[2]" />,
    },
    {
      id: '5',
      title: t.features.items['5'].title,
      description: t.features.items['5'].description,
      icon: <Globe className="w-12 h-12 stroke-[2]" />,
    },
    {
      id: '6',
      title: t.features.items['6'].title,
      description: t.features.items['6'].description,
      icon: <BarChart className="w-12 h-12 stroke-[2]" />,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">{t.features.sectionTitle}</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t.features.mainTitle}
          </p>
          <p className="mt-4 text-xl text-gray-600">
            {t.features.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature) => {
            const isInteractive = ['1', '2', '3', '4', '5', '6'].includes(feature.id);
            const linkHref =
              feature.id === '1' ? '/atomic-demo' :
                feature.id === '2' ? '/costs-demo' :
                  feature.id === '3' ? '/mobile-demo' :
                    feature.id === '4' ? '/security-demo' :
                      feature.id === '5' ? '/global-demo' :
                        feature.id === '6' ? '/analytics-demo' : '';

            const CardContent = (
              <div
                className={`group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isInteractive ? 'cursor-pointer ring-2 ring-transparent hover:ring-primary-100' : ''}`}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative mb-6">
                  {/* Rotating Border Container */}
                  <div className="relative inline-flex group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-primary-400 via-purple-500 to-primary-400 rounded-xl opacity-75 blur-sm group-hover:opacity-100 animate-gradient-xy"></div>
                    <div className="relative inline-flex items-center justify-center p-4 bg-white text-primary-600 rounded-xl ring-1 ring-gray-100">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {isInteractive && (
                  <div className="mt-6 flex items-center text-sm font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    Try Interactive Demo →
                  </div>
                )}
              </div>
            );

            return isInteractive ? (
              <Link href={linkHref} key={feature.id}>
                {CardContent}
              </Link>
            ) : (
              <div key={feature.id}>{CardContent}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;