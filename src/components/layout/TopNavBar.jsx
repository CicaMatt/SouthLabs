import { useEffect, useState } from 'react';
import logoImage from '../../../media/logo/logo_image.png';
import logoText from '../../../media/logo/logo_text.png';

const NAV_DESKTOP_MIN_WIDTH = 768;
const MOBILE_MENU_FADE_MS = 280;

// Navigation labels and anchors are the source of truth for desktop and mobile menus.
const NAV_LINKS = [
  { href: '#siti-web', label: 'Siti Web', tabletLines: ['Siti', 'Web'] },
  { href: '#software-automazione', label: 'Software e Automazione', tabletLines: ['Software e', 'Automazione'] },
  { href: '#infrastrutture-hardware', label: 'Infrastrutture Hardware', tabletLines: ['Infrastrutture', 'Hardware'] },
  { href: '#manutenzione-supporto', label: 'Manutenzione e Supporto', tabletLines: ['Manutenzione', 'e Supporto'] }
];

const NAVBAR_CLASS = [
  'fixed top-0 w-full h-16 lg:h-20 z-50',
  'bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl',
  'shadow-[0_4px_20px_rgba(19,27,46,0.04)] dark:shadow-none bg-white dark:bg-slate-900'
].join(' ');
const NAV_CONTENT_CLASS = 'relative max-w-7xl mx-auto h-full flex items-center justify-between px-5 lg:px-8';
const DESKTOP_LINK_CLASS = [
  'font-headline text-center text-[13px] font-semibold leading-tight tracking-tight',
  'text-on-surface-variant transition-all duration-300 hover:text-blue-700',
  'dark:text-slate-400 dark:hover:text-blue-300 lg:text-[14px]'
].join(' ');
const MOBILE_LINK_CLASS = [
  'group flex min-h-12 items-center justify-between rounded-lg px-4',
  'font-headline text-[14px] font-semibold text-on-background',
  'transition-colors hover:bg-blue-100/70 hover:text-blue-800 active:bg-blue-100',
  'dark:text-slate-100 dark:hover:bg-blue-400/15 dark:hover:text-blue-100 dark:active:bg-blue-400/20'
].join(' ');
const CONTACT_CTA_CLASS = [
  'inline-flex items-center justify-center px-3.5 py-2 rounded-md text-xs lg:text-sm font-medium',
  'whitespace-nowrap transition-all duration-200 active:scale-95',
  'bg-[#0947a5] text-white hover:bg-[#073f93]',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:opacity-90 lg:px-6 lg:py-2.5'
].join(' ');
const MOBILE_MENU_BUTTON_CLASS = [
  'md:hidden inline-flex items-center justify-center h-10 w-10',
  'rounded-lg text-primary hover:bg-primary/10 transition-colors'
].join(' ');

// Combines the icon and text mark while exposing one accessible brand link.
function BrandLogo({ onNavigate }) {
  return (
    <a
      aria-label="SouthLabs - torna alla sezione principale"
      className="ml-1.5 lg:ml-0 shrink-0 flex items-center gap-1.5 lg:gap-2.5"
      href="#hero"
      onClick={onNavigate}
    >
      <img alt="" aria-hidden="true" className="h-[3.25rem] lg:h-[3.75rem] w-auto object-contain object-center" src={logoImage} />
      <div className="flex h-[3.25rem] lg:h-[3.75rem] items-center">
        <img
          alt=""
          aria-hidden="true"
          className="relative translate-y-0.5 h-9 lg:h-11 w-auto object-contain object-center"
          src={logoText}
        />
      </div>
    </a>
  );
}

// Desktop/tablet navigation uses two-line labels on tablet to preserve spacing.
function DesktopNavLinks() {
  return (
    <div className="hidden md:flex gap-14 lg:gap-10 items-center">
      {NAV_LINKS.map((link) => (
        <a
          key={link.href}
          className={DESKTOP_LINK_CLASS}
          href={link.href}
        >
          <span className="hidden lg:inline">{link.label}</span>
          <span className="block lg:hidden whitespace-nowrap">
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
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

// Mobile-only dropdown menu. Parent owns open/close state and passes the close handler.
function MobileNavMenu({ isVisible, onNavigate }) {
  return (
    <div
      aria-hidden={!isVisible}
      className={[
        'md:hidden absolute top-[calc(100%+0.65rem)] left-4 right-4 overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] p-2',
        'shadow-[0_22px_58px_rgba(15,23,42,0.22),0_1px_0_rgba(255,255,255,0.9)_inset]',
        'origin-top transition-[opacity,transform] duration-[280ms] ease-out motion-reduce:transition-none',
        'dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_22px_58px_rgba(0,0,0,0.48)]',
        isVisible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0'
      ].join(' ')}
      id="mobile-nav-menu"
    >
      <div className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            className={MOBILE_LINK_CLASS}
            href={link.href}
            onClick={onNavigate}
          >
            <span>{link.label}</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-blue-700 dark:text-slate-500 dark:group-hover:text-blue-200">
              arrow_forward
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// Sticky top navigation with a collapsible mobile menu.
export default function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={NAVBAR_CLASS}>
      <div className={NAV_CONTENT_CLASS}>
        <BrandLogo onNavigate={closeMobileMenu} />
        <DesktopNavLinks />

        <div className="flex items-center gap-2 lg:gap-3">
          <a
            className={CONTACT_CTA_CLASS}
            href="#contatti"
            onClick={closeMobileMenu}
          >
            Contattaci
          </a>

          <button
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
          <MobileNavMenu isVisible={isMobileMenuVisible} onNavigate={closeMobileMenu} />
        ) : null}
      </div>
    </nav>
  );
}
