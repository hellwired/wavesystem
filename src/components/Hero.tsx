'use client';
import React from 'react';
import Button from './Button';
import { ButtonVariant } from '../types';
import WaveVisual from './WaveVisual';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-primary-900 overflow-hidden min-h-screen flex items-center">
      {/* Abstract Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/next/images/hero-bg.png"
          alt="Abstract technology background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Increased opacity for better text contrast */}
        <div className="absolute inset-0 bg-gray-950/75" />
      </div>

      {/* D3 Wave Visual Overlay */}
      <div className="absolute inset-0 z-0 bottom-0 top-1/4 opacity-40">
        <WaveVisual />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center md:text-left">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-800/80 border border-primary-700/50 text-white text-sm font-medium backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              {t.hero.badge}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
              {t.hero.title.part1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-md">
                {t.hero.title.part2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-100 max-w-2xl leading-relaxed drop-shadow-md font-medium">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant={ButtonVariant.PRIMARY} className="gap-2">
                {t.hero.ctaPrimary} <ArrowRight size={18} />
              </Button>
              <Button
                variant={ButtonVariant.OUTLINE}
                className="!bg-transparent !text-white !border-white/20 hover:!bg-white/10 gap-2"
                onClick={() => window.open('https://wavesystem.online/articulosdelsur/index.php', '_blank')}
              >
                <PlayCircle size={18} /> {t.hero.ctaSecondary}
              </Button>
            </div>

            <div className="pt-8 border-t border-white/10 flex items-center gap-8 text-gray-400 text-sm font-medium">
              <span>{t.hero.trustedBy}</span>
              <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                {/* Simulated Logos */}
                <div className="h-6 w-20 bg-white/20 rounded"></div>
                <div className="h-6 w-20 bg-white/20 rounded"></div>
                <div className="h-6 w-20 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative">
            {/* Abstract Dashboard Graphic */}
            {/* Ecommerce Dashboard Graphic */}
            <div className="relative rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 group">
              <div className="absolute top-0 w-full h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2 z-10 transition-colors group-hover:bg-gray-750">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 h-4 w-60 bg-gray-700 rounded-full opacity-50 text-[10px] text-gray-400 flex items-center px-2 font-mono">wavesystem.online/shop</div>
              </div>
              <div className="relative aspect-[4/3] w-full bg-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                  alt="Ecommerce Dashboard Interface"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-primary-900/10 mix-blend-overlay pointer-events-none"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;