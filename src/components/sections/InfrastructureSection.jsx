import SectionHeader from '../SectionHeader';
import deskImage from '../../../media/images/desk.png';
import serverImage from '../../../media/images/server.png';
import securityImage from '../../../media/images/security.png';

const INFRASTRUCTURE_CARDS = [
  {
    alt: 'Workstation',
    src: deskImage,
    title: 'PC e Workstation',
    description:
      'Assemblaggio di computer e installazione di postazioni, per qualsiasi esigenza operativa.'
  },
  {
    alt: 'Server',
    src: serverImage,
    title: 'Server Privati',
    description:
      'Per la gestione autonoma dei dati e dei processi della tua infrastruttura .'
  },
  {
    alt: 'Security',
    src: securityImage,
    title: 'Sicurezza Informatica',
    description:
      'Sistemi di backup e protezione, fisici e virtuali, per la salvaguardia del tuo business.'
  }
];

const SECTION_CLASS = 'section-grid-bg section-grid-bg--infrastructure py-[5.5rem] lg:py-[6.75rem]';
const SECTION_CONTENT_CLASS = 'max-w-7xl mx-auto px-5 sm:px-6 md:px-8';
const CARD_GRID_CLASS = 'grid grid-cols-1 md:grid-cols-3 gap-8';
const CARD_CLASS = 'infrastructure-image-card group';
const IMAGE_FRAME_CLASS = 'infrastructure-image-frame solution-card-surface card-grid-anchor isolate h-48 rounded-xl mb-6 overflow-hidden relative';
const IMAGE_CLASS = 'w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 opacity-85';
const CARD_TITLE_CLASS = 'font-headline text-xl font-bold text-on-background mb-2';
const CARD_DESCRIPTION_CLASS = 'font-body text-sm text-on-surface-variant leading-relaxed';

function InfrastructureCard({ alt, description, src, title }) {
  return (
    <div className={CARD_CLASS}>
      <div className={IMAGE_FRAME_CLASS}>
        <span aria-hidden="true" className="software-ai-grid-highlight" />
        <img
          alt={alt}
          className={IMAGE_CLASS}
          decoding="async"
          loading="lazy"
          src={src}
        />
      </div>
      <h3 className={CARD_TITLE_CLASS}>{title}</h3>
      <p className={CARD_DESCRIPTION_CLASS}>{description}</p>
    </div>
  );
}

export default function InfrastructureSection() {
  return (
    <section className={SECTION_CLASS} id="infrastrutture-hardware">
      <div className={SECTION_CONTENT_CLASS}>
        <SectionHeader
          className="mb-12 max-w-2xl lg:mb-16"
          title="Infrastruttura Hardware"
          subtitle="Le fondamenta fisiche e virtuali per garantire continuità operativa e sicurezza dei dati."
        />

        <div className={CARD_GRID_CLASS}>
          {INFRASTRUCTURE_CARDS.map((card) => (
            <InfrastructureCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
