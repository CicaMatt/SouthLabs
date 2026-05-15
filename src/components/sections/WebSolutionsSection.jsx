import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../SectionHeader';
import SOLUTION_CARD_SURFACE_CLASS, { getSolutionCardSurfaceStyle } from './solutionCardSurface';
import wordpressLogo from '../../../media/icons/wordpress.png';
import customWebAppImage from '../../../media/images/custom_web_app.png';
import ecommerceImage from '../../../media/images/ecommerce.png';
import seoOrientedImage from '../../../media/images/seo_oriented.png';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const WORDPRESS_TITLE = 'Soluzioni WordPress';
const WEB_CARD_SURFACE_OPACITY = 0.1;
const WEB_CARD_SURFACE_HOVER_OPACITY = 0.7;
const TITLE_HOVER_EFFECT = 'web-solution-hover-text web-solution-hover-title';
const DESCRIPTION_HOVER_EFFECT = 'web-solution-hover-text web-solution-hover-description';
const SOLUTION_CARD_DESKTOP_QUERY = '(min-width: 1024px)';
const SOLUTION_CARD_CLASSES = {
  shell: [
    'group relative flex min-h-[100px] items-center',
    SOLUTION_CARD_SURFACE_CLASS,
    'sm:min-h-[188px] md:min-h-[218px]'
  ].join(' '),
  stackedRow: [
    'relative z-10 flex w-full items-center gap-3 px-5 py-2.5',
    'sm:gap-4 sm:px-7 sm:py-3 md:px-8 lg:hidden'
  ].join(' '),
  imageShell: 'relative w-full overflow-hidden bg-transparent',
  badgeTopLeft: 'top-4 left-5 sm:top-5 sm:left-7 md:left-8 lg:top-6 lg:left-7',
  stackedTitle: cx(
    'font-headline text-[1.12rem] font-extrabold leading-[1.08] text-[#071d3d] sm:text-[1.24rem] md:text-[1.44rem]',
    TITLE_HOVER_EFFECT
  ),
  stackedDescription: cx(
    'font-body text-[0.79rem] font-medium leading-[1.62] text-[#2b3b59] sm:text-[0.86rem] md:text-[0.91rem]',
    DESCRIPTION_HOVER_EFFECT
  ),
  desktopTitle: cx(
    'font-headline text-[1.54rem] font-extrabold leading-[1.08] text-[#071d3d] xl:text-[1.68rem]',
    TITLE_HOVER_EFFECT
  ),
  desktopDescription: cx(
    'max-w-[34ch] font-body text-[0.93rem] font-medium leading-[1.72] text-[#2b3b59] xl:text-[0.98rem]',
    DESCRIPTION_HOVER_EFFECT
  )
};
const HORIZONTAL_CARD_CLASSES = {
  shell: 'lg:col-span-2 lg:block lg:h-[284px]',
  stackedTextColumn: 'min-w-0 flex-1 pr-1 text-left sm:pr-2',
  stackedTextWrap: 'relative mr-auto max-w-[31ch] sm:max-w-[34ch]',
  stackedPreviewFrame: {
    square: 'shrink-0 w-[54%] sm:w-[52%] md:w-[36%] -mr-4 sm:-mr-5 md:-mr-5',
    wide: 'shrink-0 w-[52%] sm:w-[50%] md:w-[34%] -mr-2.5 sm:-mr-3.5 md:-mr-3.5'
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
  desktopTextWrap: 'relative flex flex-col lg:max-w-[57%]',
  desktopTextWrapReversed: 'lg:ml-auto lg:items-end lg:text-right',
  desktopPreviewFrame: 'w-full sm:max-w-none lg:absolute lg:bottom-6 lg:top-6 lg:w-[38%]',
  desktopPreviewLeft: 'lg:left-6',
  desktopPreviewRight: 'lg:right-6',
  desktopDescription: 'lg:min-h-[4.4rem]'
};
const TALL_CARD_CLASSES = {
  shell: 'lg:col-span-1 lg:block lg:row-span-2 lg:min-h-[592px]',
  stackedPreviewFrame: '-ml-2.5 w-[54%] shrink-0 sm:-ml-3.5 sm:w-[52%] md:-ml-3.5 md:w-[36%]',
  stackedTextColumn: 'min-w-0 flex-1 text-right sm:pl-1 md:pl-2',
  stackedTextWrap: 'relative ml-auto max-w-[31ch] sm:max-w-[34ch]',
  desktopView: 'relative z-10 hidden h-full px-7 py-6 lg:flex',
  desktopTitleMeasure: 'pointer-events-none absolute left-0 top-0 inline-block whitespace-nowrap font-headline text-[1.38rem] font-extrabold leading-[1.08] opacity-0 xl:text-[1.5rem]',
  desktopTitle: 'whitespace-nowrap',
  desktopTextBlock: 'pb-1'
};

const LEFT_WEB_SOLUTION_CARDS = [
  {
    icon: 'code_blocks',
    eyebrow: 'Sviluppo Web',
    title: 'Web App Personalizzate',
    description: 'Soluzioni personalizzate per garantire efficienza, sicurezza e flessibilità nel tempo.',
    mobileDescription: 'Soluzioni ad-hoc che garantiscono sicurezza, efficienza e flessibilità',
    previewImage: customWebAppImage,
    stackedPreviewImage: customWebAppImage,
    desktopPreviewScaleClass: 'scale-[1.2]',
    surfaceOpacity: WEB_CARD_SURFACE_OPACITY,
    surfaceHoverOpacity: WEB_CARD_SURFACE_HOVER_OPACITY
  },
  {
    icon: 'web',
    eyebrow: 'WordPress',
    title: WORDPRESS_TITLE,
    description: 'Siti vetrina ottimizzati per SEO e visibilità, veloci e gestibili in autonomia.',
    mobileDescription: 'Siti vetrina ottimizzati per SEO e visibilità',
    previewImage: seoOrientedImage,
    stackedPreviewImage: seoOrientedImage,
    desktopPreviewScaleClass: 'scale-[1.12]',
    surfaceOpacity: WEB_CARD_SURFACE_OPACITY,
    surfaceHoverOpacity: WEB_CARD_SURFACE_HOVER_OPACITY
  }
];

const RIGHT_WEB_SOLUTION_CARD = {
  icon: 'shopping_cart',
  eyebrow: 'E-Commerce',
  title: 'Piattaforme E-Commerce',
  description: 'Portali di vendita online sicuri ed efficaci, integrabili con i più noti metodi di pagamento.',
  mobileDescription: 'Portali di vendita online sicuri ed efficaci',
  previewImage: ecommerceImage,
  surfaceOpacity: WEB_CARD_SURFACE_OPACITY,
  surfaceHoverOpacity: WEB_CARD_SURFACE_HOVER_OPACITY
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

      const isDesktop = window.matchMedia(SOLUTION_CARD_DESKTOP_QUERY).matches;
      if (!isDesktop) {
        setUseShortTitle(false);
        return;
      }

      const availableWidth = wrap.getBoundingClientRect().width;
      const fullTitleWidth = measure.getBoundingClientRect().width;
      setUseShortTitle(fullTitleWidth > availableWidth);
    };

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(evaluateTitleFit);
    if (titleWrapRef.current) resizeObserver?.observe(titleWrapRef.current);

    window.addEventListener('resize', evaluateTitleFit);
    evaluateTitleFit();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', evaluateTitleFit);
    };
  }, []);

  return { titleWrapRef, titleMeasureRef, useShortTitle };
}

function ResponsiveSolutionDescription({ description, mobileDescription }) {
  return (
    <>
      <span className="md:hidden">{mobileDescription ?? description}</span>
      <span className="hidden md:inline">{description}</span>
    </>
  );
}

function SolutionBadge({ card, className = '' }) {
  const isWordpress = card.title === WORDPRESS_TITLE;

  return (
    <span
      className={cx(
        'pointer-events-none absolute z-20 inline-flex max-w-[calc(100%_-_2.5rem)] items-center overflow-hidden rounded-[1rem] bg-[#dce8fb] text-[#0a46c4] sm:rounded-[1.2rem]',
        'shadow-[inset_0_0_0_0.5px_rgba(10,70,196,0.13)]',
        'sm:max-w-[calc(100%_-_3.5rem)] md:max-w-[calc(100%_-_4rem)]',
        className
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.9rem] bg-[#dce8fb] sm:h-9 sm:w-9 sm:rounded-[1.1rem]">
        {isWordpress ? (
          <WordpressMaskedIcon className="h-4 w-4 bg-[#0a46c4] sm:h-5 sm:w-5" />
        ) : (
          <span className="material-symbols-outlined fill text-[18px] leading-none text-[#0a46c4] sm:text-[22px]">
            {card.icon}
          </span>
        )}
      </span>
      <span className="truncate px-2 pr-3 font-label text-[0.58rem] font-extrabold uppercase tracking-[0.08em] sm:px-2.5 sm:pr-3.5 sm:text-[0.68rem]">
        {card.eyebrow}
      </span>
    </span>
  );
}

function SolutionTextPanel({
  title,
  titleRef,
  titleClassName,
  description,
  descriptionRef,
  descriptionClassName,
  align = 'left',
  className = ''
}) {
  return (
    <div
      className={cx(
        'relative z-10 flex min-w-0 flex-col pt-14 sm:pt-[60px] lg:pt-16',
        align === 'right' && 'items-end text-right',
        className
      )}
    >
      <h3 ref={titleRef} className={titleClassName}>
        {title}
      </h3>
      <span
        aria-hidden
        className={cx('my-2.5 h-[3px] w-20 rounded-full bg-[#b9cce6] md:my-3 lg:my-4', align === 'right' && 'self-end')}
      />
      <p ref={descriptionRef} className={descriptionClassName}>
        {description}
      </p>
    </div>
  );
}

function LeftSolutionCard({ card }) {
  const isWordpressCard = card.title === WORDPRESS_TITLE;
  const hasStackedPreviewImage = Boolean(card.stackedPreviewImage);
  const stackedPreviewMode = hasStackedPreviewImage ? 'square' : 'wide';
  const previewPositionClass = isWordpressCard ? 'object-[48%_50%]' : 'object-[52%_50%]';
  const desktopTextAlign = isWordpressCard ? 'right' : 'left';
  const badgeClassName = cx(
    SOLUTION_CARD_CLASSES.badgeTopLeft,
    isWordpressCard && 'lg:left-auto lg:right-7'
  );

  return (
    <article
      className={cx(SOLUTION_CARD_CLASSES.shell, HORIZONTAL_CARD_CLASSES.shell)}
      style={getSolutionCardSurfaceStyle(card.surfaceOpacity, card.surfaceHoverOpacity)}
    >
      <SolutionBadge card={card} className={badgeClassName} />

      <div className={SOLUTION_CARD_CLASSES.stackedRow}>
        <div className={HORIZONTAL_CARD_CLASSES.stackedTextColumn}>
          <div className={HORIZONTAL_CARD_CLASSES.stackedTextWrap}>
            <SolutionTextPanel
              title={card.title}
              titleClassName={SOLUTION_CARD_CLASSES.stackedTitle}
              descriptionClassName={SOLUTION_CARD_CLASSES.stackedDescription}
              description={(
                <ResponsiveSolutionDescription description={card.description} mobileDescription={card.mobileDescription} />
              )}
            />
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
            className={cx(
              HORIZONTAL_CARD_CLASSES.desktopTextWrap,
              isWordpressCard && HORIZONTAL_CARD_CLASSES.desktopTextWrapReversed
            )}
          >
            <SolutionTextPanel
              title={card.title}
              titleClassName={SOLUTION_CARD_CLASSES.desktopTitle}
              description={card.description}
              descriptionClassName={cx(SOLUTION_CARD_CLASSES.desktopDescription, HORIZONTAL_CARD_CLASSES.desktopDescription)}
              align={desktopTextAlign}
              className="w-full"
            />
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

function RightSolutionCard({ card }) {
  const { titleWrapRef, titleMeasureRef, useShortTitle } = useDesktopTitleFit();
  const desktopTitle = useShortTitle ? 'E-Commerce' : card.title;

  return (
    <article
      className={cx(SOLUTION_CARD_CLASSES.shell, TALL_CARD_CLASSES.shell)}
      style={getSolutionCardSurfaceStyle(card.surfaceOpacity, card.surfaceHoverOpacity)}
    >
      <SolutionBadge
        card={card}
        className="top-4 right-5 sm:top-5 sm:right-7 md:right-8 lg:top-6 lg:left-7 lg:right-auto"
      />

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
          <div className={TALL_CARD_CLASSES.stackedTextWrap}>
            <SolutionTextPanel
              title={<>Piattaforme <span className="whitespace-nowrap">E-Commerce</span></>}
              titleClassName={SOLUTION_CARD_CLASSES.stackedTitle}
              descriptionClassName={SOLUTION_CARD_CLASSES.stackedDescription}
              align="right"
              description={(
                <ResponsiveSolutionDescription description={card.description} mobileDescription={card.mobileDescription} />
              )}
            />
          </div>
        </div>
      </div>

      <div className={TALL_CARD_CLASSES.desktopView}>
        <div className="flex h-full w-full flex-col">
          <div className="flex h-[250px] items-start pt-[13px]">
            <div ref={titleWrapRef} className={cx('relative flex w-full flex-col', TALL_CARD_CLASSES.desktopTextBlock)}>
              <span
                ref={titleMeasureRef}
                aria-hidden
                className={TALL_CARD_CLASSES.desktopTitleMeasure}
              >
                {card.title}
              </span>
              <SolutionTextPanel
                title={desktopTitle}
                titleClassName={cx(SOLUTION_CARD_CLASSES.desktopTitle, TALL_CARD_CLASSES.desktopTitle)}
                description={card.description}
                descriptionClassName={SOLUTION_CARD_CLASSES.desktopDescription}
              />
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

export default function WebSolutionsSection() {
  const [topLeftCard, bottomLeftCard] = LEFT_WEB_SOLUTION_CARDS;

  return (
    <section className="section-grid-bg section-grid-bg--web relative overflow-hidden py-[4.5rem] lg:py-[5.25rem]" id="siti-web">
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
