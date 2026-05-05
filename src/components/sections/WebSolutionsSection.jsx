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
    description: 'Soluzioni personalizzate per garantire efficienza, sicurezza e flessibilità nel tempo.',
    mobileDescription: 'Soluzioni ad-hoc che garantiscono sicurezza, efficienza e flessibilità',
    previewImage: customWebAppImage
  },
  {
    icon: 'web',
    title: 'Soluzioni WordPress',
    description: 'Siti vetrina ottimizzati per SEO e visibilità, veloci e gestibili in autonomia.',
    mobileDescription: 'Siti vetrina ottimizzati per SEO e visibilità',
    previewImage: seoOrientedImage
  }
];

const rightWebSolutionCard = {
  icon: 'shopping_cart',
  title: 'Piattaforme di E-Commerce',
  description: 'Portali di vendita online sicuri ed efficaci, integrabili con i più noti metodi di pagamento.',
  mobileDescription: 'Portali di vendita online sicuri ed efficaci',
  previewImage: ecommerceImage
};

function WordpressMaskedIcon({ className = '' }) {
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{
        maskImage: `url(${wordpressLogo})`,
        WebkitMaskImage: `url(${wordpressLogo})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain'
      }}
    />
  );
}

function getRenderedTextCenterX(element) {
  if (!element) return null;

  const range = document.createRange();
  range.selectNodeContents(element);
  const rects = Array.from(range.getClientRects());

  if (!rects.length) return null;

  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.right));
  return (left + right) / 2;
}

function useStackedIconTextCenter() {
  const textWrapRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [iconLeft, setIconLeft] = useState('50%');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateIconCenter = () => {
      const textWrap = textWrapRef.current;
      const title = titleRef.current;
      const description = descriptionRef.current;

      if (!textWrap || !title || !description) return;

      if (!window.matchMedia('(max-width: 960px)').matches) {
        setIconLeft('50%');
        return;
      }

      const wrapRect = textWrap.getBoundingClientRect();
      const titleCenter = getRenderedTextCenterX(title);
      const descriptionCenter = getRenderedTextCenterX(description);
      const centers = [titleCenter, descriptionCenter].filter((center) => center !== null);

      if (!centers.length) {
        setIconLeft('50%');
        return;
      }

      const averageCenter = centers.reduce((sum, center) => sum + center, 0) / centers.length;
      const clampedLocalX = Math.max(0, Math.min(wrapRect.width, averageCenter - wrapRect.left));
      const nextLeft = `${clampedLocalX.toFixed(1)}px`;
      setIconLeft((currentLeft) => (currentLeft === nextLeft ? currentLeft : nextLeft));
    };

    const resizeObserver = new ResizeObserver(updateIconCenter);
    if (textWrapRef.current) resizeObserver.observe(textWrapRef.current);
    if (titleRef.current) resizeObserver.observe(titleRef.current);
    if (descriptionRef.current) resizeObserver.observe(descriptionRef.current);

    window.addEventListener('resize', updateIconCenter);
    updateIconCenter();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateIconCenter);
    };
  }, []);

  return { textWrapRef, titleRef, descriptionRef, iconLeft };
}

function useDesktopIconTextCenter() {
  const textWrapRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [iconLeft, setIconLeft] = useState('50%');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateIconCenter = () => {
      const textWrap = textWrapRef.current;
      const title = titleRef.current;
      const description = descriptionRef.current;

      if (!textWrap || !title || !description) return;

      if (!window.matchMedia('(min-width: 1024px)').matches) {
        setIconLeft('50%');
        return;
      }

      const wrapRect = textWrap.getBoundingClientRect();
      const titleCenter = getRenderedTextCenterX(title);
      const descriptionCenter = getRenderedTextCenterX(description);
      const centers = [titleCenter, descriptionCenter].filter((center) => center !== null);

      if (!centers.length) {
        setIconLeft('50%');
        return;
      }

      const averageCenter = centers.reduce((sum, center) => sum + center, 0) / centers.length;
      const clampedLocalX = Math.max(0, Math.min(wrapRect.width, averageCenter - wrapRect.left));
      const nextLeft = `${clampedLocalX.toFixed(1)}px`;
      setIconLeft((currentLeft) => (currentLeft === nextLeft ? currentLeft : nextLeft));
    };

    const resizeObserver = new ResizeObserver(updateIconCenter);
    if (textWrapRef.current) resizeObserver.observe(textWrapRef.current);
    if (titleRef.current) resizeObserver.observe(titleRef.current);
    if (descriptionRef.current) resizeObserver.observe(descriptionRef.current);

    window.addEventListener('resize', updateIconCenter);
    updateIconCenter();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateIconCenter);
    };
  }, []);

  return { textWrapRef, titleRef, descriptionRef, iconLeft };
}

function useCardReveal(revealDelayMs = 0) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const cardElement = cardRef.current;
    if (!cardElement) return undefined;

    let revealTimerId;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);
        revealTimerId = window.setTimeout(() => {
          setIsVisible(true);
        }, revealDelayMs);
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    observer.observe(cardElement);

    return () => {
      observer.disconnect();
      if (revealTimerId) window.clearTimeout(revealTimerId);
    };
  }, [revealDelayMs]);

  return { cardRef, isVisible };
}

function CardHoverGlow({ mobileImageSide = 'right', desktopImageSide = mobileImageSide }) {
  return (
    <span
      className={`web-solution-card-glow web-solution-card-glow--mobile-image-${mobileImageSide} web-solution-card-glow--desktop-image-${desktopImageSide} pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none`}
      aria-hidden
    />
  );
}

function StackedCenterOverlayIcon({ title, icon, left = '50%', visibilityClass = 'lg:hidden' }) {
  const isWordpress = title === 'Soluzioni WordPress';

  return (
    <span className={`pointer-events-none absolute top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 ${visibilityClass}`} style={{ left }}>
      {isWordpress ? (
        <WordpressMaskedIcon className="h-28 w-28 bg-[#2f5a75] opacity-[0.09] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:bg-[#1284e0] group-hover:opacity-[0.22] group-hover:drop-shadow-[0_0_22px_rgba(18,132,224,0.38)] sm:h-28 sm:w-28 md:h-32 md:w-32" />
      ) : (
        <span className="material-symbols-outlined fill text-[116px] leading-none text-[#2f5a75] opacity-[0.08] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:text-[#1284e0] group-hover:opacity-[0.21] group-hover:drop-shadow-[0_0_22px_rgba(18,132,224,0.38)] sm:text-[120px] md:text-[150px]">
          {icon}
        </span>
      )}
    </span>
  );
}

function DesktopCenterOverlayIcon({ title, icon, left = '50%' }) {
  const isWordpress = title === 'Soluzioni WordPress';

  return (
    <span className="pointer-events-none absolute top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block" style={{ left }}>
      {isWordpress ? (
        <WordpressMaskedIcon className="h-44 w-44 bg-[#2f5a75] opacity-[0.1] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:bg-[#1284e0] group-hover:opacity-[0.24] group-hover:drop-shadow-[0_0_28px_rgba(18,132,224,0.42)]" />
      ) : (
        <span className="material-symbols-outlined fill text-[200px] leading-none text-[#2f5a75] opacity-[0.09] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:text-[#1284e0] group-hover:opacity-[0.24] group-hover:drop-shadow-[0_0_28px_rgba(18,132,224,0.42)]">
          {icon}
        </span>
      )}
    </span>
  );
}

function LeftSolutionCard({ card, revealDelayMs = 0 }) {
  const isWordpressCard = card.title === 'Soluzioni WordPress';
  const mobileDescription = card.mobileDescription ?? card.description;
  const { cardRef, isVisible } = useCardReveal(revealDelayMs);
  const { textWrapRef, titleRef, descriptionRef, iconLeft } = useStackedIconTextCenter();
  const {
    textWrapRef: desktopTextWrapRef,
    titleRef: desktopTitleRef,
    descriptionRef: desktopDescriptionRef,
    iconLeft: desktopIconLeft
  } = useDesktopIconTextCenter();

  return (
    <article
      ref={cardRef}
      className={`group relative flex min-h-[208px] items-center overflow-hidden rounded-xl border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)] motion-safe:transform-gpu motion-safe:transition-all motion-safe:duration-[420ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:border-[#b8cfe3] hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(15,34,52,0.12)] sm:min-h-[228px] md:min-h-[252px] lg:col-span-2 lg:block lg:h-[284px] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <CardHoverGlow mobileImageSide="right" desktopImageSide={isWordpressCard ? 'left' : 'right'} />
      <StackedCenterOverlayIcon title={card.title} icon={card.icon} visibilityClass="hidden min-[961px]:block lg:hidden" />

      <div className="relative z-10 flex w-full items-center gap-3 px-6 py-3 sm:gap-4 sm:px-7 sm:py-4 md:px-8 md:py-5 lg:hidden">
        <div className="min-w-0 flex-1 pr-1 text-left sm:pr-2">
          <div ref={textWrapRef} className="relative mr-auto w-fit max-w-[30ch] sm:max-w-[32ch]">
            <StackedCenterOverlayIcon title={card.title} icon={card.icon} left={iconLeft} visibilityClass="block min-[961px]:hidden" />
            <h3 ref={titleRef} className="relative z-10 mb-2 font-headline text-[1.12rem] font-bold leading-[1.2] text-[#1f2630] sm:text-[1.24rem] md:text-[1.38rem]">{card.title}</h3>
            <p ref={descriptionRef} className="relative z-10 font-body text-[0.9rem] leading-relaxed text-[#505763] sm:text-[0.97rem] md:text-[1.02rem]">{mobileDescription}</p>
          </div>
        </div>

        <div className="w-[48%] shrink-0 sm:w-[46%] md:w-[34%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
            <img
              src={card.previewImage}
              alt={card.title}
              className={`absolute inset-0 h-full w-full object-cover scale-[1.12] sm:scale-[1.14] ${
                isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden h-full px-7 py-6 lg:block">
        <div className="flex h-full flex-col justify-center">
          <div
            ref={desktopTextWrapRef}
            className={`relative flex flex-col lg:max-w-[58%] ${isWordpressCard ? 'lg:ml-auto lg:items-end lg:text-right' : ''}`}
          >
            <DesktopCenterOverlayIcon title={card.title} icon={card.icon} left={desktopIconLeft} />
            <h3
              ref={desktopTitleRef}
              className="relative z-10 mb-2 font-headline text-[1.52rem] font-bold leading-[1.18] text-[#1f2630] xl:text-[1.58rem]"
            >
              {card.title}
            </h3>
            <p
              ref={desktopDescriptionRef}
              className="relative z-10 max-w-[34ch] font-body text-[1rem] leading-relaxed text-[#505763] lg:min-h-[4.4rem] xl:text-[1.04rem]"
            >
              {card.description}
            </p>
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
              className={`absolute inset-0 h-full w-full object-cover scale-[1.12] ${
                isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]'
              }`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function RightSolutionCard({ card, revealDelayMs = 0 }) {
  const mobileDescription = card.mobileDescription ?? card.description;
  const desktopTitleWrapRef = useRef(null);
  const desktopTitleMeasureRef = useRef(null);
  const [useShortDesktopTitle, setUseShortDesktopTitle] = useState(false);
  const { textWrapRef, titleRef, descriptionRef, iconLeft } = useStackedIconTextCenter();
  const {
    titleRef: desktopTitleRef,
    descriptionRef: desktopDescriptionRef,
    iconLeft: desktopIconLeft
  } = useDesktopIconTextCenter();
  const { cardRef, isVisible } = useCardReveal(revealDelayMs);

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
    <article
      ref={cardRef}
      className={`group relative flex min-h-[208px] items-center overflow-hidden rounded-xl border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)] motion-safe:transform-gpu motion-safe:transition-all motion-safe:duration-[420ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:border-[#b8cfe3] hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(15,34,52,0.12)] sm:min-h-[228px] md:min-h-[252px] lg:col-span-1 lg:block lg:row-span-2 lg:min-h-[592px] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <CardHoverGlow mobileImageSide="left" desktopImageSide="bottom" />
      <StackedCenterOverlayIcon title={card.title} icon={card.icon} visibilityClass="hidden min-[961px]:block lg:hidden" />

      <div className="relative z-10 flex w-full items-center gap-3 px-6 py-3 sm:gap-4 sm:px-7 sm:py-4 md:px-8 md:py-5 lg:hidden">
        <div className="w-[48%] shrink-0 sm:w-[46%] md:w-[34%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
            <img
              src={card.previewImage}
              alt={card.title}
              className="absolute inset-0 h-full w-full scale-[1.12] object-contain object-left-top"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-right sm:pl-1 md:pl-2">
          <div ref={textWrapRef} className="relative ml-auto w-fit max-w-[30ch] sm:max-w-[32ch]">
            <StackedCenterOverlayIcon title={card.title} icon={card.icon} left={iconLeft} visibilityClass="block min-[961px]:hidden" />
            <h3 ref={titleRef} className="relative z-10 mb-2 font-headline text-[1.12rem] font-bold leading-[1.2] text-[#1f2630] sm:text-[1.24rem] md:text-[1.38rem]">
              {card.title}
            </h3>
            <p ref={descriptionRef} className="relative z-10 font-body text-[0.9rem] leading-relaxed text-[#505763] sm:text-[0.97rem] md:text-[1.02rem]">
              {mobileDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden h-full px-7 py-6 lg:flex">
        <div className="flex h-full w-full flex-col">
          <div className="flex h-[186px] items-end">
            <div ref={desktopTitleWrapRef} className="relative flex w-full flex-col pb-1">
              <DesktopCenterOverlayIcon title={card.title} icon={card.icon} left={desktopIconLeft} />
              <span
                ref={desktopTitleMeasureRef}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 inline-block whitespace-nowrap font-headline text-[1.5rem] font-bold leading-[1.18] opacity-0"
              >
                {card.title}
              </span>
              <h3 ref={desktopTitleRef} className="relative z-10 mb-2 whitespace-nowrap font-headline text-[1.52rem] font-bold leading-[1.18] text-[#1f2630] xl:text-[1.58rem]">{desktopTitle}</h3>
              <p ref={desktopDescriptionRef} className="relative z-10 max-w-[34ch] font-body text-[1rem] leading-relaxed text-[#505763] xl:text-[1.04rem]">{card.description}</p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-end pb-[18px]">
            <div className="relative h-[280px] w-full overflow-hidden bg-white">
              <img
                src={card.previewImage}
                alt={card.title}
                className="absolute inset-0 h-full w-full scale-[1.1] object-contain object-top"
              />
            </div>
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
      <div className="relative mx-auto max-w-7xl px-8">
        <SectionHeader
          className="mb-12 max-w-2xl sm:mb-14 lg:mb-16"
          title="Siti Web"
          subtitle="Progettate per la massima conversione della tua attività."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LeftSolutionCard card={topLeftCard} revealDelayMs={0} />
          <RightSolutionCard card={rightWebSolutionCard} revealDelayMs={70} />
          <LeftSolutionCard card={bottomLeftCard} revealDelayMs={140} />
        </div>
      </div>
    </section>
  );
}
