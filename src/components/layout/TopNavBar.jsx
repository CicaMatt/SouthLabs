import { useEffect, useState } from 'react';
import logo from '../../../media/logo.png';

const navLinks = [
  { href: '#siti-web', label: 'Siti Web', tabletLines: ['Siti', 'Web'] },
  { href: '#software-automazione', label: 'Software e Automazione', tabletLines: ['Software e', 'Automazione'] },
  { href: '#infrastrutture-hardware', label: 'Infrastrutture Hardware', tabletLines: ['Infrastrutture', 'Hardware'] },
  { href: '#manutenzione-supporto', label: 'Manutenzione e Supporto', tabletLines: ['Manutenzione e', 'Supporto'] }
];

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
        <img alt="SouthLabs" className="h-12 lg:h-14 w-auto object-contain" src={logo} />

        <div className="hidden md:flex gap-14 lg:gap-10 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="font-headline tracking-tight text-[13px] lg:text-[14px] font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 text-center leading-tight"
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
            {isMobileMenuOpen ? (
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div
            className="md:hidden absolute top-[calc(100%+0.55rem)] left-4 right-4 rounded-xl border border-slate-200/70 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_14px_34px_rgba(19,27,46,0.14)] p-3"
            id="mobile-nav-menu"
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  className="font-headline text-[14px] font-semibold rounded-md px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-white/55 dark:hover:bg-slate-800/70 transition-colors"
                  href={link.href}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
