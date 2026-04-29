const footerLinks = ['Privacy Policy', 'Termini di Servizio'];
const socialLinks = [
  { href: 'https://www.facebook.com', label: 'Facebook' },
  { href: 'https://www.instagram.com', label: 'Instagram' },
  { href: 'https://www.tiktok.com', label: 'TikTok' }
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/70 bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-950 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto flex w-full flex-col items-center gap-8 md:w-fit md:flex-row md:items-start md:justify-center md:gap-0">
            <div className="flex flex-col items-center text-center gap-2.5 md:items-start md:text-left md:pr-10 lg:pr-14">
              <span className="font-inter text-[11px] uppercase tracking-[0.12em] font-semibold text-blue-900 dark:text-blue-300">
                Documenti Legali
              </span>
              <div className="flex flex-col items-center gap-1.5 md:items-start">
                {footerLinks.map((label) => (
                  <a
                    key={label}
                    className="font-inter text-sm leading-relaxed text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    href="#"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2.5 md:items-start md:text-left md:border-x md:border-slate-200/70 md:px-10 lg:px-14 md:dark:border-slate-800/70">
              <span className="font-inter text-[11px] uppercase tracking-[0.12em] font-semibold text-blue-900 dark:text-blue-300">
                Contatti
              </span>
              <a
                className="max-w-full break-all font-inter text-sm leading-relaxed text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                href="mailto:southlabs.consulting@gmail.com"
              >
                southlabs.consulting@gmail.com
              </a>
              <span className="font-inter text-sm leading-relaxed text-slate-600 dark:text-slate-400">+39 3928139527</span>
            </div>

            <div className="flex flex-col items-center text-center gap-2.5 md:items-start md:text-left md:pl-10 lg:pl-14">
              <span className="font-inter text-[11px] uppercase tracking-[0.12em] font-semibold text-blue-900 dark:text-blue-300">
                Social
              </span>
              <div className="flex flex-col items-center gap-1.5 md:items-start">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    className="font-inter text-sm leading-relaxed text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200/70 pt-5 font-inter text-xs uppercase tracking-[0.08em] text-slate-500 dark:border-slate-800/70 dark:text-slate-500 text-center">
            © 2026 SouthLabs.
          </div>
        </div>
      </div>
    </footer>
  );
}
