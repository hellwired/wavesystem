import { NavItem, Feature } from '../types';

export type Language = 'es' | 'en';

export interface Translations {
  nav: {
    items: Record<string, string>; // key: label key (e.g. 'features') -> translated label
    getStarted: string;
  };
  hero: {
    badge: string;
    title: {
      part1: string;
      part2: string;
    };
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustedBy: string;
  };
  features: {
    sectionTitle: string;
    mainTitle: string;
    description: string;
    items: Record<string, { title: string; description: string }>;
  };
  footer: {
    description: string;
    columns: {
      product: string;
      resources: string;
      company: string;
    };
    links: {
      features: string;
      integrations: string;
      pricing: string;
      changelog: string;
      docs: string;
      api: string;
      community: string;
      migration: string;
      about: string;
      blog: string;
      careers: string;
      legal: string;
      privacy: string;
      terms: string;
    };
    rights: string;
  };
  page: {
    migration: {
      title: string;
      phase1: { label: string; status: string };
      phase2: { label: string; status: string };
      phase3: { label: string; status: string };
      phase4: { label: string; status: string };
    };
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      items: {
        features: 'Características',
        technology: 'Tecnología',
        testimonials: 'Testimonios',
        pricing: 'Precios',
      },
      getStarted: 'Comenzar',
    },
    hero: {
      badge: 'WaveSystem v2.0 Próximamente',
      title: {
        part1: 'Tu negocio en la',
        part2: 'cresta de la tecnología',
      },
      description: 'Emigra del caos heredado a una eficiencia optimizada. WaveSystem proporciona la infraestructura para arquitecturas web escalables, atómicas y de alto rendimiento.',
      ctaPrimary: 'Iniciar Migración',
      ctaSecondary: 'Ver Demo',
      trustedBy: 'Con la confianza de gigantes tecnológicos',
    },
    features: {
      sectionTitle: 'Capacidades Centrales',
      mainTitle: 'Todo lo que necesitas para construir más rápido',
      description: 'WaveSystem reemplaza las estructuras obsoletas con un conjunto moderno y cohesivo de herramientas diseñadas para el futuro del desarrollo web.',
      items: {
        '1': {
          title: 'Arquitectura Atómica',
          description: 'Construido sobre principios de diseño atómico, asegurando que cada componente sea reutilizable, escalable y consistente.',
        },
        '2': {
          title: 'Ultra Rápido',
          description: 'Optimizado para el rendimiento con estrategias de generación estática y carga diferida inteligente de activos.',
        },
        '3': {
          title: 'Mobile First',
          description: 'Diseñado desde cero para dispositivos móviles, asegurando una experiencia perfecta en cualquier tamaño de pantalla.',
        },
        '4': {
          title: 'Seguridad Empresarial',
          description: 'Protocolos de seguridad de grado bancario integrados directamente en el framework central.',
        },
        '5': {
          title: 'Escala Global',
          description: 'Despliega en cualquier lugar con capacidades de red edge adaptadas para máxima disponibilidad.',
        },
        '6': {
          title: 'Analíticas en Tiempo Real',
          description: 'Rastrea el uso, rendimiento y participación del usuario con nuestras herramientas de panel integradas.',
        },
      },
    },
    footer: {
      description: 'Empoderando a los desarrolladores para construir la próxima generación de aplicaciones web con precisión atómica y rendimiento fluido.',
      columns: {
        product: 'Producto',
        resources: 'Recursos',
        company: 'Compañía',
      },
      links: {
        features: 'Características',
        integrations: 'Integraciones',
        pricing: 'Precios',
        changelog: 'Registro de Cambios',
        docs: 'Documentación',
        api: 'Referencia API',
        community: 'Comunidad',
        migration: 'Guía de Migración',
        about: 'Acerca de',
        blog: 'Blog',
        careers: 'Carreras',
        legal: 'Legal',
        privacy: 'Política de Privacidad',
        terms: 'Términos de Servicio',
      },
      rights: 'Todos los derechos reservados.',
    },
    page: {
      migration: {
        title: 'Estado del Sistema: Migración Completa',
        phase1: { label: 'Fase 1: Configuración y Tailwind', status: 'HECHO' },
        phase2: { label: 'Fase 2: Arquitectura de Componentes Atómicos', status: 'HECHO' },
        phase3: { label: 'Fase 3: Optimización de Imágenes y Renderizado', status: 'HECHO' },
        phase4: { label: 'Fase 4: Accesibilidad y Cumplimiento WCAG', status: 'HECHO' },
      },
    },
  },
  en: {
    nav: {
      items: {
        features: 'Features',
        technology: 'Technology',
        testimonials: 'Testimonials',
        pricing: 'Pricing',
      },
      getStarted: 'Get Started',
    },
    hero: {
      badge: 'WaveSystem v2.0 Coming Soon',
      title: {
        part1: 'Your business at the',
        part2: 'crest of technology',
      },
      description: 'Migrate from legacy chaos to streamlined efficiency. WaveSystem provides the infrastructure for scalable, atomic, and performant web architectures.',
      ctaPrimary: 'Start Migration',
      ctaSecondary: 'Watch Demo',
      trustedBy: 'Trusted by tech giants',
    },
    features: {
      sectionTitle: 'Core Capabilities',
      mainTitle: 'Everything you need to build faster',
      description: 'WaveSystem replaces outdated legacy structures with a modern, cohesive set of tools designed for the future of web development.',
      items: {
        '1': {
          title: 'Atomic Architecture',
          description: 'Built on principles of atomic design, ensuring every component is reusable, scalable, and consistent.',
        },
        '2': {
          title: 'Lightning Fast',
          description: 'Optimized for performance with static generation strategies and intelligent lazy loading of assets.',
        },
        '3': {
          title: 'Mobile First',
          description: 'Designed from the ground up for mobile devices, ensuring a perfect experience on any screen size.',
        },
        '4': {
          title: 'Enterprise Security',
          description: 'Bank-grade security protocols integrated directly into the core framework.',
        },
        '5': {
          title: 'Global Scale',
          description: 'Deploy anywhere with edge network capabilities tailored for maximum availability.',
        },
        '6': {
          title: 'Real-time Analytics',
          description: 'Track usage, performance, and user engagement with our integrated dashboard tools.',
        },
      },
    },
    footer: {
      description: 'Empowering developers to build the next generation of web applications with atomic precision and fluid performance.',
      columns: {
        product: 'Product',
        resources: 'Resources',
        company: 'Company',
      },
      links: {
        features: 'Features',
        integrations: 'Integrations',
        pricing: 'Pricing',
        changelog: 'Changelog',
        docs: 'Documentation',
        api: 'API Reference',
        community: 'Community',
        migration: 'Migration Guide',
        about: 'About',
        blog: 'Blog',
        careers: 'Careers',
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      },
      rights: 'All rights reserved.',
    },
    page: {
      migration: {
        title: 'System Status: Migration Complete',
        phase1: { label: 'Phase 1: Setup & Tailwind Configuration', status: 'DONE' },
        phase2: { label: 'Phase 2: Atomic Component Architecture', status: 'DONE' },
        phase3: { label: 'Phase 3: Image & Rendering Optimization', status: 'DONE' },
        phase4: { label: 'Phase 4: Accessibility & WCAG Compliance', status: 'DONE' },
      },
    },
  },
};
