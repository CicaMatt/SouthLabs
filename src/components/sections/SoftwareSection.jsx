import SectionHeader from '../SectionHeader';
import SOLUTION_CARD_SURFACE_CLASS, { getSolutionCardSurfaceStyle } from './solutionCardSurface';
import {
  SOFTWARE_SECTION_THEME_COLOR,
  SOFTWARE_SECTION_THEME_RGB_CSS
} from '../../hooks/sectionGrid/constants';

const SOFTWARE_CARD_SURFACE_OPACITY = 0.25;
const SOFTWARE_CARD_SURFACE_HOVER_OPACITY = 0.7;
const SOFTWARE_FEATURE_CARD_SURFACE_OPACITY = 1;
const SOFTWARE_FEATURE_CARD_SURFACE_HOVER_OPACITY = 1;
const SOFTWARE_SECTION_GRID_OPACITY = 0.075;

const AUTOMATION_CARDS = [
  {
    icon: 'terminal',
    title: 'Software Personalizzati',
    description: 'Sviluppo di software ad-hoc per soddisfare qualsiasi esigenza operativa.',
    surfaceOpacity: SOFTWARE_CARD_SURFACE_OPACITY,
    surfaceHoverOpacity: SOFTWARE_CARD_SURFACE_HOVER_OPACITY
  },
  {
    icon: 'api',
    title: 'Integrazione con Sistemi Legacy',
    description: 'Aggiornamento e manutenzione di sistemi preesistenti.',
    surfaceOpacity: SOFTWARE_CARD_SURFACE_OPACITY,
    surfaceHoverOpacity: SOFTWARE_CARD_SURFACE_HOVER_OPACITY
  },
  {
    icon: 'router',
    title: 'Domotica',
    description: 'Controllo centralizzato dei tuoi dispositivi aziendali.',
    surfaceOpacity: SOFTWARE_CARD_SURFACE_OPACITY,
    surfaceHoverOpacity: SOFTWARE_CARD_SURFACE_HOVER_OPACITY
  },
  {
    icon: 'schema',
    title: 'Digitalizzazione Processi',
    description: 'Transizione verso processi digitali veloci e moderni.',
    surfaceOpacity: SOFTWARE_CARD_SURFACE_OPACITY,
    surfaceHoverOpacity: SOFTWARE_CARD_SURFACE_HOVER_OPACITY
  }
];

const SECTION_CLASS = 'section-grid-bg section-grid-bg--software py-[5.5rem] lg:py-[6.75rem] relative';
const SECTION_CONTENT_CLASS = 'max-w-7xl mx-auto px-5 sm:px-6 md:px-8 relative z-10';
const SERVICE_GRID_CLASS = 'software-service-grid grid grid-cols-1 md:grid-cols-2 gap-6';
const SOFTWARE_CARD_SURFACE_CLASS = `${SOLUTION_CARD_SURFACE_CLASS} software-card-surface`;
const FEATURE_CARD_CLASS = [
  'software-ai-feature-card card-grid-anchor isolate',
  'group col-span-1 md:col-span-2 row-span-2 flex h-full flex-col justify-center',
  'relative p-8 text-on-primary',
  SOFTWARE_CARD_SURFACE_CLASS
].join(' ');
const FEATURE_BACKGROUND_ICON_CLASS = [
  'software-ai-background-icon absolute bottom-0 right-0 z-[2] p-2 opacity-10 transition-[opacity,transform] duration-300 group-hover:opacity-25 group-hover:scale-105',
  'md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:p-6',
  'lg:top-auto lg:bottom-0 lg:translate-y-0 lg:p-2'
].join(' ');
const AUTOMATION_CARD_CLASS = [
  'group relative flex h-full flex-col p-6',
  SOFTWARE_CARD_SURFACE_CLASS
].join(' ');
const SOFTWARE_FEATURE_CARD_SURFACE_STYLE = getSolutionCardSurfaceStyle(
  SOFTWARE_FEATURE_CARD_SURFACE_OPACITY,
  SOFTWARE_FEATURE_CARD_SURFACE_HOVER_OPACITY
);
const SOFTWARE_SECTION_STYLE = {
  '--section-grid-color': `rgba(${SOFTWARE_SECTION_THEME_RGB_CSS}, ${SOFTWARE_SECTION_GRID_OPACITY})`,
  '--section-grid-highlight-color': SOFTWARE_SECTION_THEME_COLOR,
  '--section-grid-burst-rgb': SOFTWARE_SECTION_THEME_RGB_CSS,
  '--software-ai-accent': SOFTWARE_SECTION_THEME_COLOR,
  '--software-interaction-blue': SOFTWARE_SECTION_THEME_COLOR,
  '--software-interaction-blue-rgb': SOFTWARE_SECTION_THEME_RGB_CSS
};

function AutomationCard({ description, icon, surfaceHoverOpacity, surfaceOpacity, title }) {
  return (
    <div
      className={AUTOMATION_CARD_CLASS}
      style={getSolutionCardSurfaceStyle(surfaceOpacity, surfaceHoverOpacity)}
    >
      <span className="material-symbols-outlined mb-4 inline-flex h-7 w-7 origin-center items-center justify-center text-[28px] leading-none text-secondary transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--software-ai-accent)]">{icon}</span>
      <h4 className="mb-2 min-h-[3rem] font-headline text-lg font-bold leading-snug text-on-background">{title}</h4>
      <p className="font-body text-sm leading-relaxed text-on-surface-variant">{description}</p>
    </div>
  );
}

function SoftwareAiFeatureCard() {
  return (
    <div className={FEATURE_CARD_CLASS} style={SOFTWARE_FEATURE_CARD_SURFACE_STYLE}>
      <span aria-hidden="true" className="software-ai-grid-highlight" />
      <span aria-hidden="true" className="software-ai-grid-burst" />
      <div className={FEATURE_BACKGROUND_ICON_CLASS}>
        <span className="material-symbols-outlined text-[76px] leading-none text-[var(--software-ai-accent)] md:text-[108px] lg:text-[120px]">smart_toy</span>
      </div>
      <div className="software-ai-chip absolute top-8 left-8 z-10 hidden h-12 w-12 items-center justify-center rounded-lg bg-surface-container/[0.06] backdrop-blur-sm lg:flex">
        <span className="material-symbols-outlined text-[var(--software-ai-accent)]">memory</span>
      </div>
      <h3 className="relative z-10 font-headline text-2xl font-bold mb-4">Intelligenza Artificiale</h3>
      <p className="relative z-10 font-body text-on-primary-container mb-8 max-w-sm">
        Sviluppo di modelli di intelligenza artificiale per analisi predittiva, automazione del customer service, ottimizzazione dei flussi di lavoro, e tanto altro.
      </p>
      <a className="software-ai-link relative z-10 inline-flex w-fit items-center rounded-md font-medium transition-all duration-200 hover:translate-x-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 lg:absolute lg:bottom-[4.25rem] lg:left-8 lg:translate-y-1/2 lg:hover:translate-x-1 lg:hover:translate-y-1/2" href="#contatti">
        Esplora AI
        <span className="material-symbols-outlined ml-1 text-sm transition-transform duration-200 group-hover:translate-x-0.5">arrow_forward</span>
      </a>
    </div>
  );
}

export default function SoftwareSection() {
  return (
    <section className={SECTION_CLASS} id="software-automazione" style={SOFTWARE_SECTION_STYLE}>
      <div className={SECTION_CONTENT_CLASS}>
        <SectionHeader
          className="mb-12 max-w-3xl lg:mb-16"
          title="Software e Automazione"
          subtitle="Sistemi progettati per digitalizzare e ottimizzare i processi aziendali."
        />

        <div className={SERVICE_GRID_CLASS}>
          <SoftwareAiFeatureCard />

          {AUTOMATION_CARDS.map((card) => (
            <AutomationCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
