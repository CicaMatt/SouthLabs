import { useEffect, useRef, useState } from 'react';
import logoImage from '../../../media/logo/logo_image.png';
import logoText from '../../../media/logo/logo_text.png';

const NAV_DESKTOP_MIN_WIDTH = 768;
const MOBILE_MENU_FADE_MS = 280;
const NAV_SCROLL_DELTA_PX = 4;
const NAV_SCROLL_REVEAL_PX = 28;
const NAV_SCROLL_TOP_BUFFER_PX = 8;

const NAV_LINKS = [
  { href: '#siti-web', label: 'Siti Web', tabletLines: ['Siti', 'Web'] },
  {
    href: '#software-automazione',
    label: 'Software e Automazione',
    tabletLines: ['Software e', 'Automazione']
  },
  {
    href: '#infrastrutture-hardware',
    label: 'Infrastrutture Hardware',
    tabletLines: ['Infrastrutture', 'Hardware']
  },
  {
    href: '#manutenzione-supporto',
    label: 'Manutenzione e Supporto',
    tabletLines: ['Manutenzione', 'e Supporto']
  }
];

const NAVBAR_CLASS = ['sticky top-0 w-full z-50', 'site-surface', 'top-nav-surface'].join(' ');
const NAV_CONTENT_CLASS =
  'relative max-w-7xl mx-auto h-full flex items-center justify-between px-5 min-[1116px]:px-8';
const DESKTOP_LINK_CLASS = [
  'relative text-center text-[13px] font-semibold leading-tight tracking-[0.01em]',
  'px-1 py-2 text-[#d4dbea] transition-all duration-300 hover:text-white',
  'min-[1116px]:text-[14px]',
  'after:pointer-events-none after:absolute after:left-1 after:right-1 after:bottom-1 after:h-[2px]',
  'after:origin-left after:scale-x-0 after:bg-[#95e3ff] after:transition-transform after:duration-300 after:ease-out',
  'hover:after:scale-x-100'
].join(' ');
const MOBILE_LINK_CLASS = [
  'group relative flex min-h-12 items-center justify-between rounded-xl px-4',
  'text-[14px] font-semibold text-[#d4dbea]',
  'transition-colors hover:text-white',
  'before:pointer-events-none before:absolute before:inset-x-1 before:inset-y-1.5 before:rounded-xl',
  'before:bg-[#95e3ff]/0 before:transition-colors hover:before:bg-[#95e3ff]/[0.05] active:before:bg-[#95e3ff]/10'
].join(' ');
const MOBILE_LINK_SEPARATOR_CLASS =
  'after:pointer-events-none after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:bg-[#95e3ff]/15';
const CONTACT_CTA_CLASS = [
  'hero-consultancy-cta inline-flex items-center justify-center px-3.5 py-2 rounded-md text-xs min-[1116px]:text-sm font-medium',
  'whitespace-nowrap transition-all duration-300 bg-[#95e3ff] text-[#06222a]',
  'shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95',
  'min-[1116px]:px-5 md:py-2.5 mr-3'
].join(' ');
const MOBILE_MENU_BUTTON_CLASS = [
  'md:hidden inline-flex items-center justify-center h-10 w-10',
  'rounded-lg text-[#d4dbea] hover:bg-white/10 hover:text-white transition-colors'
].join(' ');

function BrandLogo({ onNavigate }) {
  const handleClick = (event) => {
    event.preventDefault();
    onNavigate();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <a
      aria-label="SouthLabs - torna alla sezione principale"
      className="md:ml-2 flex items-center gap-1.5 min-[1116px]:gap-2.5"
      href="#hero"
      onClick={handleClick}
    >
      <img
        alt="Logo"
        aria-hidden="true"
        className="h-16 md:h-19 w-auto object-contain object-center"
        decoding="async"
        fetchPriority="high"
        src={logoImage}
      />
      <div>
        <img
          alt="SouthLabs"
          aria-hidden="true"
          className="top-nav-logo-text translate-y-0.25 h-9.25 md:h-10.5 w-auto"
          decoding="async"
          fetchPriority="high"
          src={logoText}
        />
      </div>
    </a>
  );
}

// Desktop/tablet navigation uses two-line labels on tablet to preserve spacing.
function DesktopNavLinks() {
  return (
    <div
      className="hidden md:flex md:flex-1 items-center justify-around gap-4 md:px-4 min-[1116px]:gap-6 min-[1116px]:px-12 xl:px-20"
    >
      {NAV_LINKS.map((link) => (
        <a key={link.href} className={DESKTOP_LINK_CLASS} href={link.href}>
          <span className="hidden min-[1116px]:inline">{link.label}</span>
          <span className="block min-[1116px]:hidden whitespace-nowrap">
            <span className="block">{link.tabletLines[0]}</span>
            <span className="block">{link.tabletLines[1]}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

// Inline SVG avoids another icon dependency for the mobile menu toggle.
function MenuIcon({ isOpen }) {
  return isOpen ? (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

// Parent owns open/close state; close handler is passed down.
function MobileNavMenu({ isVisible, menuRef, onNavigate }) {
  return (
    <div
      ref={menuRef}
      aria-hidden={!isVisible}
      className={[
        'md:hidden absolute top-[calc(100%+0.65rem)] left-4 right-4 overflow-hidden rounded-2xl p-2',
        'top-nav-mobile-menu',
        'origin-top transition-[opacity,transform] duration-[280ms] ease-out motion-reduce:transition-none',
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0'
      ].join(' ')}
      id="mobile-nav-menu"
      inert={isVisible ? undefined : ''}
    >
      <div className="flex flex-col">
        {NAV_LINKS.map((link, index) => (
          <a
            key={link.href}
            className={[
              MOBILE_LINK_CLASS,
              index < NAV_LINKS.length - 1 && MOBILE_LINK_SEPARATOR_CLASS
            ]
              .filter(Boolean)
              .join(' ')}
            href={link.href}
            onClick={onNavigate}
            tabIndex={isVisible ? undefined : -1}
          >
            <span className="relative z-10 after:pointer-events-none after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#95e3ff] after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100">
              {link.label}
            </span>
            <span className="material-symbols-outlined relative z-10 text-[18px] text-[#95e3ff] transition-all group-hover:translate-x-0.5 group-hover:text-white">
              arrow_forward
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function TopNavBar() {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const upwardScrollRef = useRef(0);
  const scrollFrameRef = useRef(0);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= NAV_DESKTOP_MIN_WIDTH) {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuMounted(true);
      setIsMobileMenuVisible(false);

      let enterFrame = 0;
      const mountFrame = requestAnimationFrame(() => {
        enterFrame = requestAnimationFrame(() => setIsMobileMenuVisible(true));
      });

      return () => {
        cancelAnimationFrame(mountFrame);
        if (enterFrame) cancelAnimationFrame(enterFrame);
      };
    }

    setIsMobileMenuVisible(false);
    const timer = setTimeout(() => setIsMobileMenuMounted(false), MOBILE_MENU_FADE_MS);
    return () => clearTimeout(timer);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const isInsideMenuControls = (target) =>
      target instanceof Node &&
      (mobileMenuRef.current?.contains(target) || mobileMenuButtonRef.current?.contains(target));
    const closeOnOutsidePointer = (event) => {
      if (!isInsideMenuControls(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    const closeOnScroll = () => setIsMobileMenuOpen(false);

    document.addEventListener('pointerdown', closeOnOutsidePointer, { capture: true });
    document.addEventListener('click', closeOnOutsidePointer, { capture: true });
    window.addEventListener('scroll', closeOnScroll, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer, { capture: true });
      document.removeEventListener('click', closeOnOutsidePointer, { capture: true });
      window.removeEventListener('scroll', closeOnScroll);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    lastScrollYRef.current = Math.max(window.scrollY, 0);

    const updateNavVisibility = () => {
      scrollFrameRef.current = 0;

      const currentY = Math.max(window.scrollY, 0);
      const deltaY = currentY - lastScrollYRef.current;
      const navHeight = navRef.current?.offsetHeight ?? 72;

      if (currentY <= NAV_SCROLL_TOP_BUFFER_PX) {
        upwardScrollRef.current = 0;
        setIsNavHidden(false);
      } else if (deltaY > NAV_SCROLL_DELTA_PX && currentY > navHeight) {
        upwardScrollRef.current = 0;
        setIsNavHidden(true);
      } else if (deltaY < 0) {
        upwardScrollRef.current += Math.abs(deltaY);

        if (upwardScrollRef.current >= NAV_SCROLL_REVEAL_PX) {
          setIsNavHidden(false);
        }
      } else if (deltaY > 0) {
        upwardScrollRef.current = 0;
      }

      lastScrollYRef.current = currentY;
    };

    const handleScroll = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = requestAnimationFrame(updateNavVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) setIsNavHidden(false);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const navClassName = [NAVBAR_CLASS, isNavHidden && 'top-nav-surface--hidden']
    .filter(Boolean)
    .join(' ');

  return (
    <nav ref={navRef} className={navClassName} onFocusCapture={() => setIsNavHidden(false)}>
      <div className={NAV_CONTENT_CLASS}>
        <BrandLogo onNavigate={closeMobileMenu} />
        <DesktopNavLinks />

        <div className="flex items-center gap-2 min-[1116px]:gap-3">
          <a className={CONTACT_CTA_CLASS} href="#contatti" onClick={closeMobileMenu}>
            <span className="cta-underline-label">Contattaci</span>
          </a>

          <button
            ref={mobileMenuButtonRef}
            aria-controls="mobile-nav-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Chiudi menu mobile' : 'Apri menu mobile'}
            className={MOBILE_MENU_BUTTON_CLASS}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            type="button"
          >
            <MenuIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>

        {isMobileMenuMounted ? (
          <MobileNavMenu
            isVisible={isMobileMenuVisible}
            menuRef={mobileMenuRef}
            onNavigate={closeMobileMenu}
          />
        ) : null}
      </div>
    </nav>
  );
}
