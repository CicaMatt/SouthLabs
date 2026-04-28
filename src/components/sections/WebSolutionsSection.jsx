import SectionHeader from '../SectionHeader';
import wordpressLogo from '../../../media/icons/wordpress.png';
import customWebAppImage from '../../../media/images/custom_web_app.png';
import ecommerceImage from '../../../media/images/ecommerce.png';
import seoOrientedImage from '../../../media/images/seo_oriented.png';

const leftWebSolutionCards = [
  {
    icon: 'code_blocks',
    title: 'Web App Personalizzate',
    description:
      'Applicazioni personalizzate per garantire efficienza, sicurezza e flessibilità nel tempo.',
    previewImage: customWebAppImage
  },
  {
    icon: 'web',
    title: 'Soluzioni WordPress',
    description: 'Siti vetrina ottimizzati per SEO e visibilità, veloci e gestibili in autonomia.',
    previewImage: seoOrientedImage
  }
];

const rightWebSolutionCard = {
  icon: 'shopping_cart',
  title: 'Piattaforme di E-commerce',
  description:
    'Piattaforme di vendita online sicure ed efficaci, integrabili con i più noti metodi di pagamento.',
  previewImage: ecommerceImage
};

function CardOverlayIcon({ title, icon, placement = 'left' }) {
  const isWordpress = title === 'Soluzioni WordPress';
  const positionClass =
    placement === 'top-left'
      ? 'left-5 top-1/2 -translate-y-1/2'
      : placement === 'bottom-right'
        ? 'right-5 top-1/2 -translate-y-1/2'
      : placement === 'top-right'
        ? 'left-1/2 top-2 -translate-x-1/2'
        : 'left-5 top-1/2 -translate-y-1/2';

  return (
    <span className={`pointer-events-none absolute z-0 hidden lg:block ${positionClass}`}>
      {isWordpress ? (
        <img src={wordpressLogo} alt="" aria-hidden className="h-44 w-44 object-contain opacity-[0.08]" />
      ) : (
        <span className="material-symbols-outlined fill text-[200px] leading-none text-[#2f5a75] opacity-[0.07]">{icon}</span>
      )}
    </span>
  );
}

function LeftSolutionCard({ card }) {
  const isWordpressCard = card.title === 'Soluzioni WordPress';

  return (
    <article className="group relative flex min-h-[226px] items-center overflow-hidden rounded-xl border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(15,34,52,0.12)] lg:col-span-2 lg:block lg:h-[280px]">
      <CardOverlayIcon title={card.title} icon={card.icon} placement={isWordpressCard ? 'bottom-right' : 'top-left'} />

      <div className="relative z-10 flex w-full items-center gap-3 p-4 sm:gap-4 sm:p-5 md:p-6 lg:hidden">
        <div className="min-w-0 flex-1 pr-1 text-left sm:pr-2">
          <h3 className="mb-2 font-headline text-[1.08rem] font-bold leading-[1.18] text-[#1f2630] sm:text-[1.22rem] md:text-[1.34rem]">{card.title}</h3>
          <p className="font-body text-[0.82rem] leading-relaxed text-[#505763] sm:text-[0.89rem] md:text-[0.94rem]">{card.description}</p>
        </div>

        <div className="w-[48%] shrink-0 sm:w-[46%]">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
            <img
              src={card.previewImage}
              alt={card.title}
              className={`absolute inset-0 h-full w-full object-cover scale-[1.08] sm:scale-[1.13] ${
                isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden h-full px-7 py-6 lg:block">
        <div className="flex h-full flex-col justify-center">
          <div className={`flex flex-col lg:max-w-[58%] ${isWordpressCard ? 'lg:ml-auto lg:items-end lg:text-right' : ''}`}>
            <h3 className="mb-2 font-headline text-[1.5rem] font-bold leading-[1.18] text-[#1f2630]">{card.title}</h3>
            <p className="font-body text-[0.96rem] leading-relaxed text-[#505763] lg:min-h-[4.4rem]">{card.description}</p>
          </div>
        </div>

        <div
          className={`w-full sm:max-w-none lg:absolute lg:bottom-6 lg:top-6 lg:w-[38%] ${
            isWordpressCard ? 'lg:left-6' : 'lg:right-6'
          }`}
        >
          <div className="relative h-[240px] w-full overflow-hidden bg-white sm:h-[280px] lg:h-full">
            <img
              src={card.previewImage}
              alt={card.title}
              className={`absolute inset-0 h-full w-full object-cover scale-[1.2] ${
                isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]'
              }`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function RightSolutionCard({ card }) {
  return (
    <article className="group relative flex min-h-[226px] items-center overflow-hidden rounded-xl border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(15,34,52,0.12)] lg:col-span-1 lg:block lg:row-span-2 lg:min-h-[584px]">
      <CardOverlayIcon title={card.title} icon={card.icon} placement="top-right" />

      <div className="relative z-10 flex w-full items-center gap-3 p-4 sm:gap-4 sm:p-5 md:p-6 lg:hidden">
        <div className="w-[48%] shrink-0 sm:w-[46%]">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
            <img
              src={card.previewImage}
              alt={card.title}
              className="absolute inset-0 h-full w-full scale-[1.1] object-contain object-top"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 pl-1 text-right sm:pl-2">
          <h3 className="mb-2 font-headline text-[1.08rem] font-bold leading-[1.18] text-[#1f2630] sm:text-[1.22rem] md:text-[1.34rem]">{card.title}</h3>
          <p className="font-body text-[0.82rem] leading-relaxed text-[#505763] sm:text-[0.89rem] md:text-[0.94rem]">{card.description}</p>
        </div>
      </div>

      <div className="relative z-10 hidden h-full flex-col justify-center gap-6 px-7 pt-[54px] pb-[54px] lg:flex">
        <div className="flex flex-col">
          <h3 className="mb-2 font-headline text-[1.5rem] font-bold leading-[1.18] text-[#1f2630]">{card.title}</h3>
          <p className="font-body text-[0.96rem] leading-relaxed text-[#505763]">{card.description}</p>
        </div>

        <div className="relative min-h-[250px] flex-1 overflow-hidden bg-white">
          <img
            src={card.previewImage}
            alt={card.title}
            className="absolute inset-0 h-full w-full scale-[1.04] object-contain object-top"
          />
        </div>
      </div>
    </article>
  );
}

export default function WebSolutionsSection() {
  const [topLeftCard, bottomLeftCard] = leftWebSolutionCards;

  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-24" id="siti-web">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          className="mb-12 max-w-2xl sm:mb-14 lg:mb-16"
          title="Siti Web"
          subtitle="Progettate per la massima conversione della tua attività."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LeftSolutionCard card={topLeftCard} />
          <RightSolutionCard card={rightWebSolutionCard} />
          <LeftSolutionCard card={bottomLeftCard} />
        </div>
      </div>
    </section>
  );
}
