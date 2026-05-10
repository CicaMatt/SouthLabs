import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../SectionHeader';
import wordpressLogo from '../../../media/icons/wordpress.png';
import customWebAppImage from '../../../media/images/custom_web_app.png';
import customWebAppSquareImage from '../../../media/images/custom_web_app_square.png';
import ecommerceImage from '../../../media/images/ecommerce.png';
import seoOrientedImage from '../../../media/images/seo_oriented.png';
import seoOrientedSquareImage from '../../../media/images/seo_oriented_square.png';

const WORDPRESS_TITLE = 'Soluzioni WordPress';
const SOLUTION_CARD_BASE_CLASS = [
  'group relative flex min-h-[208px] items-center overflow-hidden rounded-xl',
  'border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)]',
  'motion-safe:transform-gpu motion-safe:transition-all motion-safe:duration-[420ms]',
  'motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
  'hover:-translate-y-[3px] hover:border-[#7eaac8] hover:shadow-[0_20px_38px_rgba(10,27,43,0.2),0_0_0_1px_rgba(18,84,132,0.12)]',
  'sm:min-h-[228px] md:min-h-[252px]'
].join(' ');
const MOBILE_CARD_ROW_CLASS = [
  'relative z-10 flex w-full items-center gap-3 px-6 py-3',
  'sm:gap-4 sm:px-7 sm:py-4 md:px-8 md:py-5 lg:hidden'
].join(' ');
const SOLUTION_IMAGE_SHELL_CLASS = 'relative w-full overflow-hidden bg-white';

// Two horizontal cards on desktop; the third solution is handled by RightSolutionCard.
const leftWebSolutionCards = [
  {
    icon: 'code_blocks',
    title: 'Web App Personalizzate',
    description: 'Soluzioni personalizzate per garantire efficienza, sicurezza e flessibilità nel tempo.',
    mobileDescription: 'Soluzioni ad-hoc che garantiscono sicurezza, efficienza e flessibilità',
    previewImage: customWebAppImage,
    stackedPreviewImage: customWebAppSquareImage
  },
  {
    icon: 'web',
    title: WORDPRESS_TITLE,
    description: 'Siti vetrina ottimizzati per SEO e visibilità, veloci e gestibili in autonomia.',
    mobileDescription: 'Siti vetrina ottimizzati per SEO e visibilità',
    previewImage: seoOrientedImage,
    stackedPreviewImage: seoOrientedSquareImage
  }
];

const rightWebSolutionCard = {
  icon: 'shopping_cart',
  title: 'Piattaforme E-Commerce',
  description: 'Portali di vendita online sicuri ed efficaci, integrabili con i più noti metodi di pagamento.',
  mobileDescription: 'Portali di vendita online sicuri ed efficaci',
  previewImage: ecommerceImage
};

// Renders the WordPress PNG as a mask so it can be tinted like Material Symbols.
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

// Uses rendered text boxes rather than container width so overlay icons align visually.
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

// Keeps the decorative background icon centered behind wrapped title/description text.
function useIconTextCenter(mediaQuery) {
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

      if (!window.matchMedia(mediaQuery).matches) {
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
  }, [mediaQuery]);

  return { textWrapRef, titleRef, descriptionRef, iconLeft };
}

const useStackedIconTextCenter = () => useIconTextCenter('(max-width: 960px)');
const useDesktopIconTextCenter = () => useIconTextCenter('(min-width: 1024px)');

// Reveals cards as they enter the viewport, while respecting reduced-motion settings.
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

// Direction-aware hover glow; CSS variables change the gradient origin and mask.
function CardHoverGlow({ mobileImageSide = 'right', desktopImageSide = mobileImageSide }) {
  return (
    <span
      className={`web-solution-card-glow web-solution-card-glow--mobile-image-${mobileImageSide} web-solution-card-glow--desktop-image-${desktopImageSide} pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none`}
      aria-hidden
    />
  );
}

function ResponsiveSolutionDescription({ description, mobileDescription }) {
  return (
    <>
      <span className="md:hidden">{mobileDescription ?? description}</span>
      <span className="hidden md:inline">{description}</span>
    </>
  );
}

// Decorative icon used behind text on mobile and intermediate widths.
function StackedCenterOverlayIcon({ title, icon, left = '50%', visibilityClass = 'lg:hidden' }) {
  const isWordpress = title === WORDPRESS_TITLE;

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

// Larger desktop-only version of the decorative icon.
function DesktopCenterOverlayIcon({ title, icon, left = '50%' }) {
  const isWordpress = title === WORDPRESS_TITLE;

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

// Horizontal solution card used for custom web apps and WordPress.
function LeftSolutionCard({ card, revealDelayMs = 0 }) {
  const isWordpressCard = card.title === WORDPRESS_TITLE;
  const hasStackedPreviewImage = Boolean(card.stackedPreviewImage);
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
      className={`${SOLUTION_CARD_BASE_CLASS} lg:col-span-2 lg:block lg:h-[284px] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <CardHoverGlow mobileImageSide="right" desktopImageSide={isWordpressCard ? 'left' : 'right'} />
      <StackedCenterOverlayIcon title={card.title} icon={card.icon} visibilityClass="hidden min-[961px]:block lg:hidden" />

      <div className={MOBILE_CARD_ROW_CLASS}>
        <div className="min-w-0 flex-1 pr-1 text-left sm:pr-2">
          <div ref={textWrapRef} className="relative mr-auto w-fit max-w-[30ch] sm:max-w-[32ch]">
            <StackedCenterOverlayIcon title={card.title} icon={card.icon} left={iconLeft} visibilityClass="block min-[961px]:hidden" />
            <h3 ref={titleRef} className="relative z-10 mb-2 font-headline text-[1.08rem] font-bold leading-[1.2] text-[#1f2630] sm:text-[1.19rem] md:text-[1.32rem]">{card.title}</h3>
            <p ref={descriptionRef} className="relative z-10 font-body text-[0.86rem] leading-relaxed text-[#505763] sm:text-[0.93rem] md:text-[0.98rem]">
              <ResponsiveSolutionDescription description={card.description} mobileDescription={card.mobileDescription} />
            </p>
          </div>
        </div>

        <div
          className={`shrink-0 ${
            hasStackedPreviewImage ? 'w-[54%] sm:w-[52%] md:w-[40%]' : 'w-[52%] sm:w-[50%] md:w-[38%]'
          } ${hasStackedPreviewImage ? '-mr-4 sm:-mr-5 md:-mr-5' : '-mr-2.5 sm:-mr-3.5 md:-mr-3.5'}`}
        >
          <div className={`${SOLUTION_IMAGE_SHELL_CLASS} ${hasStackedPreviewImage ? 'aspect-square' : 'aspect-[4/3]'}`}>
            <img
              src={card.stackedPreviewImage ?? card.previewImage}
              alt={card.title}
              className={`absolute inset-0 h-full w-full ${
                hasStackedPreviewImage
                  ? 'object-contain object-center'
                  : `translate-x-1.5 object-cover scale-[1.18] sm:scale-[1.2] ${
                      isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]'
                    }`
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
          <div className={`${SOLUTION_IMAGE_SHELL_CLASS} h-[240px] sm:h-[280px] lg:h-full`}>
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

// Tall desktop card for e-commerce, with title shortening when space is tight.
function RightSolutionCard({ card, revealDelayMs = 0 }) {
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
      className={`${SOLUTION_CARD_BASE_CLASS} lg:col-span-1 lg:block lg:row-span-2 lg:min-h-[592px] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <CardHoverGlow mobileImageSide="left" desktopImageSide="bottom" />
      <StackedCenterOverlayIcon title={card.title} icon={card.icon} visibilityClass="hidden min-[961px]:block lg:hidden" />

      <div className={MOBILE_CARD_ROW_CLASS}>
        <div className="-ml-2.5 w-[54%] shrink-0 sm:-ml-3.5 sm:w-[52%] md:-ml-3.5 md:w-[40%]">
          <div className={`${SOLUTION_IMAGE_SHELL_CLASS} aspect-square`}>
            <img
              src={card.previewImage}
              alt={card.title}
              className="absolute inset-0 h-full w-full scale-[0.88] object-contain object-left-top sm:scale-100"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-right sm:pl-1 md:pl-2">
          <div ref={textWrapRef} className="relative ml-auto w-fit max-w-[30ch] sm:max-w-[32ch]">
            <StackedCenterOverlayIcon title={card.title} icon={card.icon} left={iconLeft} visibilityClass="block min-[961px]:hidden" />
            <h3 ref={titleRef} className="relative z-10 mb-2 font-headline text-[1.08rem] font-bold leading-[1.2] text-[#1f2630] sm:text-[1.19rem] md:text-[1.32rem]">
              Piattaforme <span className="whitespace-nowrap">E-Commerce</span>
            </h3>
            <p ref={descriptionRef} className="relative z-10 font-body text-[0.86rem] leading-relaxed text-[#505763] sm:text-[0.93rem] md:text-[0.98rem]">
              <ResponsiveSolutionDescription description={card.description} mobileDescription={card.mobileDescription} />
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
            <div className={`${SOLUTION_IMAGE_SHELL_CLASS} h-[280px]`}>
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

// Siti Web section with three responsive cards and image previews.
export default function WebSolutionsSection() {
  const [topLeftCard, bottomLeftCard] = leftWebSolutionCards;

  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-24" id="siti-web">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 md:px-8">
        <SectionHeader
          className="mb-12 max-w-2xl lg:mb-16"
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
