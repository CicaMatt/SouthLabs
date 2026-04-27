import SectionHeader from '../SectionHeader';

const automationCards = [
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

export default function AutomationSection() {
  return (
    <section className="py-24 bg-surface-container-low relative" id="software-automazione">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <SectionHeader
          className="mb-16 max-w-3xl"
          title="Software e Automazione"
          subtitle="Sistemi progettati per digitalizzare e ottimizzare i processi aziendali."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2 row-span-2 bg-primary text-on-primary rounded-xl p-8 shadow-[0_8px_40px_rgba(19,27,46,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[120px]">smart_toy</span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-container/20 flex items-center justify-center mb-6 backdrop-blur-sm">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">memory</span>
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4">Sistemi di Intelligenza Artificiale</h3>
            <p className="font-body text-on-primary-container mb-8 max-w-sm">
              Sviluppo di modelli di intelligenza artificiale per analisi predittiva, automazione del customer service e ottimizzazione dei flussi di lavoro.
            </p>
            <a className="inline-flex items-center text-tertiary-fixed-dim font-medium hover:text-white transition-colors" href="#contatti">
              Esplora AI
              <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
            </a>
          </div>

          {automationCards.map((card) => (
            <div key={card.title} className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(19,27,46,0.04)]">
              <span className="material-symbols-outlined text-secondary mb-4 text-[28px]">{card.icon}</span>
              <h4 className="font-headline font-bold text-on-background mb-2">{card.title}</h4>
              <p className="font-body text-sm text-on-surface-variant">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
