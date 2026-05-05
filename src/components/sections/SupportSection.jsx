// Checklist copy for ongoing support and enablement services.
const supportItems = [
  'Manutenzione preventiva e correttiva programmata.',
  "Sessioni di training per la formazione del personale.",
  'Supporto per eventi critici.'
];

// Support section pairing service promises with a call-to-action panel.
export default function SupportSection() {
  return (
    <section className="py-24 bg-tertiary text-on-tertiary" id="manutenzione-supporto">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1">
          <h2 className="font-headline text-3xl md:text-4xl tracking-tight mb-6">Supporto e Formazione</h2>
          <p className="font-body text-on-tertiary/80 text-lg mb-8 leading-relaxed">
            Il nostro impegno non termina con la consegna. Forniamo piani di assistenza mensile e formazione specifica per rendere il tuo team autonomo sull'utilizzo dei tuoi nuovi strumenti digitali.
          </p>
          <ul className="space-y-4">
            {supportItems.map((item) => (
              <li key={item} className="flex items-start">
                <span className="material-symbols-outlined text-tertiary-fixed-dim mr-3 mt-1">check_circle</span>
                <span className="font-body">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 w-full bg-surface-container-lowest/5 backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          <div className="text-center">
            <span className="material-symbols-outlined text-[64px] text-tertiary-fixed-dim mb-4">support_agent</span>
            <h3 className="font-headline text-2xl font-bold mb-2">Sempre al tuo fianco</h3>
            <p className="text-on-tertiary/70 mb-6">Piani flessibili progettati sulle reali necessità della tua infrastruttura.</p>
            <a
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 bg-tertiary-fixed text-on-tertiary-fixed hover:bg-white active:scale-95"
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
