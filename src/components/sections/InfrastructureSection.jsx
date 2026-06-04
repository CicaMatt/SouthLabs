import SectionHeader from '../ui/SectionHeader';
import SectionShell from '../ui/SectionShell';
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
      'Installazione e configurazione di server personali per una gestione autonoma e sicura di dati e processi.'
  },
  {
    alt: 'Security',
    src: securityImage,
    title: 'Sicurezza Informatica',
    description:
      'Sistemi di backup e protezione, fisici e virtuali, per la salvaguardia del tuo business.'
  }
];

const CARD_GRID_CLASS = 'grid grid-cols-1 md:grid-cols-3 gap-8';
const CARD_CLASS = 'infrastructure-image-card group';
const IMAGE_FRAME_CLASS =
  'infrastructure-image-frame solution-card-surface card-grid-anchor isolate h-48 rounded-xl mb-6 overflow-hidden relative';
const IMAGE_CLASS =
  'w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 opacity-85';
const CARD_TITLE_CLASS = 'font-headline text-xl font-bold text-on-background mb-2';
const CARD_DESCRIPTION_CLASS = 'font-body text-sm text-on-surface-variant leading-relaxed';

function InfrastructureCard({ alt, description, src, title }) {
  return (
    <div className={CARD_CLASS}>
      <div className={IMAGE_FRAME_CLASS}>
        <span aria-hidden="true" className="software-ai-grid-highlight">
          <span className="software-ai-grid-highlight-grid" />
        </span>
        <img alt={alt} className={IMAGE_CLASS} decoding="async" loading="lazy" src={src} />
      </div>
      <h3 className={CARD_TITLE_CLASS}>{title}</h3>
      <p className={CARD_DESCRIPTION_CLASS}>{description}</p>
    </div>
  );
}

export default function InfrastructureSection() {
  return (
    <SectionShell id="infrastrutture-hardware" variant="infrastructure">
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
    </SectionShell>
  );
}
