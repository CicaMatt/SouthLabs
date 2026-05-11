import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../SectionHeader';
import wordpressLogo from '../../../media/icons/wordpress.png';
import customWebAppImage from '../../../media/images/custom_web_app.png';
import ecommerceImage from '../../../media/images/ecommerce.png';
import seoOrientedImage from '../../../media/images/seo_oriented.png';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const WORDPRESS_TITLE = 'Soluzioni WordPress';
const SOLUTION_CARD_VIEW_QUERIES = {
  stacked: '(max-width: 960px)',
  desktop: '(min-width: 1024px)'
};
const SOLUTION_CARD_CLASSES = {
  shell: [
    'group relative flex min-h-[208px] items-center overflow-hidden rounded-xl',
    'border border-[#d9e0e6] bg-white shadow-[0_8px_20px_rgba(15,34,52,0.07)]',
    'motion-safe:transform-gpu motion-safe:transition-all motion-safe:duration-[420ms]',
    'motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
    'hover:-translate-y-[3px] hover:border-[#0047B3] hover:shadow-[0_20px_38px_rgba(10,27,43,0.2),0_0_0_2px_rgba(0,71,179,0.82)]',
    'sm:min-h-[228px] md:min-h-[252px]'
  ].join(' '),
  stackedRow: [
    'relative z-10 flex w-full items-center gap-3 px-6 py-3',
    'sm:gap-4 sm:px-7 sm:py-4 md:px-8 md:py-5 lg:hidden'
  ].join(' '),
  imageShell: 'relative w-full overflow-hidden bg-transparent',
  hoverGlow: [
    'web-solution-card-glow pointer-events-none absolute inset-0 z-[1] opacity-0',
    'transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none'
  ].join(' '),
  stackedTitle: 'relative z-10 mb-2 font-headline text-[1.2rem] font-bold leading-[1.18] text-on-background sm:text-[1.28rem] md:text-[1.32rem]',
  stackedDescription: 'relative z-10 font-body text-[0.86rem] leading-relaxed text-on-surface-variant sm:text-[0.93rem] md:text-[0.98rem]',
  desktopTitle: 'relative z-10 mb-2 font-headline text-[1.52rem] font-bold leading-[1.18] text-on-background xl:text-[1.58rem]',
  desktopDescription: 'relative z-10 max-w-[34ch] font-body text-[1rem] leading-relaxed text-on-surface-variant xl:text-[1.04rem]',
  intermediateOverlay: 'hidden min-[961px]:block lg:hidden',
  stackedOverlay: 'block min-[961px]:hidden'
};
const HORIZONTAL_CARD_CLASSES = {
  shell: 'lg:col-span-2 lg:block lg:h-[284px]',
  stackedTextColumn: 'min-w-0 flex-1 pr-1 text-left sm:pr-2',
  stackedTextWrap: 'relative mr-auto w-fit max-w-[30ch] sm:max-w-[32ch]',
  stackedPreviewFrame: {
    square: 'shrink-0 w-[54%] sm:w-[52%] md:w-[40%] -mr-4 sm:-mr-5 md:-mr-5',
    wide: 'shrink-0 w-[52%] sm:w-[50%] md:w-[38%] -mr-2.5 sm:-mr-3.5 md:-mr-3.5'
  },
  stackedPreviewRatio: {
    square: 'aspect-square',
    wide: 'aspect-[4/3]'
  },
  stackedPreviewImage: {
    square: 'object-contain object-center',
    wide: 'translate-x-1.5 object-cover scale-[1.18] sm:scale-[1.2]'
  },
  desktopView: 'relative z-10 hidden h-full px-7 py-6 lg:block',
  desktopTextWrap: 'relative flex flex-col lg:max-w-[58%]',
  desktopTextWrapReversed: 'lg:ml-auto lg:items-end lg:text-right',
  desktopPreviewFrame: 'w-full sm:max-w-none lg:absolute lg:bottom-6 lg:top-6 lg:w-[38%]',
  desktopPreviewLeft: 'lg:left-6',
  desktopPreviewRight: 'lg:right-6',
  desktopDescription: 'lg:min-h-[4.4rem]'
};
const TALL_CARD_CLASSES = {
  shell: 'lg:col-span-1 lg:block lg:row-span-2 lg:min-h-[592px]',
  stackedPreviewFrame: '-ml-2.5 w-[54%] shrink-0 sm:-ml-3.5 sm:w-[52%] md:-ml-3.5 md:w-[40%]',
  stackedTextColumn: 'min-w-0 flex-1 text-right sm:pl-1 md:pl-2',
  stackedTextWrap: 'relative ml-auto w-fit max-w-[30ch] sm:max-w-[32ch]',
  desktopView: 'relative z-10 hidden h-full px-7 py-6 lg:flex',
  desktopTitleMeasure: 'pointer-events-none absolute left-0 top-0 inline-block whitespace-nowrap font-headline text-[1.5rem] font-bold leading-[1.18] opacity-0',
  desktopTitle: 'whitespace-nowrap',
  desktopIconLeft: '50%'
};

// Two horizontal cards on desktop; the third solution is handled by RightSolutionCard.
const LEFT_WEB_SOLUTION_CARDS = [
  {
    icon: 'code_blocks',
    title: 'Web App Personalizzate',
    description: 'Soluzioni personalizzate per garantire efficienza, sicurezza e flessibilità nel tempo.',
    mobileDescription: 'Soluzioni ad-hoc che garantiscono sicurezza, efficienza e flessibilità',
    previewImage: customWebAppImage,
    stackedPreviewImage: customWebAppImage,
    desktopPreviewScaleClass: 'scale-[1.2]'
  },
  {
    icon: 'web',
    title: WORDPRESS_TITLE,
    description: 'Siti vetrina ottimizzati per SEO e visibilità, veloci e gestibili in autonomia.',
    mobileDescription: 'Siti vetrina ottimizzati per SEO e visibilità',
    previewImage: seoOrientedImage,
    stackedPreviewImage: seoOrientedImage,
    desktopPreviewScaleClass: 'scale-[1.12]'
  }
];

const RIGHT_WEB_SOLUTION_CARD = {
  icon: 'shopping_cart',
  title: 'Piattaforme E-Commerce',
  description: 'Portali di vendita online sicuri ed efficaci, integrabili con i più noti metodi di pagamento.',
  mobileDescription: 'Portali di vendita online sicuri ed efficaci',
  previewImage: ecommerceImage
};

function getSolutionCardClassName(layoutClassName) {
  return cx(SOLUTION_CARD_CLASSES.shell, layoutClassName);
}

function getHorizontalPreviewPositionClass(isWordpressCard) {
  return isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]';
}

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

const useStackedIconTextCenter = () => useIconTextCenter(SOLUTION_CARD_VIEW_QUERIES.stacked);
const useDesktopIconTextCenter = () => useIconTextCenter(SOLUTION_CARD_VIEW_QUERIES.desktop);

function useDesktopTitleFit() {
  const titleWrapRef = useRef(null);
  const titleMeasureRef = useRef(null);
  const [useShortTitle, setUseShortTitle] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const evaluateTitleFit = () => {
      const wrap = titleWrapRef.current;
      const measure = titleMeasureRef.current;

      if (!wrap || !measure) return;

      const isDesktop = window.matchMedia(SOLUTION_CARD_VIEW_QUERIES.desktop).matches;
      if (!isDesktop) {
        setUseShortTitle(false);
        return;
      }

      const availableWidth = wrap.getBoundingClientRect().width;
      const fullTitleWidth = measure.getBoundingClientRect().width;
      setUseShortTitle(fullTitleWidth > availableWidth);
    };

    const resizeObserver = new ResizeObserver(evaluateTitleFit);
    if (titleWrapRef.current) resizeObserver.observe(titleWrapRef.current);

    window.addEventListener('resize', evaluateTitleFit);
    evaluateTitleFit();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', evaluateTitleFit);
    };
  }, []);

  return { titleWrapRef, titleMeasureRef, useShortTitle };
}

// Direction-aware hover glow; CSS variables change the gradient origin and mask.
function CardHoverGlow({ mobileImageSide = 'right', desktopImageSide = mobileImageSide }) {
  return (
    <span
      className={cx(
        SOLUTION_CARD_CLASSES.hoverGlow,
        `web-solution-card-glow--mobile-image-${mobileImageSide}`,
        `web-solution-card-glow--desktop-image-${desktopImageSide}`
      )}
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
    <span
      className={cx('pointer-events-none absolute top-1/2 z-0 -translate-x-1/2 -translate-y-1/2', visibilityClass)}
      style={{ left }}
    >
      {isWordpress ? (
        <WordpressMaskedIcon className="h-28 w-28 bg-[#2f5a75] opacity-[0.09] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:bg-[#0047B3] group-hover:opacity-[0.22] group-hover:drop-shadow-[0_0_24px_rgba(0,71,179,0.56)] sm:h-28 sm:w-28 md:h-32 md:w-32" />
      ) : (
        <span className="material-symbols-outlined fill text-[116px] leading-none text-[#2f5a75] opacity-[0.08] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:text-[#0047B3] group-hover:opacity-[0.21] group-hover:drop-shadow-[0_0_24px_rgba(0,71,179,0.56)] sm:text-[120px] md:text-[150px]">
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
    <span
      className="pointer-events-none absolute top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{ left }}
    >
      {isWordpress ? (
        <WordpressMaskedIcon className="h-44 w-44 bg-[#2f5a75] opacity-[0.1] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:bg-[#0047B3] group-hover:opacity-[0.26] group-hover:drop-shadow-[0_0_32px_rgba(0,71,179,0.58)]" />
      ) : (
        <span className="material-symbols-outlined fill text-[200px] leading-none text-[#2f5a75] opacity-[0.09] transition-all duration-300 motion-safe:group-hover:-translate-y-[2px] group-hover:text-[#0047B3] group-hover:opacity-[0.25] group-hover:drop-shadow-[0_0_32px_rgba(0,71,179,0.58)]">
          {icon}
        </span>
      )}
    </span>
  );
}

// Horizontal solution card used for custom web apps and WordPress.
function LeftSolutionCard({ card }) {
  const isWordpressCard = card.title === WORDPRESS_TITLE;
  const hasStackedPreviewImage = Boolean(card.stackedPreviewImage);
  const stackedPreviewMode = hasStackedPreviewImage ? 'square' : 'wide';
  const previewPositionClass = getHorizontalPreviewPositionClass(isWordpressCard);
  const { textWrapRef, titleRef, descriptionRef, iconLeft } = useStackedIconTextCenter();
  const {
    textWrapRef: desktopTextWrapRef,
    titleRef: desktopTitleRef,
    descriptionRef: desktopDescriptionRef,
    iconLeft: desktopIconLeft
  } = useDesktopIconTextCenter();

  return (
    <article
      className={getSolutionCardClassName(HORIZONTAL_CARD_CLASSES.shell)}
    >
      <CardHoverGlow mobileImageSide="right" desktopImageSide={isWordpressCard ? 'left' : 'right'} />
      <StackedCenterOverlayIcon title={card.title} icon={card.icon} visibilityClass={SOLUTION_CARD_CLASSES.intermediateOverlay} />

      <div className={SOLUTION_CARD_CLASSES.stackedRow}>
        <div className={HORIZONTAL_CARD_CLASSES.stackedTextColumn}>
          <div ref={textWrapRef} className={HORIZONTAL_CARD_CLASSES.stackedTextWrap}>
            <StackedCenterOverlayIcon title={card.title} icon={card.icon} left={iconLeft} visibilityClass={SOLUTION_CARD_CLASSES.stackedOverlay} />
            <h3 ref={titleRef} className={SOLUTION_CARD_CLASSES.stackedTitle}>{card.title}</h3>
            <p ref={descriptionRef} className={SOLUTION_CARD_CLASSES.stackedDescription}>
              <ResponsiveSolutionDescription description={card.description} mobileDescription={card.mobileDescription} />
            </p>
          </div>
        </div>

        <div className={HORIZONTAL_CARD_CLASSES.stackedPreviewFrame[stackedPreviewMode]}>
          <div className={cx(SOLUTION_CARD_CLASSES.imageShell, HORIZONTAL_CARD_CLASSES.stackedPreviewRatio[stackedPreviewMode])}>
            <img
              src={card.stackedPreviewImage ?? card.previewImage}
              alt={card.title}
              className={cx(
                'absolute inset-0 h-full w-full',
                HORIZONTAL_CARD_CLASSES.stackedPreviewImage[stackedPreviewMode],
                !hasStackedPreviewImage && previewPositionClass
              )}
            />
          </div>
        </div>
      </div>

      <div className={HORIZONTAL_CARD_CLASSES.desktopView}>
        <div className="flex h-full flex-col justify-center">
          <div
            ref={desktopTextWrapRef}
            className={cx(
              HORIZONTAL_CARD_CLASSES.desktopTextWrap,
              isWordpressCard && HORIZONTAL_CARD_CLASSES.desktopTextWrapReversed
            )}
          >
            <DesktopCenterOverlayIcon title={card.title} icon={card.icon} left={desktopIconLeft} />
            <h3
              ref={desktopTitleRef}
              className={SOLUTION_CARD_CLASSES.desktopTitle}
            >
              {card.title}
            </h3>
            <p
              ref={desktopDescriptionRef}
              className={cx(SOLUTION_CARD_CLASSES.desktopDescription, HORIZONTAL_CARD_CLASSES.desktopDescription)}
            >
              {card.description}
            </p>
          </div>
        </div>

        <div
          className={cx(
            HORIZONTAL_CARD_CLASSES.desktopPreviewFrame,
            isWordpressCard ? HORIZONTAL_CARD_CLASSES.desktopPreviewLeft : HORIZONTAL_CARD_CLASSES.desktopPreviewRight
          )}
        >
          <div className={cx(SOLUTION_CARD_CLASSES.imageShell, 'h-[240px] sm:h-[280px] lg:h-full')}>
            <img
              src={card.previewImage}
              alt={card.title}
              className={cx('absolute inset-0 h-full w-full object-contain', card.desktopPreviewScaleClass, previewPositionClass)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

// Tall desktop card for e-commerce, with title shortening when space is tight.
function RightSolutionCard({ card }) {
  const { textWrapRef, titleRef, descriptionRef, iconLeft } = useStackedIconTextCenter();
  const { titleWrapRef, titleMeasureRef, useShortTitle } = useDesktopTitleFit();
  const desktopTitle = useShortTitle ? 'E-Commerce' : card.title;

  return (
    <article
      className={getSolutionCardClassName(TALL_CARD_CLASSES.shell)}
    >
      <CardHoverGlow mobileImageSide="left" desktopImageSide="bottom" />
      <StackedCenterOverlayIcon title={card.title} icon={card.icon} visibilityClass={SOLUTION_CARD_CLASSES.intermediateOverlay} />

      <div className={SOLUTION_CARD_CLASSES.stackedRow}>
        <div className={TALL_CARD_CLASSES.stackedPreviewFrame}>
          <div className={cx(SOLUTION_CARD_CLASSES.imageShell, 'aspect-square')}>
            <img
              src={card.previewImage}
              alt={card.title}
              className="absolute inset-0 h-full w-full scale-[0.88] object-contain object-left-top sm:scale-100"
            />
          </div>
        </div>

        <div className={TALL_CARD_CLASSES.stackedTextColumn}>
          <div ref={textWrapRef} className={TALL_CARD_CLASSES.stackedTextWrap}>
            <StackedCenterOverlayIcon title={card.title} icon={card.icon} left={iconLeft} visibilityClass={SOLUTION_CARD_CLASSES.stackedOverlay} />
            <h3 ref={titleRef} className={SOLUTION_CARD_CLASSES.stackedTitle}>
              Piattaforme <span className="whitespace-nowrap">E-Commerce</span>
            </h3>
            <p ref={descriptionRef} className={SOLUTION_CARD_CLASSES.stackedDescription}>
              <ResponsiveSolutionDescription description={card.description} mobileDescription={card.mobileDescription} />
            </p>
          </div>
        </div>
      </div>

      <div className={TALL_CARD_CLASSES.desktopView}>
        <div className="flex h-full w-full flex-col">
          <div className="flex h-[186px] items-end">
            <div ref={titleWrapRef} className="relative flex w-full flex-col pb-1">
              <DesktopCenterOverlayIcon title={card.title} icon={card.icon} left={TALL_CARD_CLASSES.desktopIconLeft} />
              <span
                ref={titleMeasureRef}
                aria-hidden
                className={TALL_CARD_CLASSES.desktopTitleMeasure}
              >
                {card.title}
              </span>
              <h3 className={cx(SOLUTION_CARD_CLASSES.desktopTitle, TALL_CARD_CLASSES.desktopTitle)}>{desktopTitle}</h3>
              <p className={SOLUTION_CARD_CLASSES.desktopDescription}>{card.description}</p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-end">
            <div className={cx(SOLUTION_CARD_CLASSES.imageShell, 'h-[280px]')}>
              <img
                src={card.previewImage}
                alt={card.title}
                className="absolute inset-0 h-full w-full scale-[1.1] object-contain object-bottom"
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
  const [topLeftCard, bottomLeftCard] = LEFT_WEB_SOLUTION_CARDS;

  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-24" id="siti-web">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 md:px-8">
        <SectionHeader
          className="mb-12 max-w-2xl lg:mb-16"
          title="Siti Web"
          subtitle="Progettate per la massima conversione della tua attività."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LeftSolutionCard card={topLeftCard} />
          <RightSolutionCard card={RIGHT_WEB_SOLUTION_CARD} />
          <LeftSolutionCard card={bottomLeftCard} />
        </div>
      </div>
    </section>
  );
}
