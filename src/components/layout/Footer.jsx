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
const contacts = [
  { id: 'email', label: 'Email', value: 'matteocicalese.consulting@gmail.com' },
  { id: 'phone', label: 'Telefono', value: '+39 3928139527' }
];

const FOOTER_COLUMN_CLASS = 'flex flex-col items-center gap-2.5 text-center';
const FOOTER_HEADING_CLASS = [
  'font-inter text-[11px] font-semibold uppercase tracking-[0.12em]',
  'text-[#203658]'
].join(' ');
const FOOTER_LINK_CLASS = [
  'font-inter text-sm leading-relaxed text-on-surface-variant'
].join(' ');
const FOOTER_UNDERLINE_HOVER_CLASS = [
  'relative after:pointer-events-none after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px]',
  'after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out',
  'hover:after:scale-x-100'
].join(' ');
const FOOTER_LEGAL_BUTTON_CLASS = [
  FOOTER_LINK_CLASS,
  'bg-transparent p-0 text-center',
  FOOTER_UNDERLINE_HOVER_CLASS
].join(' ');
const FOOTER_CONTACT_ROW_CLASS = 'flex max-w-full items-center justify-center gap-1.5';
const FOOTER_COPY_BUTTON_CLASS = 'relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-slate-500 transition-colors hover:bg-[#203658]/10 hover:text-[#203658] focus:outline-none focus-visible:bg-[#203658]/10 focus-visible:text-[#203658]';
const FOOTER_COPY_ICON_CLASS = 'material-symbols-outlined absolute inset-0 flex origin-center items-center justify-center text-[13px] leading-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform';

async function copyTextToClipboard(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = Object.assign(document.createElement('textarea'), { value });
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = 'position:fixed;top:-9999px;opacity:0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function FooterColumn({ children, title }) {
  return (
    <div className={FOOTER_COLUMN_CLASS}>
      <span className={FOOTER_HEADING_CLASS}>{title}</span>
      {children}
    </div>
  );
}

function ContactCopyButton({ copied, label, onCopy }) {
  return (
    <button
      aria-label={copied ? `${label} copiato` : `Copia ${label}`}
      className={FOOTER_COPY_BUTTON_CLASS}
      onClick={onCopy}
      title={copied ? `${label} copiato` : `Copia ${label}`}
      type="button"
    >
      <span className={`${FOOTER_COPY_ICON_CLASS} ${copied ? '-rotate-6 scale-95 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} aria-hidden="true">content_copy</span>
      <span className={`${FOOTER_COPY_ICON_CLASS} ${copied ? 'rotate-0 scale-100 opacity-100' : 'rotate-6 scale-95 opacity-0'}`} aria-hidden="true">check</span>
    </button>
  );
}

function LegalDocumentDialog({ legalDoc, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!legalDoc) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [legalDoc, onClose]);

  if (!legalDoc) return null;

  return (
    <div
      aria-labelledby={`${legalDoc.id}-title`}
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/44 px-4 py-6 backdrop-blur-sm sm:px-6"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
    >
      <div className="legal-document-modal flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border-2 border-[#203658] shadow-[inset_0_0_0_1.5px_rgba(32,54,88,0.92),0_30px_100px_rgba(15,23,42,0.28)] bg-white lg:max-w-6xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2
            className="font-headline text-xl font-semibold leading-tight text-on-background sm:text-2xl"
            id={`${legalDoc.id}-title`}
          >
            {legalDoc.title}
          </h2>

          <button
            ref={closeButtonRef}
            aria-label={`Chiudi ${legalDoc.title}`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-0 text-[#203658] transition-colors hover:bg-[#203658]/10 focus:outline-none focus-visible:bg-[#203658]/10"
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
            dangerouslySetInnerHTML={{ __html: legalDoc.html }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [activeLegalDocument, setActiveLegalDocument] = useState(null);
  const [copiedContact, setCopiedContact] = useState(null);
  const copyFeedbackTimeoutRef = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(copyFeedbackTimeoutRef.current);
  }, []);

  async function handleContactCopy(contactId, value) {
    try {
      await copyTextToClipboard(value);
      setCopiedContact(contactId);
      window.clearTimeout(copyFeedbackTimeoutRef.current);
      copyFeedbackTimeoutRef.current = window.setTimeout(() => {
        setCopiedContact(null);
      }, 1600);
    } catch {
      setCopiedContact(null);
    }
  }

  return (
    <footer className="w-full border-t border-slate-200/60 bg-[#e6ecf4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto flex w-full flex-col items-center gap-8 md:w-fit md:flex-row md:items-start md:justify-center md:gap-20 lg:gap-28">
            <FooterColumn title="Documenti Legali">
              <div className="flex flex-col items-center gap-1.5">
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
              <div className="flex flex-col items-center gap-1.5">
                {contacts.map(({ id, label, value }) => (
                  <div className={FOOTER_CONTACT_ROW_CLASS} key={id}>
                    <button
                      className={`min-w-0 break-all bg-transparent p-0 text-center ${FOOTER_LINK_CLASS} ${FOOTER_UNDERLINE_HOVER_CLASS}`}
                      onClick={() => handleContactCopy(id, value)}
                      type="button"
                    >
                      {value}
                    </button>
                    <ContactCopyButton copied={copiedContact === id} label={label} onCopy={() => handleContactCopy(id, value)} />
                  </div>
                ))}
              </div>
            </FooterColumn>

            <FooterColumn title="Social">
              <div className="flex flex-col items-center gap-1.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    className={`${FOOTER_LINK_CLASS} ${FOOTER_UNDERLINE_HOVER_CLASS}`}
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

          <div className="mt-6 flex flex-col items-center gap-5 border-t border-slate-200/70 pt-5 text-center font-inter text-xs uppercase tracking-[0.08em] text-on-surface-variant sm:flex-row sm:justify-center sm:gap-40">
            <span>P.IVA: 06403770651</span>
            <span>© 2026 SouthLabs.</span>
          </div>
        </div>
      </div>

      <LegalDocumentDialog
        legalDoc={activeLegalDocument}
        onClose={() => setActiveLegalDocument(null)}
      />
    </footer>
  );
}
