import FactoryIllustration from '../hero/FactoryIllustration';
import HeroParticleField from '../hero/HeroParticleField';
import { useHeroInteractions } from '../hero/useHeroInteractions';

const HERO_SHELL_CLASS = 'hero-shell section-grid-bg--hero relative isolate overflow-hidden pt-16 pb-28 lg:pt-24 lg:pb-40';

export default function HeroSection() {
  const {
    pointerRef,
    factoryStageRef,
    factoryParallaxRef,
    hoverLightRef,
    hoverLightCoreRef,
    heroEventHandlers
  } = useHeroInteractions();

  return (
    <section id="hero" className={HERO_SHELL_CLASS} {...heroEventHandlers}>
      <div aria-hidden="true" className="hero-atmosphere absolute inset-0 z-0">
        <div className="hero-atmosphere-base absolute inset-0" />
        <div className="section-grid-layer hero-atmosphere-grid absolute inset-0" />
        <HeroParticleField pointerRef={pointerRef} />
        <div className="hero-atmosphere-glow absolute inset-0" />
        <div ref={hoverLightRef} className="hero-hover-light">
          <span ref={hoverLightCoreRef} className="hero-hover-light-core" />
        </div>
        <div className="hero-atmosphere-stream hero-atmosphere-stream-a absolute inset-0" />
        <div className="hero-atmosphere-stream hero-atmosphere-stream-b absolute inset-0" />

        <div ref={factoryStageRef} className="hero-factory-stage">
          <div ref={factoryParallaxRef} className="hero-factory-parallax">
            <div className="hero-factory-visual">
              <FactoryIllustration />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#081022] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 relative z-10">
        <div className="hero-reveal hero-content max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-surface-bright backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-tertiary-fixed" />
            Consulenza Informatica
          </div>
          <div className="md:flex md:w-fit md:flex-col md:items-stretch lg:block lg:w-auto">
            <h1 className="hero-title-balance font-headline text-[3rem] leading-[1.05] tracking-tight text-surface-bright sm:text-[3.4rem] lg:text-[4rem] mb-6">
              Soluzioni digitali
              <br className="hidden md:block" />
              <br className="md:hidden" />
              e innovazione,
              <br className="hidden md:block" />
              <br className="md:hidden" />
              alla portata <br className="md:hidden" />di <span className="text-tertiary-fixed">tutti</span>
            </h1>
            <p className="font-body text-lg text-[#d4dbea] mb-10 max-w-2xl leading-relaxed sm:text-xl">
              Consulenza su misura per
              <br className="lg:hidden" />
              {' '}far crescere il tuo business
            </p>
            <div className="hero-actions flex flex-col lg:flex-row gap-4">
              <a
                href="#contatti"
                className="hero-consultancy-cta inline-flex items-center justify-center px-8 py-4 rounded-md text-[1.0625rem] font-medium transition-all duration-300 bg-[#b6ebff] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95"
              >
                <span>Richiedi una Consulenza</span>
              </a>
              <a
                href="#siti-web"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-white/25 bg-white/5 text-surface-bright text-[1.0625rem] font-medium transition-all duration-300 hover:bg-white/10 active:scale-95"
              >
                Scopri le Soluzioni
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
