import { useEffect, useRef, useState } from 'react';
import privacyPolicyHtml from '../../privacy/privacy_policy.html?raw';
import termsOfServiceHtml from '../../privacy/terms_of_service.html?raw';

const legalDocuments = [
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    html: privacyPolicyHtml
  },
  {
    id: 'terms-of-service',
    label: 'Termini di Servizio',
    title: 'Termini di Servizio',
    html: termsOfServiceHtml
  }
];
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
const FOOTER_LEGAL_BUTTON_CLASS = [
  FOOTER_LINK_CLASS,
  'bg-transparent p-0 text-center md:text-left'
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

function LegalDocumentDialog({ document, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!document) return undefined;

    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [document, onClose]);

  if (!document) return null;

  return (
    <div
      aria-labelledby={`${document.id}-title`}
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/44 px-4 py-6 backdrop-blur-sm sm:px-6"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
    >
      <div className="legal-document-modal flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border-2 border-[#053f82] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)] dark:border-[#053f82] dark:bg-slate-950 lg:max-w-6xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <h2
            className="font-headline text-xl font-semibold leading-tight text-on-background dark:text-slate-50 sm:text-2xl"
            id={`${document.id}-title`}
          >
            {document.title}
          </h2>

          <button
            ref={closeButtonRef}
            aria-label={`Chiudi ${document.title}`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-0 text-[#053f82] transition-colors hover:bg-[#053f82]/10 focus:outline-none focus-visible:bg-[#053f82]/10 dark:text-[#053f82] dark:hover:bg-[#053f82]/10 dark:focus-visible:bg-[#053f82]/10"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[21px]" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <article
            className="legal-document-content"
            dangerouslySetInnerHTML={{ __html: document.html }}
          />
        </div>
      </div>
    </div>
  );
}

// Site footer with legal links, direct contact info, social links, and copyright.
export default function Footer() {
  const [activeLegalDocument, setActiveLegalDocument] = useState(null);

  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/70 bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-950 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto flex w-full flex-col items-center gap-8 md:w-fit md:flex-row md:items-start md:justify-center md:gap-20 lg:gap-28">
            <FooterColumn title="Documenti Legali">
              <div className="flex flex-col items-center gap-1.5 md:items-start">
                {legalDocuments.map((legalDocument) => (
                  <button
                    key={legalDocument.id}
                    className={FOOTER_LEGAL_BUTTON_CLASS}
                    onClick={() => setActiveLegalDocument(legalDocument)}
                    type="button"
                  >
                    {legalDocument.label}
                  </button>
                ))}
              </div>
            </FooterColumn>

            <FooterColumn title="Contatti">
              <div className="footer-selectable-content flex flex-col items-center gap-1.5 md:items-start">
                <a
                  className={`max-w-full break-all ${FOOTER_LINK_CLASS}`}
                  href="mailto:matteocicalese.consulting@gmail.com"
                >
                  matteocicalese.consulting@gmail.com
                </a>
                <span className="font-inter text-sm leading-relaxed text-on-surface-variant dark:text-slate-400">+39 3928139527</span>
              </div>
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

      <LegalDocumentDialog
        document={activeLegalDocument}
        onClose={() => setActiveLegalDocument(null)}
      />
    </footer>
  );
}
