import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../SectionHeader';
import wordpressLogo from '../../../media/icons/wordpress.png';
import customWebAppImage from '../../../media/images/custom_web_app.png';
import ecommerceImage from '../../../media/images/ecommerce.png';
import seoOrientedImage from '../../../media/images/seo_oriented.png';

const leftWebSolutionCards = [
  {
    icon: 'code_blocks',
    title: 'Web App Personalizzate',
    description: 'Applicazioni personalizzate per garantire efficienza, sicurezza e flessibilità nel tempo.',
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
  title: 'Piattaforme di E-Commerce',
  description: 'Piattaforme di vendita online sicure ed efficaci, integrabili con i più noti metodi di pagamento.',
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
    <article className="group relative flex min-h-[208px] items-center overflow-hidden rounded-xl border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(15,34,52,0.12)] sm:min-h-[228px] md:min-h-[252px] lg:col-span-2 lg:block lg:h-[312px]">
      <CardOverlayIcon title={card.title} icon={card.icon} placement={isWordpressCard ? 'bottom-right' : 'top-left'} />

      <div className="relative z-10 flex w-full items-center gap-3 p-3 sm:gap-4 sm:p-4 md:p-5 lg:hidden">
        <div className="min-w-0 flex-1 pr-1 text-left sm:pr-2">
          <h3 className="mb-2 font-headline text-[1.12rem] font-bold leading-[1.2] text-[#1f2630] sm:text-[1.24rem] md:text-[1.38rem]">{card.title}</h3>
          <p className="max-w-[30ch] font-body text-[0.9rem] leading-relaxed text-[#505763] sm:text-[0.97rem] md:max-w-[32ch] md:text-[1.02rem]">{card.description}</p>
        </div>

        <div className="w-[48%] shrink-0 sm:w-[46%] md:w-[34%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
            <img
              src={card.previewImage}
              alt={card.title}
              className={`absolute inset-0 h-full w-full object-cover scale-[1.02] sm:scale-[1.06] ${
                isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden h-full px-7 py-6 lg:block">
        <div className="flex h-full flex-col justify-center">
          <div className={`flex flex-col lg:max-w-[58%] ${isWordpressCard ? 'lg:ml-auto lg:items-end lg:text-right' : ''}`}>
            <h3 className="mb-2 font-headline text-[1.52rem] font-bold leading-[1.18] text-[#1f2630] xl:text-[1.58rem]">{card.title}</h3>
            <p className="max-w-[34ch] font-body text-[1rem] leading-relaxed text-[#505763] lg:min-h-[4.4rem] xl:text-[1.04rem]">{card.description}</p>
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
              className={`absolute inset-0 h-full w-full object-cover scale-[1.08] ${
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
  const desktopTitleWrapRef = useRef(null);
  const desktopTitleMeasureRef = useRef(null);
  const [useShortDesktopTitle, setUseShortDesktopTitle] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const evaluateDesktopTitle = () => {
      const wrap = desktopTitleWrapRef.current;
      const measure = desktopTitleMeasureRef.current;

      if (!wrap || !measure) return;

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      if (!isDesktop) {
        setUseShortDesktopTitle(false);
        return;
      }

      const availableWidth = wrap.getBoundingClientRect().width;
      const fullTitleWidth = measure.getBoundingClientRect().width;
      setUseShortDesktopTitle(fullTitleWidth > availableWidth);
    };

    const resizeObserver = new ResizeObserver(evaluateDesktopTitle);
    if (desktopTitleWrapRef.current) resizeObserver.observe(desktopTitleWrapRef.current);

    window.addEventListener('resize', evaluateDesktopTitle);
    evaluateDesktopTitle();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', evaluateDesktopTitle);
    };
  }, []);

  const desktopTitle = useShortDesktopTitle ? 'E-Commerce' : card.title;

  return (
    <article className="group relative flex min-h-[208px] items-center overflow-hidden rounded-xl border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(15,34,52,0.12)] sm:min-h-[228px] md:min-h-[252px] lg:col-span-1 lg:block lg:row-span-2 lg:min-h-[648px]">
      <CardOverlayIcon title={card.title} icon={card.icon} placement="top-right" />

      <div className="relative z-10 flex w-full items-center gap-3 p-3 sm:gap-4 sm:p-4 md:p-5 lg:hidden">
        <div className="w-[48%] shrink-0 sm:w-[46%] md:w-[34%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
            <img
              src={card.previewImage}
              alt={card.title}
              className="absolute inset-0 h-full w-full scale-[1.02] object-contain object-top"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-right sm:pl-1 md:pl-2">
          <h3 className="mb-2 font-headline text-[1.12rem] font-bold leading-[1.2] text-[#1f2630] sm:text-[1.24rem] md:text-[1.38rem]">{card.title}</h3>
          <p className="ml-auto max-w-[30ch] font-body text-[0.9rem] leading-relaxed text-[#505763] sm:text-[0.97rem] md:max-w-[32ch] md:text-[1.02rem]">
            {card.description}
          </p>
        </div>
      </div>

      <div className="relative z-10 hidden h-full px-7 py-10 lg:flex">
        <div className="my-auto flex w-full flex-col gap-14">
          <div ref={desktopTitleWrapRef} className="relative flex w-full flex-col">
            <span
              ref={desktopTitleMeasureRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 inline-block whitespace-nowrap font-headline text-[1.5rem] font-bold leading-[1.18] opacity-0"
            >
              {card.title}
            </span>
            <h3 className="mb-2 whitespace-nowrap font-headline text-[1.52rem] font-bold leading-[1.18] text-[#1f2630] xl:text-[1.58rem]">{desktopTitle}</h3>
            <p className="max-w-[34ch] font-body text-[1rem] leading-relaxed text-[#505763] xl:text-[1.04rem]">{card.description}</p>
          </div>

          <div className="relative h-[280px] w-full overflow-hidden bg-white">
            <img
              src={card.previewImage}
              alt={card.title}
              className="absolute inset-0 h-full w-full scale-[1.04] object-contain object-top"
            />
          </div>
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
