const footerLinks = ['Privacy Policy', 'Termini di Servizio'];
const socialLinks = [
  { href: 'https://www.facebook.com', label: 'Facebook' },
  { href: 'https://www.instagram.com', label: 'Instagram' },
  { href: 'https://www.tiktok.com', label: 'TikTok' }
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/70 bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-950 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8">
        <div className="w-full lg:col-start-2 lg:justify-self-center">
          <div className="w-full lg:w-auto flex flex-col md:flex-row md:items-start gap-8 md:gap-0 bg-transparent">
            <div className="flex flex-col items-start text-left gap-2.5">
              <span className="font-inter text-[11px] uppercase tracking-[0.12em] font-semibold text-blue-900 dark:text-blue-300">
                Documenti Legali
              </span>
              <div className="flex flex-col items-start gap-1.5">
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

            <div className="flex flex-col items-start text-left gap-2.5 md:ml-20 md:pl-20 md:border-l md:border-slate-200/70 md:dark:border-slate-800/70">
              <span className="font-inter text-[11px] uppercase tracking-[0.12em] font-semibold text-blue-900 dark:text-blue-300">
                Contatti
              </span>
              <a
                className="font-inter text-sm leading-relaxed text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                href="mailto:southlabs.consulting@gmail.com"
              >
                southlabs.consulting@gmail.com
              </a>  
              <span className="font-inter text-sm leading-relaxed text-slate-600 dark:text-slate-400">+39 3928139527</span>
            </div>

            <div className="flex flex-col items-start text-left gap-2.5 md:ml-20 md:pl-20 md:border-l md:border-slate-200/70 md:dark:border-slate-800/70">
              <span className="font-inter text-[11px] uppercase tracking-[0.12em] font-semibold text-blue-900 dark:text-blue-300">
                Social
              </span>
              <div className="flex flex-col items-start gap-1.5">
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
        </div>

        <div className="font-inter text-xs uppercase tracking-[0.08em] text-slate-500 dark:text-slate-500 text-center lg:col-start-3 lg:justify-self-end lg:text-right lg:whitespace-nowrap lg:translate-x-12">
          © 2026 SouthLabs.
        </div>
      </div>
    </footer>
  );
}
