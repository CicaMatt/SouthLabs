import { getSolutionCardSurfaceStyle } from './solutionCardSurface';

const SUPPORT_ITEMS = [
  'Manutenzione preventiva e correttiva programmata.',
  "Sessioni di training per la formazione del personale.",
  'Supporto per eventi critici.'
];

const SUPPORT_PANEL_SURFACE_OPACITY = 0.4;
const SUPPORT_PANEL_SURFACE_HOVER_OPACITY = 0.76;
const SECTION_CLASS = 'section-grid-bg section-grid-bg--support py-[5.5rem] lg:py-[6.75rem] text-on-tertiary';
const SECTION_CONTENT_CLASS = 'max-w-7xl mx-auto px-5 sm:px-6 md:px-8 flex flex-col md:flex-row gap-10 md:gap-16 items-center';
const CTA_PANEL_CLASS = [
  'solution-card-surface support-cta-panel relative isolate flex-1 w-full overflow-hidden rounded-xl',
  'border border-white/[0.09] p-8 shadow-[0_8px_38px_rgba(0,0,0,0.15)]'
].join(' ');
const CTA_PANEL_STYLE = getSolutionCardSurfaceStyle(
  SUPPORT_PANEL_SURFACE_OPACITY,
  SUPPORT_PANEL_SURFACE_HOVER_OPACITY,
  '40, 50, 75'
);

export default function SupportSection() {
  return (
    <section className={SECTION_CLASS} id="manutenzione-supporto">
      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex-1">
          <h2 className="font-headline text-3xl md:text-4xl tracking-tight mb-6">Supporto e Formazione</h2>
          <p className="font-body text-on-tertiary/80 text-lg mb-8 leading-relaxed">
            Il nostro impegno non termina con la consegna. Forniamo piani di assistenza mensile e formazione specifica per rendere il tuo team autonomo sull'utilizzo dei tuoi nuovi strumenti digitali.
          </p>
          <ul className="space-y-4">
            {SUPPORT_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0 text-[22px] leading-7 text-tertiary-fixed-dim">check_circle</span>
                <span className="font-body leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={CTA_PANEL_CLASS} style={CTA_PANEL_STYLE}>
          <div className="text-center">
            <span className="material-symbols-outlined text-[64px] text-tertiary-fixed-dim mb-4">support_agent</span>
            <h3 className="font-headline text-2xl font-bold mb-2">Sempre al tuo fianco</h3>
            <p className="text-on-tertiary/70 mb-6">Piani flessibili progettati sulle reali necessità della tua infrastruttura.</p>
            <a
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 bg-tertiary-fixed-dim text-on-tertiary-fixed hover:bg-white active:scale-95"
              href="#contatti"
            >
              Scopri i Piani
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
