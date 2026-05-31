import SectionHeader from '../SectionHeader';
import SectionShell from '../SectionShell';
import SOLUTION_CARD_SURFACE_CLASS, {
  getLightSolutionCardSurfaceStyle,
  getSolutionCardSurfaceStyle
} from './solutionCardSurface';

const SOFTWARE_CARD_SURFACE_OPACITY = 0.25;
const SOFTWARE_CARD_SURFACE_HOVER_OPACITY = 0.7;
const SOFTWARE_FEATURE_CARD_SURFACE_OPACITY = 1;
const SOFTWARE_FEATURE_CARD_SURFACE_HOVER_OPACITY = 1;

const AUTOMATION_CARDS = [
  {
    icon: 'terminal',
    title: 'Software su Misura',
    description:
      'Costruiamo soluzioni personalizzate per potenziare e rendere efficienti i tuoi processi di lavoro.'
  },
  {
    icon: 'api',
    title: 'Sistemi Legacy',
    description:
      'Modernizziamo e manuteniamo i tuoi vecchi sistemi, per aumentarne efficienza e usabilità.'
  },
  {
    icon: 'router',
    title: 'Domotica',
    description:
      'Installazione di dispositivi domotici per rendere i tuoi spazi più moderni e interconnessi.'
  },
  {
    icon: 'schema',
    title: 'Digitalizzazione Processi',
    description: 'Trasformiamo la complessità in processi digitali lineari ed efficienti.'
  }
];

const SERVICE_GRID_CLASS = 'software-service-grid grid grid-cols-1 md:grid-cols-2 gap-6';
const SOFTWARE_CARD_SURFACE_CLASS = `${SOLUTION_CARD_SURFACE_CLASS} software-card-surface`;
const FEATURE_CARD_CLASS = [
  'software-ai-feature-card card-grid-anchor isolate',
  'group col-span-1 md:col-span-2 row-span-2 flex h-full flex-col',
  'relative p-8 text-on-primary',
  SOFTWARE_CARD_SURFACE_CLASS
].join(' ');
const AUTOMATION_CARD_CLASS = [
  'group relative flex h-full flex-col p-6',
  SOFTWARE_CARD_SURFACE_CLASS
].join(' ');
const SOFTWARE_FEATURE_CARD_SURFACE_STYLE = getSolutionCardSurfaceStyle(
  SOFTWARE_FEATURE_CARD_SURFACE_OPACITY,
  SOFTWARE_FEATURE_CARD_SURFACE_HOVER_OPACITY
);
const SOFTWARE_AUTOMATION_CARD_SURFACE_STYLE = getLightSolutionCardSurfaceStyle(
  SOFTWARE_CARD_SURFACE_OPACITY,
  SOFTWARE_CARD_SURFACE_HOVER_OPACITY
);

function AutomationCard({ description, icon, title }) {
  return (
    <div className={AUTOMATION_CARD_CLASS} style={SOFTWARE_AUTOMATION_CARD_SURFACE_STYLE}>
      <span className="material-symbols-outlined mb-4 inline-flex h-7 w-7 origin-center items-center justify-center text-[28px] leading-none text-[var(--software-support-blue)] transition-all duration-300 group-hover:scale-110">
        {icon}
      </span>
      <h4 className="mb-2 min-h-[3rem] font-headline text-lg font-bold leading-snug text-on-background">
        {title}
      </h4>
      <p className="font-body text-sm leading-relaxed text-on-surface-variant">{description}</p>
    </div>
  );
}

function SoftwareAiFeatureCard() {
  return (
    <div className={FEATURE_CARD_CLASS} style={SOFTWARE_FEATURE_CARD_SURFACE_STYLE}>
      <span aria-hidden="true" className="software-ai-grid-highlight" />
      <span className="material-symbols-outlined relative z-10 mb-4 inline-flex h-7 w-7 origin-center items-center justify-center text-[28px] leading-none text-[var(--software-ai-accent)] transition-all duration-300 group-hover:scale-110">
        memory
      </span>
      <h3 className="relative z-10 font-headline text-2xl font-bold mb-4">
        Intelligenza Artificiale
      </h3>
      <p className="relative z-10 font-body text-on-primary-container mb-8 lg:max-w-sm">
        Sistemi intelligenti e algoritmi predittivi per automatizzare i flussi operativi, azzerare
        le inefficienze, effettuare previsioni e anticipare i trend del mercato.
      </p>
      <a
        className="software-ai-link relative z-10 inline-flex w-fit items-center rounded-md font-medium transition-all duration-200 hover:translate-x-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 lg:absolute lg:bottom-[4.25rem] lg:left-8 lg:translate-y-1/2 lg:hover:translate-x-1 lg:hover:translate-y-1/2"
        href="#contatti"
      >
        Scopri cosa puoi fare con l'AI
        <span className="material-symbols-outlined ml-1 text-sm transition-transform duration-200 group-hover:translate-x-0.5">
          arrow_forward
        </span>
      </a>
    </div>
  );
}

export default function SoftwareSection() {
  return (
    <SectionShell id="software-automazione" variant="software">
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
    </SectionShell>
  );
}
