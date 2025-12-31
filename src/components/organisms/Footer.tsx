'use client';
import React from 'react';
import { Waves, Twitter, Linkedin, Github } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-primary-600 rounded-lg">
                <Waves size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">WaveSystem</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">{t.footer.columns.product}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.features}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.integrations}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.pricing}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.changelog}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">{t.footer.columns.resources}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.docs}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.api}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.community}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.migration}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">{t.footer.columns.company}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.about}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.blog}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.careers}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">{t.footer.links.legal}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} WaveSystem Inc. {t.footer.rights}
          </p>
          <div className="flex space-x-6 text-sm text-gray-300">
            <a href="#" className="hover:text-gray-200">{t.footer.links.privacy}</a>
            <a href="#" className="hover:text-gray-200">{t.footer.links.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;