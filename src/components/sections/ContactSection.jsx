import { useState } from 'react';
import { getSolutionCardSurfaceStyle } from './solutionCardSurface';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykodzgw';
const FORM_STATUS = {
  idle: 'idle',
  submitting: 'submitting',
  succeeded: 'succeeded',
  failed: 'failed'
};
const FORM_MESSAGES = {
  succeeded: 'Grazie, richiesta inviata. Ti ricontatteremo al piu presto.',
  failed: 'Non siamo riusciti a inviare la richiesta. Riprova tra poco o scrivici via email.'
};

const CONTACT_FORM_SURFACE_OPACITY = 0.35;
const CONTACT_FORM_SURFACE_HOVER_OPACITY = 0.8;
const FIELD_LABEL_CLASS = [
  'block font-label text-sm font-medium',
  'text-on-surface-variant mb-2'
].join(' ');
const FIELD_CONTROL_CLASS = [
  'w-full rounded-md border-0 bg-surface-container-high',
  'px-4 py-3 text-on-background transition-colors',
  'focus:bg-surface-container-lowest focus:ring-0',
  'focus:shadow-[inset_0_0_0_1px_rgba(43,59,89,0.72)]'
].join(' ');
const TEXT_FIELD_CLASS = `${FIELD_CONTROL_CLASS} placeholder:text-outline-variant`;
const FORM_MESSAGE_CLASS = 'flex items-center justify-center rounded-md px-4 py-3 text-center text-sm font-medium';
const SECTION_CLASS = 'section-grid-bg section-grid-bg--contact py-[4.5rem] lg:py-[5.25rem]';
const SECTION_CONTENT_CLASS = 'max-w-3xl mx-auto px-5 sm:px-6 md:px-8';
const FORM_PANEL_CLASS = 'solution-card-surface rounded-xl border-t-4 border-[#2b3b59] p-8 shadow-[0_4px_20px_rgba(19,27,46,0.04)]';
const FORM_PANEL_STYLE = getSolutionCardSurfaceStyle(
  CONTACT_FORM_SURFACE_OPACITY,
  CONTACT_FORM_SURFACE_HOVER_OPACITY,
  '255, 255, 255'
);
const SUBMIT_BUTTON_CLASS = [
  'w-full inline-flex items-center justify-center px-6 py-4 rounded-md text-base font-medium',
  'transition-all duration-200 bg-primary text-on-primary bg-gradient-to-br from-primary to-primary-container',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_40px_rgba(34,42,62,0.15)]',
  'active:scale-95 disabled:cursor-wait disabled:opacity-70'
].join(' ');

// Field ids are used for input name, input id, and label htmlFor.
const CONTACT_FIELDS = [
  {
    autoComplete: 'name',
    id: 'name',
    label: 'Nome e Cognome',
    placeholder: 'Mario Rossi',
    required: true,
    type: 'text'
  },
  {
    autoComplete: 'organization',
    id: 'company',
    label: 'Azienda',
    placeholder: 'La tua azienda Srl',
    type: 'text'
  },
  {
    autoComplete: 'email',
    id: 'email',
    label: 'Email',
    placeholder: 'mario.rossi@esempio.it',
    required: true,
    type: 'email'
  }
];

const INTEREST_OPTIONS = [
  'Sviluppo Web / E-commerce',
  'Software Custom & AI',
  'Infrastruttura & Sicurezza',
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

function TextField({ autoComplete, id, label, placeholder, required = false, type = 'text' }) {
  return (
    <Field id={id} label={label}>
      <input
        autoComplete={autoComplete}
        className={TEXT_FIELD_CLASS}
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </Field>
  );
}

function FormStatusMessage({ message, status }) {
  if (!message) return null;

  const toneClass = status === FORM_STATUS.succeeded
    ? 'bg-primary-fixed text-on-primary-fixed'
    : 'bg-error/10 text-error';

  return (
    <p
      aria-live="polite"
      className={`${FORM_MESSAGE_CLASS} ${toneClass}`}
    >
      {message}
    </p>
  );
}

function SubmitButton({ isSubmitting }) {
  return (
    <button
      className={SUBMIT_BUTTON_CLASS}
      disabled={isSubmitting}
      type="submit"
    >
      {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
    </button>
  );
}

// Contact form section. Submissions are sent to Formspree without adding a runtime dependency.
export default function ContactSection() {
  const [formState, setFormState] = useState({ status: FORM_STATUS.idle, message: '' });
  const [nameField, companyField, emailField] = CONTACT_FIELDS;
  const isSubmitting = formState.status === FORM_STATUS.submitting;

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormState({ status: FORM_STATUS.submitting, message: '' });

    try {
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
      setFormState({
        status: FORM_STATUS.succeeded,
        message: FORM_MESSAGES.succeeded
      });
    } catch {
      setFormState({
        status: FORM_STATUS.failed,
        message: FORM_MESSAGES.failed
      });
    }
  }

  return (
    <section className={SECTION_CLASS} id="contatti">
      <div className={SECTION_CONTENT_CLASS}>
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-headline text-3xl md:text-4xl tracking-tight text-on-background mb-4">Inizia il tuo progetto</h2>
          <p className="font-body text-on-surface-variant">
            Raccontaci la tua idea.
          </p>
          <p className="font-body text-on-surface-variant">
            I nostri esperti ti contatteranno per una valutazione iniziale, senza impegno.
          </p>
        </div>

        <div className={FORM_PANEL_CLASS} style={FORM_PANEL_STYLE}>
          <form
            action={FORMSPREE_ENDPOINT}
            className="space-y-6"
            method="POST"
            onSubmit={handleSubmit}
          >
            <input name="_subject" type="hidden" value="Nuova richiesta dal sito SouthLabs" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField {...nameField} />
              <TextField {...companyField} />
            </div>

            <TextField {...emailField} />

            <Field id="interest" label="Area di Interesse">
              <select
                className={FIELD_CONTROL_CLASS}
                id="interest"
                name="interest"
              >
                {INTEREST_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Field>

            <Field id="message" label="Messaggio">
              <textarea
                className={TEXT_FIELD_CLASS}
                id="message"
                name="message"
                placeholder="Descrivi brevemente il tuo progetto..."
                required
                rows="4"
              />
            </Field>

            <FormStatusMessage message={formState.message} status={formState.status} />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </div>
      </div>
    </section>
  );
}
