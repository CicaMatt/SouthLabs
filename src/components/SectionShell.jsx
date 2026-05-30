import {
  SOFTWARE_SECTION_THEME_COLOR,
  SOFTWARE_SECTION_THEME_RGB_CSS
} from '../hooks/sectionGrid/themes';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const SECTION_PADDING_CLASS = {
  default: 'py-[5.5rem] lg:py-[6.75rem]',
  compact: 'py-[4.5rem] lg:py-[5.25rem]',
  hero: 'pt-16 pb-28 lg:py-[5.75rem] 2xl:py-32'
};

const SECTION_WIDTH_CLASS = {
  standard: 'max-w-7xl',
  narrow: 'max-w-3xl'
};

const SOFTWARE_SECTION_GRID_OPACITY = 0.06;

const SECTION_VARIANTS = {
  hero: {
    className: 'hero-shell relative isolate overflow-hidden',
    contentClassName: 'relative z-10',
    grid: false,
    padding: 'hero'
  },
  web: {
    className: 'relative overflow-hidden',
    contentClassName: 'relative',
    padding: 'compact'
  },
  software: {
    className: 'relative',
    contentClassName: 'relative z-10',
    style: {
      '--section-grid-color': `rgba(32, 54, 88, ${SOFTWARE_SECTION_GRID_OPACITY})`,
      '--section-grid-highlight-color': SOFTWARE_SECTION_THEME_COLOR,
      '--software-ai-accent': SOFTWARE_SECTION_THEME_COLOR,
      '--software-interaction-blue': SOFTWARE_SECTION_THEME_COLOR,
      '--software-interaction-blue-rgb': SOFTWARE_SECTION_THEME_RGB_CSS,
      '--software-support-blue': '#203658',
      '--software-support-blue-rgb': '32, 54, 88'
    }
  },
  support: {
    className: 'text-on-tertiary'
  },
  infrastructure: {},
  contact: {
    padding: 'compact',
    width: 'narrow'
  }
};

export const SECTION_CONTAINER_GUTTER_CLASS = 'mx-auto px-5 sm:px-6 md:px-8';

export function SectionBackground({ children, className = '' }) {
  return (
    <div aria-hidden="true" className={cx('absolute inset-0 z-0', className)}>
      {children}
    </div>
  );
}

export function SectionContent({ children, className = '', width = 'standard' }) {
  return (
    <div className={cx(SECTION_WIDTH_CLASS[width], SECTION_CONTAINER_GUTTER_CLASS, className)}>
      {children}
    </div>
  );
}

export default function SectionShell({
  background,
  backgroundClassName = '',
  children,
  className = '',
  contentClassName = '',
  grid,
  id,
  padding,
  style,
  variant,
  width,
  ...sectionProps
}) {
  const variantConfig = SECTION_VARIANTS[variant] ?? {};
  const resolvedGrid = grid ?? variantConfig.grid ?? true;
  const resolvedPadding = padding ?? variantConfig.padding ?? 'default';
  const resolvedWidth = width ?? variantConfig.width ?? 'standard';
  const resolvedStyle =
    style && variantConfig.style
      ? { ...variantConfig.style, ...style }
      : (style ?? variantConfig.style);

  return (
    <section
      className={cx(
        resolvedGrid && 'section-grid-bg',
        variant && `section-grid-bg--${variant}`,
        background && 'relative isolate overflow-hidden',
        SECTION_PADDING_CLASS[resolvedPadding],
        variantConfig.className,
        className
      )}
      id={id}
      style={resolvedStyle}
      {...sectionProps}
    >
      {background ? (
        <SectionBackground className={backgroundClassName}>{background}</SectionBackground>
      ) : null}

      <SectionContent
        className={cx(variantConfig.contentClassName, contentClassName)}
        width={resolvedWidth}
      >
        {children}
      </SectionContent>
    </section>
  );
}
