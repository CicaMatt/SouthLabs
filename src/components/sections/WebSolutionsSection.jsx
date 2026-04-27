import SectionHeader from '../SectionHeader';

const webSolutionCards = [
  {
    icon: 'code_blocks',
    title: 'Web App Personalizzate',
    description:
      'Applicazioni personalizzate per garantire efficienza, sicurezza e flessibilità nel tempo.'
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {webSolutionCards.map((card) => (
            <article
              key={card.title}
              className="group relative isolate flex min-h-[220px] flex-col overflow-hidden rounded-[1.75rem] border-2 border-[#8ea6ba] bg-gradient-to-br from-[#ffffff] via-[#f9fcff] to-[#eef5fb] p-8 md:p-9 shadow-[0_10px_28px_rgba(7,34,54,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6f8ea8] hover:shadow-[0_20px_45px_rgba(7,34,54,0.14)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#5fb8d7]/55 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#9ed8ef]/20 blur-3xl transition-transform duration-300 group-hover:scale-110"
              />
              <span
                aria-hidden
                className="material-symbols-outlined pointer-events-none absolute inset-0 z-0 m-auto h-fit w-fit text-[118px] leading-none text-[#3f6988]/[0.10] transition-all duration-300 group-hover:text-[#3f6988]/[0.16]"
              >
                {card.icon}
              </span>
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="mb-3 font-headline text-[1.4rem] font-bold leading-tight text-on-background">{card.title}</h3>
                <p className="flex-grow font-body text-[1.07rem] leading-relaxed text-on-surface-variant">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
