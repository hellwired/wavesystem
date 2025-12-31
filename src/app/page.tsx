'use client';

import React from 'react';
import Navbar from '../components/organisms/Navbar';
import Hero from '../components/organisms/Hero';
import Features from '../components/organisms/Features';
import Pricing from '../components/organisms/Pricing';
import Footer from '../components/organisms/Footer';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';

const MigrationStatus: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-primary-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.page.migration.title}</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600"><strong>{t.page.migration.phase1.label}</strong> <span className="text-green-700 text-xs ml-2">{t.page.migration.phase1.status}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600"><strong>{t.page.migration.phase2.label}</strong> <span className="text-green-700 text-xs ml-2">{t.page.migration.phase2.status}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600"><strong>{t.page.migration.phase3.label}</strong> <span className="text-green-700 text-xs ml-2">{t.page.migration.phase3.status}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600"><strong>{t.page.migration.phase4.label}</strong> <span className="text-green-700 text-xs ml-2">{t.page.migration.phase4.status}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
};

const PageContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
        {/* Migration Note Section */}
        <MigrationStatus />
      </main>
      <Footer />
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
};
export default Page;
