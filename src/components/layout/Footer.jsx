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
  {
    href: 'https://www.facebook.com/profile.php?id=61590605188546&locale=it_IT',
    label: 'Facebook'
  },
  { href: 'https://www.instagram.com/southlabs_consulting/', label: 'Instagram' }
];
const contacts = [
  { id: 'email', label: 'Email', value: 'consulting@southlabs.it' },
  { id: 'phone', label: 'Telefono', value: '+39 3928139527' }
];

const FOOTER_COLUMN_CLASS = 'flex flex-col items-center gap-2.5 text-center';
const FOOTER_HEADING_CLASS = [
  'font-inter text-[11px] font-semibold uppercase tracking-[0.12em]',
  'text-[#95e3ff]'
].join(' ');
const FOOTER_LINK_CLASS = [
  'font-inter text-sm leading-relaxed text-[#d4dbea] transition-colors hover:text-white'
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
const FOOTER_COPY_BUTTON_CLASS =
  'relative inline-flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-sm text-[#95e3ff]/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:bg-white/10 focus-visible:text-white';
const FOOTER_COPY_ICON_CLASS =
  'material-symbols-outlined absolute inset-0 flex origin-center translate-y-px items-center justify-center text-sm leading-none transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform';
const FOOTER_COPY_ICON_STYLE = { fontSize: '0.875rem', lineHeight: 1 };
const FOCUSABLE_DIALOG_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

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
      <span
        className={`${FOOTER_COPY_ICON_CLASS} ${copied ? '-rotate-6 scale-95 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        aria-hidden="true"
        style={FOOTER_COPY_ICON_STYLE}
      >
        content_copy
      </span>
      <span
        className={`${FOOTER_COPY_ICON_CLASS} ${copied ? 'rotate-0 scale-100 opacity-100' : 'rotate-6 scale-95 opacity-0'}`}
        aria-hidden="true"
        style={FOOTER_COPY_ICON_STYLE}
      >
        check
      </span>
    </button>
  );
}

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_DIALOG_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
  );
}

function LegalDocumentDialog({ legalDoc, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!legalDoc) return undefined;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements(dialogRef.current);
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault();
        closeButtonRef.current?.focus({ preventScroll: true });
        return;
      }

      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        firstFocusableElement.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus({ preventScroll: true });
      }
      previousFocusRef.current = null;
    };
  }, [legalDoc, onClose]);

  if (!legalDoc) return null;

  return (
    <div
      ref={dialogRef}
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
      <div className="legal-document-modal flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border-2 border-[#203658] shadow-[inset_0_0_0_1.5px_rgba(32,54,88,0.92),0_30px_100px_rgba(15,23,42,0.28)] lg:max-w-6xl">
        <div className="flex items-center justify-between gap-4 border-b border-[#203658] px-5 py-4 sm:px-6">
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

  useEffect(
    () => () => {
      window.clearTimeout(copyFeedbackTimeoutRef.current);
    },
    []
  );

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
    <footer className="site-surface w-full text-[#d4dbea]">
      <div className="site-footer-main mx-auto flex max-w-7xl items-center px-4 sm:px-6 md:px-8">
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
                    <ContactCopyButton
                      copied={copiedContact === id}
                      label={label}
                      onCopy={() => handleContactCopy(id, value)}
                    />
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
        </div>
      </div>

      <div className="site-footer-bottom-row border-t border-[#95e3ff]/10">
        <div className="site-footer-bottom-content mx-auto flex h-full max-w-7xl flex-row items-center justify-center gap-[clamp(4rem,25vw,10rem)] px-4 text-center font-inter text-[10px] uppercase tracking-[0.06em] text-[#d4dbea]/80 min-[390px]:text-xs min-[390px]:tracking-[0.08em] sm:gap-40 sm:px-6 md:px-8">
          <span>P.IVA: 06403770651</span>
          <span>© 2026 SouthLabs.</span>
        </div>
      </div>

      <LegalDocumentDialog
        legalDoc={activeLegalDocument}
        onClose={() => setActiveLegalDocument(null)}
      />
    </footer>
  );
}
