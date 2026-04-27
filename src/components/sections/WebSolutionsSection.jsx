import SectionHeader from '../SectionHeader';

const webSolutionCards = [
  {
    icon: 'code_blocks',
    title: 'Web App Personalizzate',
    description:
      'Applicazioni personalizzate per il tuo business, per garantire efficienza, sicurezza e flessibilità nel tempo.'
  },
  {
    icon: 'web',
    title: 'Soluzioni WordPress',
    description: 'Siti vetrina ottimizzati per SEO e visibilità, veloci e gestibili in autonomia.'
  },
  {
    icon: 'shopping_cart',
    title: 'Piattaforme di E-commerce',
    description:
      'Piattaforme di vendita online sicure ed efficaci, integrabili con i più noti metodi di pagamento.'
  }
];

export default function WebSolutionsSection() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden" id="siti-web">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-6 h-64 w-64 rounded-full bg-primary-fixed/50 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-secondary-container/70 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative">
        <SectionHeader
          className="mb-16 max-w-2xl"
          title="Siti Web"
          subtitle="Progettate per la massima conversione della tua attività."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {webSolutionCards.map((card) => (
            <article
              key={card.title}
              className="group relative isolate overflow-hidden rounded-[1.75rem] border border-[#cfdbe6] bg-gradient-to-br from-[#ffffff] via-[#f8fbff] to-[#edf4fa] p-8 md:p-9 min-h-[240px] shadow-[0_14px_34px_rgba(6,35,51,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b7cbdb] hover:shadow-[0_24px_56px_rgba(6,35,51,0.16)]"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,214,255,0.10),transparent_52%),radial-gradient(circle_at_86%_6%,rgba(182,235,255,0.15),transparent_35%)]"
              />
              <span
                aria-hidden
                className="material-symbols-outlined absolute inset-0 z-0 m-auto h-fit w-fit text-[132px] leading-none text-[#4f7ea2]/[0.10] transition-all duration-300 group-hover:text-[#4f7ea2]/[0.16]"
              >
                {card.icon}
              </span>
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="font-headline text-[1.42rem] font-bold text-on-background mb-3">{card.title}</h3>
                <p className="font-body text-on-surface-variant flex-grow">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
