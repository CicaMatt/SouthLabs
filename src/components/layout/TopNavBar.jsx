import logo from '../../../media/logo.png';

const navLinks = [
  { href: '#siti-web', label: 'Siti Web' },
  { href: '#automazione', label: 'Software e Automazione' },
  { href: '#infrastruttura', label: 'Infrastrutture' },
  { href: '#supporto', label: 'Manutenzione e Supporto' }
];

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full h-16 md:h-20 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-[0_4px_20px_rgba(19,27,46,0.04)] dark:shadow-none bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">
        <img alt="SouthLabs" className="h-12 md:h-14 w-auto object-contain" src={logo} />

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="font-headline tracking-tight text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 active:scale-95 bg-primary text-on-primary bg-gradient-to-br from-primary to-primary-container shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:opacity-90"
          href="#contatti"
        >
          I Nostri Servizi
        </a>

        <button className="md:hidden p-2 text-primary" aria-label="Apri menu mobile">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}
