export default function ContactSection() {
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

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(19,27,46,0.04)]">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label text-sm font-medium text-on-surface-variant mb-2" htmlFor="name">
                  Nome e Cognome
                </label>
                <input
                  className="w-full bg-surface-container-high border-0 rounded-md focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[inset_0_0_0_1px_rgba(71,214,255,1)] transition-colors py-3 px-4 text-on-background placeholder:text-outline-variant"
                  id="name"
                  placeholder="Mario Rossi"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-label text-sm font-medium text-on-surface-variant mb-2" htmlFor="company">
                  Azienda
                </label>
                <input
                  className="w-full bg-surface-container-high border-0 rounded-md focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[inset_0_0_0_1px_rgba(71,214,255,1)] transition-colors py-3 px-4 text-on-background placeholder:text-outline-variant"
                  id="company"
                  placeholder="La tua azienda Srl"
                  type="text"
                />
              </div>
            </div>

            <div>
              <label className="block font-label text-sm font-medium text-on-surface-variant mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full bg-surface-container-high border-0 rounded-md focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[inset_0_0_0_1px_rgba(71,214,255,1)] transition-colors py-3 px-4 text-on-background placeholder:text-outline-variant"
                id="email"
                placeholder="mario.rossi@esempio.it"
                type="email"
              />
            </div>

            <div>
              <label className="block font-label text-sm font-medium text-on-surface-variant mb-2" htmlFor="interest">
                Area di Interesse
              </label>
              <select
                className="w-full bg-surface-container-high border-0 rounded-md focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[inset_0_0_0_1px_rgba(71,214,255,1)] transition-colors py-3 px-4 text-on-background"
                id="interest"
              >
                <option>Sviluppo Web / E-commerce</option>
                <option>Software Custom & AI</option>
                <option>Infrastruttura & Sicurezza</option>
                <option>Assistenza Tecnica</option>
              </select>
            </div>

            <div>
              <label className="block font-label text-sm font-medium text-on-surface-variant mb-2" htmlFor="message">
                Messaggio
              </label>
              <textarea
                className="w-full bg-surface-container-high border-0 rounded-md focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[inset_0_0_0_1px_rgba(71,214,255,1)] transition-colors py-3 px-4 text-on-background placeholder:text-outline-variant"
                id="message"
                placeholder="Descrivi brevemente il tuo progetto..."
                rows="4"
              />
            </div>

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
