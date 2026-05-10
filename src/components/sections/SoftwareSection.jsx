import SectionHeader from '../SectionHeader';

// Secondary automation offers rendered as compact cards beside the AI feature card.
const AUTOMATION_CARDS = [
  {
    icon: 'terminal',
    title: 'Software Personalizzati',
    description: 'Sviluppo di software ad-hoc per soddisfare qualsiasi esigenza operativa.'
  },
  {
    icon: 'api',
    title: 'Integrazione con Sistemi Legacy',
    description: 'Aggiornamento e manutenzione di sistemi preesistenti.'
  },
  {
    icon: 'router',
    title: 'Domotica',
    description: 'Controllo centralizzato dei tuoi dispositivi aziendali.'
  },
  {
    icon: 'schema',
    title: 'Digitalizzazione Processi',
    description: 'Transizione verso processi digitali veloci e moderni.'
  }
];

const SECTION_CLASS = 'py-20 lg:py-24 bg-surface-container-low relative';
const SECTION_CONTENT_CLASS = 'max-w-7xl mx-auto px-5 sm:px-6 md:px-8 relative z-10';
const SERVICE_GRID_CLASS = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
const FEATURE_CARD_CLASS = [
  'group col-span-1 md:col-span-2 row-span-2 flex h-full flex-col justify-center',
  'bg-primary text-on-primary rounded-xl border-[3px] border-transparent p-8',
  'shadow-[0_8px_40px_rgba(19,27,46,0.08)] transition-colors duration-150',
  'relative overflow-hidden hover:border-tertiary-fixed-dim'
].join(' ');
const FEATURE_BACKGROUND_ICON_CLASS = [
  'absolute bottom-0 right-0 p-2 opacity-10 transition-opacity duration-150 group-hover:opacity-25',
  'md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:p-6',
  'lg:top-auto lg:bottom-0 lg:translate-y-0 lg:p-2'
].join(' ');
const AUTOMATION_CARD_CLASS = [
  'flex h-full flex-col bg-surface-container-lowest rounded-xl p-6',
  'shadow-[inset_0_4px_0_0_#222a3e,0_4px_20px_rgba(19,27,46,0.04)]',
  'transition-shadow duration-300 hover:shadow-[inset_0_0_0_4px_#222a3e,0_4px_20px_rgba(19,27,46,0.04)]'
].join(' ');

// Compact card used for each non-feature automation service.
function AutomationCard({ description, icon, title }) {
  return (
    <div className={AUTOMATION_CARD_CLASS}>
      <span className="material-symbols-outlined text-secondary mb-4 text-[28px]">{icon}</span>
      <h4 className="mb-2 min-h-[3rem] font-headline font-bold leading-snug text-on-background">{title}</h4>
      <p className="font-body text-sm leading-relaxed text-on-surface-variant">{description}</p>
    </div>
  );
}

// Software and automation section with one highlighted AI offer plus supporting cards.
export default function SoftwareSection() {
  return (
    <section className={SECTION_CLASS} id="software-automazione">
      <div className={SECTION_CONTENT_CLASS}>
        <SectionHeader
          className="mb-12 max-w-3xl lg:mb-16"
          title="Software e Automazione"
          subtitle="Sistemi progettati per digitalizzare e ottimizzare i processi aziendali."
        />

        <div className={SERVICE_GRID_CLASS}>
          <div className={FEATURE_CARD_CLASS}>
            <div className={FEATURE_BACKGROUND_ICON_CLASS}>
              <span className="material-symbols-outlined text-[76px] leading-none md:text-[108px] lg:text-[120px] transition-colors duration-150 group-hover:text-tertiary-fixed-dim">smart_toy</span>
            </div>
            <div className="absolute top-8 left-8 hidden h-12 w-12 items-center justify-center rounded-lg bg-surface-container/20 backdrop-blur-sm lg:flex">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">memory</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4">Sistemi di Intelligenza Artificiale</h3>
            <p className="font-body text-on-primary-container mb-8 max-w-sm">
              Sviluppo di modelli di intelligenza artificiale per analisi predittiva, automazione del customer service e ottimizzazione dei flussi di lavoro.
            </p>
            <a className="inline-flex items-center text-tertiary-fixed-dim font-medium hover:text-white transition-colors lg:absolute lg:bottom-[4.25rem] lg:left-8 lg:translate-y-1/2" href="#contatti">
              Esplora AI
              <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
            </a>
          </div>

          {AUTOMATION_CARDS.map((card) => (
            <AutomationCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
