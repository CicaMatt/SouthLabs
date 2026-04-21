export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary pt-40 pb-24 lg:pt-56 lg:pb-40">
      <div className="absolute inset-0 z-0">
        <img
          alt="Digital background"
          className="h-full w-full scale-105 object-cover opacity-[0.16] mix-blend-screen"
          data-alt="Abstract view of digital network lines and glowing nodes representing global connectivity and advanced technology in a dark atmospheric setting"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDap7n5H7P8mBpjFUi5ht9dKJ-8P-F5cgzPKeKrHXW7cMDMdjM8sZkGZr4tzyi-NR9jDm3LQwVb9UfDE6qclr4br06kPxinsS7WxDEcbeVNFMEP0TdWd3CoLOE9kwBZdpX_644nP94Hdhc1Y2croIAxDAQNRU62XsnhdfBiY3zTt4iY7sY7BHVSI12zTaFOO-6lNCEente52quYNRBZzTFSwpyRTgE64d6NgcZ3WmZt7rRAZODI-A0XkAowMYjJh4xiH8sFT96d9hw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#141e35] to-[#0a1120]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(71,214,255,0.24),transparent_45%),radial-gradient(circle_at_82%_78%,rgba(190,198,224,0.2),transparent_40%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0a1120] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="hero-reveal max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-surface-bright backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-tertiary-fixed" />
              Digital Consulting
            </div>
            <h1 className="font-headline text-[3rem] leading-[1.05] tracking-tight text-surface-bright sm:text-[3.4rem] lg:text-[4rem] mb-6">
              Soluzioni Digitali e Innovazione, <span className="text-tertiary-fixed">per Tutti</span>
            </h1>
            <p className="font-body text-lg text-[#d4dbea] mb-10 max-w-2xl leading-relaxed sm:text-xl">
              Consulenza tecnologica su misura per far crescere il tuo business. Progettiamo soluzioni architetturali per aziende che puntano al futuro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                className="group inline-flex items-center justify-center px-8 py-4 rounded-md text-base font-medium transition-all duration-300 bg-gradient-to-br from-tertiary-fixed to-[#9ce6fb] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95"
                href="#contatti"
              >
                Richiedi una Consulenza
                <span className="material-symbols-outlined ml-2 text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </a>
              <a
                className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-white/25 bg-white/5 text-surface-bright text-base font-medium transition-all duration-300 hover:bg-white/10 active:scale-95"
                href="#soluzioni-web"
              >
                Scopri le Soluzioni
              </a>
            </div>
          </div>

          <div className="hero-reveal-delayed hidden lg:block">
            <div className="hero-graphic ml-auto flex aspect-square w-full max-w-md items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-[0_30px_80px_rgba(2,8,25,0.55)]">
              <div className="hero-graphic-core relative h-[78%] w-[78%] rounded-full border border-white/20">
                <div className="hero-ring absolute inset-0 rounded-full border border-white/15" />
                <div className="hero-ring hero-ring-reverse absolute inset-[13%] rounded-full border border-tertiary-fixed/35" />
                <div className="hero-ring absolute inset-[26%] rounded-full border border-white/15" />
                <div className="hero-node absolute left-[17%] top-[33%] h-2.5 w-2.5 rounded-full bg-tertiary-fixed shadow-[0_0_14px_rgba(71,214,255,0.9)]" />
                <div className="hero-node hero-node-delayed absolute right-[20%] top-[24%] h-2.5 w-2.5 rounded-full bg-[#9ce6fb] shadow-[0_0_14px_rgba(156,230,251,0.85)]" />
                <div className="hero-node absolute bottom-[22%] left-[50%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#d2e6f4] shadow-[0_0_12px_rgba(210,230,244,0.75)]" />
                <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle,rgba(71,214,255,0.48),rgba(71,214,255,0.05)_68%,transparent)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
