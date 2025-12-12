'use client';
import React, { useState, useEffect } from 'react';
import { NavItem, ButtonVariant } from '../types';
import Button from './Button';
import { Menu, X, Waves, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();

  const navItems: NavItem[] = [
    { label: t.nav.items.features, href: '#features' },
    { label: t.nav.items.technology, href: '#technology' },
    { label: t.nav.items.testimonials, href: '#testimonials' },
    { label: t.nav.items.pricing, href: '#pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className={`relative h-10 w-10 overflow-hidden rounded-lg ${isScrolled ? '' : 'bg-white/10'}`}>
              <img
                src="/next/images/logo.png"
                alt="WaveSystem Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              WaveSystem
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-100 hover:text-white'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA & Mobile Menu Button */}
          <div className="flex items-center gap-4">

            {/* Language Toggle (Desktop) */}
            <button
              onClick={toggleLanguage}
              className={`hidden md:flex items-center gap-1 text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-100 hover:text-white'
                }`}
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe size={16} />
              <span>{language === 'es' ? 'EN' : 'ES'}</span>
            </button>

            <div className="hidden md:block">
              <Button
                variant={isScrolled ? ButtonVariant.PRIMARY : ButtonVariant.OUTLINE}
                className={!isScrolled ? "bg-white/10 text-white border-white/20 hover:bg-white/20" : ""}
                style={{ padding: '0.5rem 1.25rem' }}
              >
                {t.nav.getStarted}
              </Button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-md ${isScrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {/* Language Toggle (Mobile) */}
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 flex items-center gap-2"
            >
              <Globe size={20} />
              <span>{language === 'es' ? 'English' : 'Español'}</span>
            </button>

            <div className="mt-4 px-3">
              <Button fullWidth variant={ButtonVariant.PRIMARY}>{t.nav.getStarted}</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;