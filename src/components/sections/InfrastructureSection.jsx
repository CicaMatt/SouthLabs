import { infrastructureCards } from '../../data/content';

export default function InfrastructureSection() {
  return (
    <section className="py-24 bg-surface" id="infrastruttura">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-surface-container-high pb-8 border-transparent">
          <div className="max-w-2xl">
            <h2 className="font-headline text-3xl md:text-4xl tracking-tight text-on-background mb-4">Infrastruttura Hardware</h2>
            <p className="font-body text-on-surface-variant">
              Le fondamenta fisiche e virtuali per garantire continuità operativa e sicurezza dei dati.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infrastructureCards.map((card) => (
            <div key={card.title} className="group">
              <div className="h-48 rounded-xl bg-surface-container-high mb-6 overflow-hidden">
                <img
                  alt={card.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt={card.dataAlt}
                  src={card.src}
                />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-background mb-2">{card.title}</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
