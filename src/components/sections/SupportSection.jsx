import SectionShell from '../SectionShell';
import { getSolutionCardSurfaceStyle } from './solutionCardSurface';

const SUPPORT_ITEMS = [
  'Manutenzione preventiva e correttiva programmata.',
  'Sessioni di training per la formazione del personale.',
  'Supporto per eventi critici.'
];

const SUPPORT_PANEL_SURFACE_OPACITY = 0.4;
const SUPPORT_PANEL_SURFACE_HOVER_OPACITY = 0.62;
const SECTION_HEADER_CLASS = 'mb-12 max-w-2xl lg:mb-8';
const SECTION_CONTENT_CLASS = 'flex flex-col md:flex-row gap-10 md:gap-16 items-center';
const CTA_PANEL_CLASS = [
  'solution-card-surface support-cta-panel relative isolate flex-1 w-full overflow-hidden rounded-xl',
  'border border-white/[0.09] p-8 shadow-[0_8px_38px_rgba(0,0,0,0.15)]'
].join(' ');
const CTA_PANEL_STYLE = getSolutionCardSurfaceStyle(
  SUPPORT_PANEL_SURFACE_OPACITY,
  SUPPORT_PANEL_SURFACE_HOVER_OPACITY,
  '36, 54, 84'
);

export default function SupportSection() {
  return (
    <SectionShell id="manutenzione-supporto" variant="support">
      <div className={SECTION_HEADER_CLASS}>
        <h2 className="font-headline text-3xl md:text-4xl tracking-tight mb-4">
          Supporto e Formazione
        </h2>
        <p className="font-body text-on-tertiary/80">
          Assistenza continua e formazione su misura per la tua autonomia operativa.
        </p>
      </div>

      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex-1">
          <p className="font-body text-white text-md lg:text-lg mb-8 leading-relaxed">
            Il nostro impegno non termina con la consegna. Forniamo piani di assistenza mensile e
            formazione specifica per rendere il tuo team autonomo sull&apos;utilizzo dei tuoi
            strumenti digitali.
          </p>
          <ul className="space-y-4">
            {SUPPORT_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0 text-[26px] leading-7 text-tertiary-fixed-dim">
                  check_circle
                </span>
                <span className="font-body text-md lg:text-lg leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={CTA_PANEL_CLASS} style={CTA_PANEL_STYLE}>
          <div className="text-center">
            <span className="material-symbols-outlined support-cta-icon text-tertiary-fixed-dim mb-4">
              support_agent
            </span>
            <h3 className="font-headline text-2xl font-bold mb-2">Sempre al tuo fianco</h3>
            <p className="text-on-tertiary/70 mb-6">
              Piani flessibili progettati sulle reali necessità della tua attività.
            </p>
            <a
              className="support-plans-cta inline-flex items-center justify-center w-full px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 bg-tertiary-fixed-dim text-on-tertiary-fixed hover:bg-white active:scale-95"
              href="#contatti"
            >
              <span className="cta-underline-label">Scopri i Piani</span>
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
