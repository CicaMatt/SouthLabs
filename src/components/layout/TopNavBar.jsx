import { useEffect, useState } from 'react';
import logoImage from '../../../media/logo/logo_image.png';
import logoText from '../../../media/logo/logo_text.png';

// Navigation labels and anchors are the source of truth for desktop and mobile menus.
const navLinks = [
  { href: '#siti-web', label: 'Siti Web', tabletLines: ['Siti', 'Web'] },
  { href: '#software-automazione', label: 'Software e Automazione', tabletLines: ['Software e', 'Automazione'] },
  { href: '#infrastrutture-hardware', label: 'Infrastrutture Hardware', tabletLines: ['Infrastrutture', 'Hardware'] },
  { href: '#manutenzione-supporto', label: 'Manutenzione e Supporto', tabletLines: ['Manutenzione e', 'Supporto'] }
];

const DESKTOP_LINK_CLASS = [
  'font-headline text-center text-[13px] font-semibold leading-tight tracking-tight',
  'text-slate-500 transition-all duration-300 hover:text-blue-700',
  'dark:text-slate-400 dark:hover:text-blue-300 lg:text-[14px]'
].join(' ');
const MOBILE_LINK_CLASS = [
  'rounded-md px-3 py-2 font-headline text-[14px] font-semibold',
  'text-slate-700 transition-colors hover:bg-white/55',
  'dark:text-slate-200 dark:hover:bg-slate-800/70'
].join(' ');

// Combines the icon and text mark while exposing one accessible brand label.
function BrandLogo() {
  return (
    <div aria-label="SouthLabs" className="ml-1.5 lg:ml-0 shrink-0 flex items-center gap-1.5 lg:gap-2.5" role="img">
      <img alt="" aria-hidden="true" className="h-[3.25rem] lg:h-[3.75rem] w-auto object-contain object-center" src={logoImage} />
      <div className="flex h-[3.25rem] lg:h-[3.75rem] items-center">
        <img
          alt=""
          aria-hidden="true"
          className="relative translate-y-0.5 h-9 lg:h-11 w-auto object-contain object-center"
          src={logoText}
        />
      </div>
    </div>
  );
}

// Desktop/tablet navigation uses two-line labels on tablet to preserve spacing.
function DesktopNavLinks() {
  return (
    <div className="hidden md:flex gap-14 lg:gap-10 items-center">
      {navLinks.map((link) => (
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
function MobileNavMenu({ onNavigate }) {
  return (
    <div
      className="md:hidden absolute top-[calc(100%+0.55rem)] left-4 right-4 rounded-xl border border-slate-200/70 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_14px_34px_rgba(19,27,46,0.14)] p-3"
      id="mobile-nav-menu"
    >
      <div className="flex flex-col gap-1.5">
        {navLinks.map((link) => (
          <a
            key={link.href}
            className={MOBILE_LINK_CLASS}
            href={link.href}
            onClick={onNavigate}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// Sticky top navigation with a collapsible mobile menu.
export default function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full h-16 lg:h-20 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-[0_4px_20px_rgba(19,27,46,0.04)] dark:shadow-none bg-white dark:bg-slate-900">
      <div className="relative max-w-7xl mx-auto h-full flex items-center justify-between px-5 lg:px-8">
        <BrandLogo />
        <DesktopNavLinks />

        <div className="flex items-center gap-2 lg:gap-3">
          <a
            className="inline-flex items-center justify-center px-3.5 py-2 rounded-md text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 bg-primary text-on-primary bg-gradient-to-br from-primary to-primary-container shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:opacity-90 lg:px-6 lg:py-2.5"
            href="#contatti"
            onClick={closeMobileMenu}
          >
            Contattaci
          </a>

          <button
            aria-controls="mobile-nav-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Chiudi menu mobile' : 'Apri menu mobile'}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            type="button"
          >
            <MenuIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>

        {isMobileMenuOpen ? (
          <MobileNavMenu onNavigate={closeMobileMenu} />
        ) : null}
      </div>
    </nav>
  );
}
