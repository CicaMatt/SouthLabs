const FIELD_LABEL_CLASS = [
  'block font-label text-sm font-medium',
  'text-on-surface-variant mb-2'
].join(' ');
const FIELD_CONTROL_CLASS = [
  'w-full rounded-md border-0 bg-surface-container-high',
  'px-4 py-3 text-on-background transition-colors',
  'focus:bg-surface-container-lowest focus:ring-0',
  'focus:shadow-[inset_0_0_0_1px_rgba(71,214,255,1)]'
].join(' ');
const TEXT_FIELD_CLASS = `${FIELD_CONTROL_CLASS} placeholder:text-outline-variant`;

// Contact form configuration. Field ids match label htmlFor values.
const contactFields = [
  { id: 'name', label: 'Nome e Cognome', placeholder: 'Mario Rossi', type: 'text' },
  { id: 'company', label: 'Azienda', placeholder: 'La tua azienda Srl', type: 'text' },
  { id: 'email', label: 'Email', placeholder: 'mario.rossi@esempio.it', type: 'email' }
];

const interestOptions = [
  'Sviluppo Web / E-commerce',
  'Software Custom & AI',
  'Infrastruttura & Sicurezza',
  'Assistenza Tecnica'
];

// Shared field wrapper keeps label/control spacing consistent across input types.
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

// Standard text-like input used for name, company, and email fields.
function TextField({ id, label, placeholder, type = 'text' }) {
  return (
    <Field id={id} label={label}>
      <input
        className={TEXT_FIELD_CLASS}
        id={id}
        placeholder={placeholder}
        type={type}
      />
    </Field>
  );
}

// Contact form section. Submission handling can be wired here when a backend exists.
export default function ContactSection() {
  const [nameField, companyField, emailField] = contactFields;

  return (
    <section className="py-24 bg-surface-container-low" id="contatti">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl tracking-tight text-on-background mb-4">Inizia il tuo progetto</h2>
          <p className="font-body text-on-surface-variant">
            Raccontaci la tua idea.
          </p>
          <p className="font-body text-on-surface-variant">
            I nostri esperti ti contatteranno per una valutazione iniziale, senza impegno.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border-t-4 border-primary p-8 shadow-[0_4px_20px_rgba(19,27,46,0.04)]">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField {...nameField} />
              <TextField {...companyField} />
            </div>

            <TextField {...emailField} />

            <Field id="interest" label="Area di Interesse">
              <select
                className={FIELD_CONTROL_CLASS}
                id="interest"
              >
                {interestOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            <Field id="message" label="Messaggio">
              <textarea
                className={TEXT_FIELD_CLASS}
                id="message"
                placeholder="Descrivi brevemente il tuo progetto..."
                rows="4"
              />
            </Field>

            <button
              className="w-full inline-flex items-center justify-center px-6 py-4 rounded-md text-base font-medium transition-all duration-200 bg-primary text-on-primary bg-gradient-to-br from-primary to-primary-container shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_40px_rgba(34,42,62,0.15)] active:scale-95"
              type="submit"
            >
              Invia Richiesta
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
