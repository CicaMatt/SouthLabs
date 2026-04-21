import { footerLinks } from '../../data/content';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-black text-blue-900 dark:text-blue-50 font-headline">SouthLabs</div>

        <div className="flex gap-6">
          {footerLinks.map((label) => (
            <a
              key={label}
              className="font-inter text-xs leading-relaxed text-slate-500 dark:text-slate-500 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
              href="#"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="font-inter text-xs leading-relaxed text-blue-900 dark:text-blue-400">
          © 2026 SouthLabs. Precision Engineering for the Digital Monolith.
        </div>
      </div>
    </footer>
  );
}
