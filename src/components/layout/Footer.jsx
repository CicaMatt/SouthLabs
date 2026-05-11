const footerLinks = ['Privacy Policy', 'Termini di Servizio'];
const socialLinks = [
  { href: 'https://www.facebook.com', label: 'Facebook' },
  { href: 'https://www.instagram.com', label: 'Instagram' }
];

// Shared footer utility classes keep the three columns aligned and styled together.
const FOOTER_COLUMN_CLASS = [
  'flex flex-col items-center gap-2.5 text-center',
  'md:items-start md:text-left'
].join(' ');
const FOOTER_HEADING_CLASS = [
  'font-inter text-[11px] font-semibold uppercase tracking-[0.12em]',
  'text-blue-900 dark:text-blue-300'
].join(' ');
const FOOTER_LINK_CLASS = [
  'font-inter text-sm leading-relaxed text-on-surface-variant transition-colors',
  'hover:text-blue-800 dark:text-slate-400 dark:hover:text-blue-200'
].join(' ');

// Reusable footer column shell for legal, contact, and social link groups.
function FooterColumn({ children, className = '', title }) {
  return (
    <div className={`${FOOTER_COLUMN_CLASS} ${className}`.trim()}>
      <span className={FOOTER_HEADING_CLASS}>{title}</span>
      {children}
    </div>
  );
}

// Site footer with legal links, direct contact info, social links, and copyright.
export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/70 bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-950 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto flex w-full flex-col items-center gap-8 md:w-fit md:flex-row md:items-start md:justify-center md:gap-20 lg:gap-28">
            <FooterColumn title="Documenti Legali">
              <div className="flex flex-col items-center gap-1.5 md:items-start">
                {footerLinks.map((label) => (
                  <a
                    key={label}
                    className={FOOTER_LINK_CLASS}
                    href="#"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </FooterColumn>

            <FooterColumn title="Contatti">
              <a
                className={`max-w-full break-all ${FOOTER_LINK_CLASS}`}
                href="mailto:matteocicalese.consulting@gmail.com"
              >
                matteocicalese.consulting@gmail.com
              </a>
              <span className="font-inter text-sm leading-relaxed text-on-surface-variant dark:text-slate-400">+39 3928139527</span>
            </FooterColumn>

            <FooterColumn title="Social">
              <div className="flex flex-col items-center gap-1.5 md:items-start">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    className={FOOTER_LINK_CLASS}
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </FooterColumn>
          </div>

          <div className="mt-6 flex flex-col items-center gap-5 border-t border-slate-200/70 pt-5 text-center font-inter text-xs uppercase tracking-[0.08em] text-on-surface-variant dark:border-slate-800/70 dark:text-slate-500 sm:flex-row sm:justify-center sm:gap-40">
            <span>P.IVA: 06403770651</span>
            <span>© 2026 SouthLabs.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
