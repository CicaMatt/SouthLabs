import SectionHeader from '../SectionHeader';

export default function WebSolutionsSection() {
  return (
    <section className="py-24 bg-surface" id="siti-web">
      <div className="max-w-7xl mx-auto px-8">
        <SectionHeader
          className="mb-16 max-w-2xl"
          title="Siti Web"
          subtitle="Progettate per la massima conversione della tua attività."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(19,27,46,0.04)] flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed opacity-50 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg data-glass flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">code_blocks</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-on-background mb-3">Web App Personalizzate</h3>
              <p className="font-body text-on-surface-variant mb-6 max-w-md">
                Applicazioni personalizzate per il tuo business, per garantire efficienza, sicurezza e continuità nel tempo.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(19,27,46,0.04)] flex flex-col group">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary">web</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-background mb-3">Soluzioni WordPress</h3>
            <p className="font-body text-sm text-on-surface-variant mb-4 flex-grow">
              Siti vetrina ottimizzati per SEO e visibilità, veloci e gestibili in autonomia.
            </p>
          </div>

          <div className="md:col-span-3 bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(19,27,46,0.04)] flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-grow">
              <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-secondary-container">shopping_cart</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-on-background mb-3">Piattaforme di E-commerce</h3>
              <p className="font-body text-on-surface-variant max-w-2xl mb-4">
                Piattaforme di vendita online sicure ed efficaci, integrabili con i più noti metodi di pagamento.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-1/3 h-48 rounded-lg overflow-hidden bg-surface-container-high">
              <img
                alt="E-commerce"
                className="w-full h-full object-cover"
                data-alt="Close up of a credit card being used on a modern laptop for online shopping, warm lighting, professional e-commerce setting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDji1lh-q9t0KkejNtbdi2KNXG-tmfr-PykhKcX_FT3H1rJltjicA0HN7lN-fir1uUwhzUvLEzDMjhKaNGxgmdNhbi8sWYLFuvw6ycLTitnnc2zMlWJ9O8HiL5887QNapUzaptmfP4Fsq9RzWiOoOIvTaJGv9Rd_nUs082EXxhJRh9SHvPgCLWR6sOQmdzwuI69YsIZdIHDWT9re3Dlsa-_T0MgiwSImlUZabLgWjY4y4yESpnJ9mHHga1H313hbqk_njpsdx7cIZI"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
