import { useRef, useState } from 'react';
import SectionShell from '../SectionShell';
import { getSolutionCardSurfaceStyle } from '../../hooks/sectionGrid/selectors';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykodzgw';
const HONEYPOT_FIELD_NAME = '_gotcha';
const FORM_THROTTLE_STORAGE_KEY = 'southlabs:last-contact-submit';
const SUBMISSION_COOLDOWN_MS = 60 * 1000;
const MIN_FORM_COMPLETION_MS = 1500;
const FORM_STATUS = {
  idle: 'idle',
  submitting: 'submitting',
  succeeded: 'succeeded',
  failed: 'failed'
};
const FORM_MESSAGES = {
  succeeded: 'Grazie, richiesta inviata. Ti ricontatteremo al piu presto.',
  tooFast: 'Attendi qualche secondo prima di inviare la richiesta.',
  throttled: 'Hai appena inviato una richiesta. Attendi circa un minuto prima di riprovare.',
  failed: 'Non siamo riusciti a inviare la richiesta. Riprova tra poco o scrivici via email.'
};

const FIELD_MAX_LENGTHS = {
  name: 100,
  company: 120,
  email: 254,
  message: 1200
};
const REQUIRED_TEXT_PATTERN = '.*\\S.*';
const EMAIL_PATTERN = '[^\\s@]+@[^\\s@]+\\.[^\\s@]+';
const CONTACT_FORM_SURFACE_OPACITY = 0.78;
const CONTACT_FORM_SURFACE_HOVER_OPACITY = CONTACT_FORM_SURFACE_OPACITY;
const FIELD_LABEL_CLASS = [
  'pointer-events-none block font-label text-sm font-medium',
  'text-on-surface-variant mb-2'
].join(' ');
const FIELD_CONTROL_CLASS = [
  'contact-field-control w-full rounded-md border-2 border-transparent bg-[#cedaea]',
  'px-4 py-3 text-on-background transition-colors'
].join(' ');
const TEXT_FIELD_CLASS = `${FIELD_CONTROL_CLASS} placeholder:text-[rgba(32,54,88,0.5)]`;
const SELECT_FIELD_CLASS = `${FIELD_CONTROL_CLASS} invalid:text-[rgba(32,54,88,0.5)]`;
const FORM_MESSAGE_CLASS =
  'flex items-center justify-center rounded-md px-4 py-3 text-center text-sm font-medium';
const FORM_PANEL_CLASS =
  'contact-form-panel section-grid-burst-disabled solution-card-surface rounded-xl border-t-4 border-[#203658] p-8 shadow-[0_4px_20px_rgba(19,27,46,0.04)]';
const FORM_PANEL_STYLE = getSolutionCardSurfaceStyle(
  CONTACT_FORM_SURFACE_OPACITY,
  CONTACT_FORM_SURFACE_HOVER_OPACITY,
  '235, 244, 252'
);
const SUBMIT_BUTTON_CLASS = [
  'contact-submit-cta w-full inline-flex items-center justify-center px-6 py-4 rounded-md text-base font-medium',
  'text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
  'active:scale-95 disabled:cursor-wait disabled:opacity-70'
].join(' ');

// Field ids are used for input name, input id, and label htmlFor.
const CONTACT_FIELDS = [
  {
    autoComplete: 'name',
    id: 'name',
    label: 'Nome e Cognome',
    maxLength: FIELD_MAX_LENGTHS.name,
    pattern: REQUIRED_TEXT_PATTERN,
    placeholder: '',
    required: true,
    title: 'Inserisci nome e cognome.',
    type: 'text'
  },
  {
    autoComplete: 'organization',
    id: 'company',
    label: 'Azienda',
    maxLength: FIELD_MAX_LENGTHS.company,
    placeholder: '',
    type: 'text'
  },
  {
    autoComplete: 'email',
    id: 'email',
    label: 'Email',
    maxLength: FIELD_MAX_LENGTHS.email,
    pattern: EMAIL_PATTERN,
    placeholder: '',
    required: true,
    title: 'Inserisci un indirizzo email valido.',
    type: 'email'
  }
];

const INTEREST_OPTIONS = [
  'Siti Web',
  'Piattaforme E-Commerce',
  'Soluzioni Wordpress',
  'Intelligenza Artificiale',
  'Software Personalizzati',
  'Manutenzione/Aggiornamento di Sistemi Legacy',
  'Domotica',
  'Digitalizzazione Processi',
  'Assistenza Tecnica'
];

function Field({ children, id, label }) {
  return (
    <div>
      <label className={FIELD_LABEL_CLASS} htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextField({
  autoComplete,
  id,
  label,
  maxLength,
  pattern,
  placeholder,
  required = false,
  title,
  type = 'text'
}) {
  return (
    <Field id={id} label={label}>
      <input
        autoComplete={autoComplete}
        className={TEXT_FIELD_CLASS}
        id={id}
        maxLength={maxLength}
        name={id}
        pattern={pattern}
        placeholder={placeholder}
        required={required}
        title={title}
        type={type}
      />
    </Field>
  );
}

function getStoredSubmissionTime() {
  try {
    return Number(window.localStorage.getItem(FORM_THROTTLE_STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function setStoredSubmissionTime(timestamp) {
  try {
    window.localStorage.setItem(FORM_THROTTLE_STORAGE_KEY, String(timestamp));
  } catch {
    // The storage guard is best-effort; form submission should still work without it.
  }
}

function clearStoredSubmissionTime() {
  try {
    window.localStorage.removeItem(FORM_THROTTLE_STORAGE_KEY);
  } catch {
    // Ignore private-mode or storage-disabled failures.
  }
}

function getTrimmedFormValue(formData, fieldName) {
  return String(formData.get(fieldName) ?? '').trim();
}

function normalizeFormData(formData) {
  ['name', 'company', 'email', 'interest', 'message'].forEach((fieldName) => {
    formData.set(fieldName, getTrimmedFormValue(formData, fieldName));
  });
}

function FormStatusMessage({ message, status }) {
  if (!message) return null;

  const toneClass =
    status === FORM_STATUS.succeeded
      ? 'bg-primary-fixed text-on-primary-fixed'
      : 'bg-error/10 text-error';

  return (
    <p aria-live="polite" className={`${FORM_MESSAGE_CLASS} ${toneClass}`}>
      {message}
    </p>
  );
}

function SubmitButton({ isSubmitting }) {
  return (
    <button className={SUBMIT_BUTTON_CLASS} disabled={isSubmitting} type="submit">
      <span className="cta-underline-label">
        {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
      </span>
    </button>
  );
}

// Contact form section. Submissions are sent to Formspree without adding a runtime dependency.
export default function ContactSection() {
  const [formState, setFormState] = useState({ status: FORM_STATUS.idle, message: '' });
  const formStartedAtRef = useRef(Date.now());
  const submissionInFlightRef = useRef(false);
  const [nameField, companyField, emailField] = CONTACT_FIELDS;
  const isSubmitting = formState.status === FORM_STATUS.submitting;

  async function handleSubmit(event) {
    event.preventDefault();

    if (submissionInFlightRef.current) {
      return;
    }

    const form = event.currentTarget;
    if (!form.reportValidity()) {
      return;
    }

    submissionInFlightRef.current = true;

    try {
      const submittedAt = Date.now();
      const formData = new FormData(form);
      const honeypotValue = getTrimmedFormValue(formData, HONEYPOT_FIELD_NAME);
      if (honeypotValue) {
        form.reset();
        setFormState({ status: FORM_STATUS.succeeded, message: FORM_MESSAGES.succeeded });
        return;
      }

      if (submittedAt - formStartedAtRef.current < MIN_FORM_COMPLETION_MS) {
        setFormState({ status: FORM_STATUS.failed, message: FORM_MESSAGES.tooFast });
        return;
      }

      const previousSubmissionAt = getStoredSubmissionTime();
      if (submittedAt - previousSubmissionAt < SUBMISSION_COOLDOWN_MS) {
        setFormState({ status: FORM_STATUS.failed, message: FORM_MESSAGES.throttled });
        return;
      }

      normalizeFormData(formData);
      setStoredSubmissionTime(submittedAt);

      setFormState({ status: FORM_STATUS.submitting, message: '' });
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      form.reset();
      formStartedAtRef.current = Date.now();
      setFormState({
        status: FORM_STATUS.succeeded,
        message: FORM_MESSAGES.succeeded
      });
    } catch {
      clearStoredSubmissionTime();
      setFormState({
        status: FORM_STATUS.failed,
        message: FORM_MESSAGES.failed
      });
    } finally {
      submissionInFlightRef.current = false;
    }
  }

  return (
    <SectionShell id="contatti" variant="contact">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="font-headline text-3xl md:text-4xl tracking-tight text-on-background mb-4">
          Richiedi una consulenza
        </h2>
        <p className="font-body text-on-surface-variant">Raccontaci della tua idea.</p>
        <p className="font-body text-on-surface-variant">
          I nostri esperti ti contatteranno per una valutazione iniziale, senza impegno.
        </p>
      </div>

      <div className={FORM_PANEL_CLASS} style={FORM_PANEL_STYLE}>
        <form
          action={FORMSPREE_ENDPOINT}
          className="relative space-y-6"
          method="POST"
          onSubmit={handleSubmit}
        >
          <input name="_subject" type="hidden" value="Nuova richiesta dal sito SouthLabs" />
          <div
            aria-hidden="true"
            className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor={HONEYPOT_FIELD_NAME}>Website</label>
            <input
              autoComplete="off"
              id={HONEYPOT_FIELD_NAME}
              name={HONEYPOT_FIELD_NAME}
              tabIndex={-1}
              type="text"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField {...nameField} />
            <TextField {...companyField} />
          </div>

          <TextField {...emailField} />

          <Field id="interest" label="Area di Interesse">
            <select
              className={SELECT_FIELD_CLASS}
              defaultValue=""
              id="interest"
              name="interest"
              required
            >
              <option disabled value="">
                Seleziona
              </option>
              {INTEREST_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field id="message" label="Messaggio">
            <textarea
              className={TEXT_FIELD_CLASS}
              id="message"
              name="message"
              placeholder="Descrivi brevemente il tuo progetto..."
              maxLength={FIELD_MAX_LENGTHS.message}
              required
              rows="4"
            />
          </Field>

          <FormStatusMessage message={formState.message} status={formState.status} />
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </SectionShell>
  );
}
