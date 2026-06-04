import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import SectionShell from '../ui/SectionShell';
import { SOLUTION_CARD_SURFACE_CLASS, getLightSolutionCardSurfaceStyle } from './cardSurface';
import wordpressLogo from '../../../media/icons/wordpress.png';
import customWebAppImage from '../../../media/images/custom_web_app.png';
import ecommerceImage from '../../../media/images/ecommerce.png';
import seoOrientedImage from '../../../media/images/seo_oriented.png';
import { cx } from '../../lib/classNames';

const WORDPRESS_TITLE = 'Soluzioni WordPress';
const WEB_CARD_SURFACE_OPACITY = 0.2;
const WEB_CARD_SURFACE_HOVER_OPACITY = 0.7;
const WEB_CARD_SURFACE_STYLE = getLightSolutionCardSurfaceStyle(
  WEB_CARD_SURFACE_OPACITY,
  WEB_CARD_SURFACE_HOVER_OPACITY
);
const SOLUTION_CARD_CLASSES = {
  shell: [
    'group relative flex min-h-[88px] items-center',
    SOLUTION_CARD_SURFACE_CLASS,
    'sm:min-h-[144px] md:min-h-[192px]'
  ].join(' '),
  stackedRow: [
    'relative z-10 flex w-full items-center gap-3 px-5 py-2.5',
    'sm:gap-4 sm:px-7 sm:py-3 md:px-8 lg:hidden'
  ].join(' '),
  imageShell: 'relative w-full overflow-hidden bg-transparent',
  badgeTopLeft: 'top-4 left-5 sm:top-5 sm:left-7 md:left-8 lg:top-6 lg:left-7',
  stackedTitle:
    'font-headline text-[1.22rem] font-extrabold leading-[1.08] text-[#071d3d] sm:text-[1.44rem] md:text-[1.44rem]',
  stackedDescription:
    'font-body text-[0.86rem] font-medium leading-[1.62] text-[#2b3b59] sm:text-[0.91rem] md:text-[0.91rem]',
  desktopTitle:
    'font-headline text-[1.54rem] font-extrabold leading-[1.08] text-[#071d3d] xl:text-[1.68rem]',
  desktopDescription:
    'max-w-[34ch] font-body text-[0.93rem] font-medium leading-[1.72] text-[#2b3b59] xl:text-[0.98rem]'
};
const HORIZONTAL_CARD_CLASSES = {
  shell: 'lg:col-span-2 lg:block lg:h-[284px]',
  stackedTextColumn: 'min-w-0 flex-1 pr-1 text-left sm:pr-2',
  stackedTextWrap: 'relative mr-auto max-w-[31ch] sm:max-w-[34ch]',
  stackedPreviewFrame: 'shrink-0 w-[44%] sm:w-[38%] md:w-[32%] -mr-4 sm:-mr-5 md:-mr-5',
  stackedPreviewRatio: 'aspect-square',
  stackedPreviewImage: 'object-contain object-center',
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
  stackedPreviewFrame: '-ml-2.5 w-[44%] shrink-0 sm:-ml-3.5 sm:w-[38%] md:-ml-3.5 md:w-[32%]',
  stackedTextColumn: 'min-w-0 flex-1 text-right sm:pl-1 md:pl-2',
  stackedTextWrap: 'relative ml-auto max-w-[31ch] sm:max-w-[34ch]',
  desktopView: 'relative z-10 hidden h-full px-7 py-6 lg:flex',
  desktopTextBlock: 'pb-1'
};

const horizontalStackedPreview = {
  frameClassName: HORIZONTAL_CARD_CLASSES.stackedPreviewFrame,
  imageClassName: HORIZONTAL_CARD_CLASSES.stackedPreviewImage,
  ratioClassName: HORIZONTAL_CARD_CLASSES.stackedPreviewRatio
};
const defaultHorizontalStacked = {
  previewSide: 'right',
  textColumnClassName: HORIZONTAL_CARD_CLASSES.stackedTextColumn,
  textWrapClassName: HORIZONTAL_CARD_CLASSES.stackedTextWrap
};

const WEB_SOLUTION_CARDS = [
  {
    id: 'custom-web-app',
    icon: 'code_blocks',
    eyebrow: 'Sviluppo Web',
    title: 'Siti Web Personalizzati',
    description: "Piattaforme moderne e d'impatto, costruite per dare valore al tuo business.",
    previewImage: customWebAppImage,
    shellClassName: HORIZONTAL_CARD_CLASSES.shell,
    badgeClassName: SOLUTION_CARD_CLASSES.badgeTopLeft,
    stacked: defaultHorizontalStacked,
    stackedPreview: {
      ...horizontalStackedPreview,
      src: customWebAppImage
    },
    desktop: {
      type: 'horizontal',
      previewFrameClassName: cx(
        HORIZONTAL_CARD_CLASSES.desktopPreviewFrame,
        HORIZONTAL_CARD_CLASSES.desktopPreviewRight
      ),
      previewImageClassName: 'scale-[1.2] object-[52%_50%]',
      textAlign: 'left',
      textWrapClassName: HORIZONTAL_CARD_CLASSES.desktopTextWrap
    }
  },
  {
    id: 'ecommerce',
    icon: 'shopping_cart',
    eyebrow: 'Vendita Online',
    title: 'Piattaforme E-Commerce',
    description:
      'Negozi online ad alta conversione con catalogo chiaro, checkout fluido e pagamenti sicuri.',
    previewImage: ecommerceImage,
    shellClassName: TALL_CARD_CLASSES.shell,
    badgeClassName: 'top-4 right-5 sm:top-5 sm:right-7 md:right-8 lg:top-6 lg:left-7 lg:right-auto',
    stacked: {
      align: 'right',
      previewSide: 'left',
      textColumnClassName: TALL_CARD_CLASSES.stackedTextColumn,
      textWrapClassName: TALL_CARD_CLASSES.stackedTextWrap,
      titleClassName:
        'whitespace-nowrap !text-[0.9rem] min-[380px]:!text-[0.96rem] min-[430px]:!text-[1.22rem] sm:!text-[1.44rem] md:!text-[1.44rem]'
    },
    stackedPreview: {
      frameClassName: TALL_CARD_CLASSES.stackedPreviewFrame,
      imageClassName:
        'scale-[0.88] object-contain object-left-top sm:scale-100 -translate-x-3 sm:-translate-x-0',
      ratioClassName: 'aspect-square',
      src: ecommerceImage
    },
    desktop: {
      type: 'tall',
      previewFrameClassName: 'h-[280px]',
      previewImageClassName: 'scale-[1.1] object-contain object-bottom',
      titleClassName:
        'max-w-[12ch] whitespace-normal text-balance !text-[1.38rem] !leading-[1.05] xl:!text-[1.5rem]'
    }
  },
  {
    id: 'wordpress-seo',
    icon: 'web',
    iconType: 'wordpress',
    eyebrow: 'CMS & SEO',
    title: WORDPRESS_TITLE,
    description: 'Siti con ottimizzazione del SEO e massima visibilità sui motori di ricerca.',
    previewImage: seoOrientedImage,
    shellClassName: HORIZONTAL_CARD_CLASSES.shell,
    badgeClassName: cx(SOLUTION_CARD_CLASSES.badgeTopLeft, 'lg:left-auto lg:right-7'),
    stacked: defaultHorizontalStacked,
    stackedPreview: {
      ...horizontalStackedPreview,
      src: seoOrientedImage
    },
    desktop: {
      type: 'horizontal',
      previewFrameClassName: cx(
        HORIZONTAL_CARD_CLASSES.desktopPreviewFrame,
        HORIZONTAL_CARD_CLASSES.desktopPreviewLeft
      ),
      previewImageClassName: 'scale-[1.12] object-[48%_50%]',
      textAlign: 'right',
      textWrapClassName: cx(
        HORIZONTAL_CARD_CLASSES.desktopTextWrap,
        HORIZONTAL_CARD_CLASSES.desktopTextWrapReversed
      )
    }
  }
];

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

function SolutionBadge({ card, className = '' }) {
  return (
    <span
      className={cx(
        'pointer-events-none absolute z-20 inline-flex max-w-[calc(100%_-_2.5rem)] items-center overflow-hidden rounded-[1rem] bg-[#203658] text-[#95e3ff] opacity-90 sm:rounded-[1.2rem]',
        'sm:max-w-[calc(100%_-_3.5rem)] md:max-w-[calc(100%_-_4rem)]',
        className
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.9rem] sm:h-9 sm:w-9 sm:rounded-[1.1rem]">
        {card.iconType === 'wordpress' ? (
          <WordpressMaskedIcon className="h-4 w-4 bg-[#95e3ff] sm:h-5 sm:w-5" />
        ) : (
          <span className="material-symbols-outlined fill solution-badge-material-icon leading-none text-[#95e3ff]">
            {card.icon}
          </span>
        )}
      </span>
      <span className="truncate px-2 pr-3 font-label text-[0.64rem] font-black uppercase tracking-[0.08em] text-[#95e3ff] sm:px-2.5 sm:pr-3.5 sm:text-[0.74rem]">
        {card.eyebrow}
      </span>
    </span>
  );
}

function SolutionTextPanel({
  title,
  titleClassName,
  description,
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
      <h3 className={titleClassName}>{title}</h3>
      <span
        aria-hidden
        className={cx(
          'my-2.5 h-[3px] w-20 rounded-full bg-[#203658] md:my-3 lg:my-4',
          align === 'right' && 'self-end'
        )}
      />
      <p className={descriptionClassName}>{description}</p>
    </div>
  );
}

function SolutionCardShell({
  children,
  className,
  isTouched,
  onTouchStart,
  onTouchEnd,
  onTouchCancel
}) {
  return (
    <article
      className={cx(
        SOLUTION_CARD_CLASSES.shell,
        className,
        isTouched && 'solution-card-surface--touched'
      )}
      style={WEB_CARD_SURFACE_STYLE}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      {children}
    </article>
  );
}

function SolutionPreview({ alt, className = '', imageClassName = '', src }) {
  return (
    <div className={cx(SOLUTION_CARD_CLASSES.imageShell, className)}>
      <img
        alt={alt}
        className={cx('absolute inset-0 h-full w-full opacity-90', imageClassName)}
        decoding="async"
        loading="lazy"
        src={src}
      />
    </div>
  );
}

function StackedSolutionBody({
  align = 'left',
  description,
  preview,
  previewSide = 'right',
  textColumnClassName,
  textWrapClassName,
  title,
  titleClassName
}) {
  const text = (
    <div className={textColumnClassName}>
      <div className={textWrapClassName}>
        <SolutionTextPanel
          align={align}
          description={description}
          descriptionClassName={SOLUTION_CARD_CLASSES.stackedDescription}
          title={title}
          titleClassName={cx(SOLUTION_CARD_CLASSES.stackedTitle, titleClassName)}
        />
      </div>
    </div>
  );

  return (
    <div className={SOLUTION_CARD_CLASSES.stackedRow}>
      {previewSide === 'left' ? preview : null}
      {text}
      {previewSide === 'right' ? preview : null}
    </div>
  );
}

function HorizontalDesktopBody({ card }) {
  return (
    <div className={HORIZONTAL_CARD_CLASSES.desktopView}>
      <div className="flex h-full flex-col justify-center">
        <div className={card.desktop.textWrapClassName}>
          <SolutionTextPanel
            align={card.desktop.textAlign}
            className="w-full"
            description={card.description}
            descriptionClassName={cx(
              SOLUTION_CARD_CLASSES.desktopDescription,
              HORIZONTAL_CARD_CLASSES.desktopDescription
            )}
            title={card.desktop.title ?? card.title}
            titleClassName={SOLUTION_CARD_CLASSES.desktopTitle}
          />
        </div>
      </div>

      <div className={card.desktop.previewFrameClassName}>
        <SolutionPreview
          alt={card.title}
          className="h-[240px] sm:h-[280px] lg:h-full"
          imageClassName={cx('object-contain', card.desktop.previewImageClassName)}
          src={card.previewImage}
        />
      </div>
    </div>
  );
}

function TallDesktopBody({ card }) {
  return (
    <div className={TALL_CARD_CLASSES.desktopView}>
      <div className="flex h-full w-full flex-col">
        <div className="flex h-[250px] items-start pt-[13px]">
          <div className={cx('relative flex w-full flex-col', TALL_CARD_CLASSES.desktopTextBlock)}>
            <SolutionTextPanel
              title={card.desktop.title ?? card.title}
              titleClassName={cx(SOLUTION_CARD_CLASSES.desktopTitle, card.desktop.titleClassName)}
              description={card.description}
              descriptionClassName={SOLUTION_CARD_CLASSES.desktopDescription}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-end">
          <SolutionPreview
            alt={card.title}
            className={card.desktop.previewFrameClassName}
            imageClassName={card.desktop.previewImageClassName}
            src={card.previewImage}
          />
        </div>
      </div>
    </div>
  );
}

function SolutionCard({ card }) {
  const [isTouched, setIsTouched] = useState(false);
  const stackedPreview = (
    <div className={card.stackedPreview.frameClassName}>
      <SolutionPreview
        alt={card.title}
        className={card.stackedPreview.ratioClassName}
        imageClassName={card.stackedPreview.imageClassName}
        src={card.stackedPreview.src}
      />
    </div>
  );

  return (
    <SolutionCardShell
      className={card.shellClassName}
      isTouched={isTouched}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
      onTouchCancel={() => setIsTouched(false)}
    >
      <SolutionBadge card={card} className={card.badgeClassName} />
      <StackedSolutionBody
        align={card.stacked.align}
        description={card.description}
        preview={stackedPreview}
        previewSide={card.stacked.previewSide}
        textColumnClassName={card.stacked.textColumnClassName}
        textWrapClassName={card.stacked.textWrapClassName}
        title={card.stacked.title ?? card.title}
        titleClassName={card.stacked.titleClassName}
      />
      {card.desktop.type === 'tall' ? (
        <TallDesktopBody card={card} />
      ) : (
        <HorizontalDesktopBody card={card} />
      )}
    </SolutionCardShell>
  );
}

export default function WebSolutionsSection() {
  return (
    <SectionShell id="siti-web" variant="web">
      <SectionHeader
        className="mb-12 max-w-2xl lg:mb-16"
        title="Siti Web"
        subtitle="Progettate per la massima conversione della tua attività."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {WEB_SOLUTION_CARDS.map((card) => (
          <SolutionCard key={card.id} card={card} />
        ))}
      </div>
    </SectionShell>
  );
}
