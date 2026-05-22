import { useEffect, useRef, useState } from 'react';
import logoImage from '../../../media/logo/logo_image.png';
import logoText from '../../../media/logo/logo_text.png';

const NAV_DESKTOP_MIN_WIDTH = 768;
const MOBILE_MENU_FADE_MS = 280;

const NAV_LINKS = [
  { href: '#siti-web', label: 'Siti Web', tabletLines: ['Siti', 'Web'] },
  { href: '#software-automazione', label: 'Software e Automazione', tabletLines: ['Software e', 'Automazione'] },
  { href: '#infrastrutture-hardware', label: 'Infrastrutture Hardware', tabletLines: ['Infrastrutture', 'Hardware'] },
  { href: '#manutenzione-supporto', label: 'Manutenzione e Supporto', tabletLines: ['Manutenzione', 'e Supporto'] }
];

const NAVBAR_CLASS = [
  'sticky top-0 w-full h-16 lg:h-20 z-50',
  'bg-[#e6ecf4]',
  'border-b border-slate-100',
  'shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)]'
].join(' ');
const NAV_CONTENT_CLASS = 'relative max-w-7xl mx-auto h-full flex items-center justify-between px-5 lg:px-8';
const DESKTOP_LINK_CLASS = [
  'relative text-center text-[13px] font-semibold leading-tight tracking-[0.01em]',
  'px-1 py-2 text-[#28324b] transition-all duration-300 hover:text-[#203658]',
  'lg:text-[14px]',
  'after:pointer-events-none after:absolute after:left-1 after:right-1 after:bottom-1 after:h-[2px]',
  'after:origin-left after:scale-x-0 after:bg-[#95e3ff] after:transition-transform after:duration-300 after:ease-out',
  'hover:after:scale-x-100'
].join(' ');
const MOBILE_LINK_CLASS = [
  'group flex min-h-12 items-center justify-between rounded-lg px-4',
  'text-[14px] font-semibold text-[#28324b]',
  'transition-colors hover:bg-[#203658]/10 hover:text-[#203658] active:bg-[#203658]/15'
].join(' ');
const CONTACT_CTA_CLASS = [
  'inline-flex items-center justify-center px-3.5 py-2 rounded-md text-xs lg:text-sm font-bold',
  'whitespace-nowrap transition-all duration-200 active:scale-95',
  'nav-contact-cta',
  'lg:px-6 lg:py-2.5'
].join(' ');
const MOBILE_MENU_BUTTON_CLASS = [
  'md:hidden inline-flex items-center justify-center h-10 w-10',
  'rounded-lg text-[#28324b] hover:bg-[#28324b]/10 transition-colors'
].join(' ');

function BrandLogo({ onNavigate }) {
  return (
    <a
      aria-label="SouthLabs - torna alla sezione principale"
      className="ml-1.5 lg:ml-0 shrink-0 flex items-center gap-1.5 lg:gap-2.5"
      href="#hero"
      onClick={onNavigate}
    >
      <img alt="" aria-hidden="true" className="h-[4rem] lg:h-[4.5rem] w-auto object-contain object-center" src={logoImage} />
      <div className="flex h-[3.25rem] lg:h-[3.75rem] items-center">
        <img
          alt=""
          aria-hidden="true"
          className="relative translate-y-0.5 h-[2.75rem] lg:h-[3.25rem] w-auto object-contain object-center"
          src={logoText}
        />
      </div>
    </a>
  );
}

// Desktop/tablet navigation uses two-line labels on tablet to preserve spacing.
function DesktopNavLinks() {
  return (
    <div className="hidden md:flex md:flex-1 items-center justify-around gap-4 md:px-4 lg:gap-6 lg:px-12 xl:px-20">
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

// Parent owns open/close state; close handler is passed down.
function MobileNavMenu({ isVisible, menuRef, onNavigate }) {
  return (
    <div
      ref={menuRef}
      aria-hidden={!isVisible}
      className={[
        'md:hidden absolute top-[calc(100%+0.65rem)] left-4 right-4 overflow-hidden rounded-2xl border border-slate-200 bg-[#e6ecf4] p-2',
        'shadow-[0_22px_58px_rgba(15,23,42,0.22),0_1px_0_rgba(255,255,255,0.9)_inset]',
        'origin-top transition-[opacity,transform] duration-[280ms] ease-out motion-reduce:transition-none',
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
            <span className="relative after:pointer-events-none after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#95e3ff] after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100">
              {link.label}
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#28324b] transition-all group-hover:translate-x-0.5 group-hover:text-[#203658]">
              arrow_forward
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

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

    const isInsideMenuControls = (target) => (
      target instanceof Node
      && (
        mobileMenuRef.current?.contains(target)
        || mobileMenuButtonRef.current?.contains(target)
      )
    );
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
            <span className="relative z-10">Contattaci</span>
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
