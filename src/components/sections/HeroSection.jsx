import SectionShell from '../SectionShell';
import FactoryIllustration from '../hero/FactoryIllustration';
import HeroParticleField from '../hero/HeroParticleField';
import { useHeroInteractions } from '../hero/useHeroInteractions';

function HeroBackground({
  factoryParallaxRef,
  factoryStageRef,
  hoverLightCoreRef,
  hoverLightRef,
  pointerRef
}) {
  return (
    <>
      <div className="hero-atmosphere-base absolute inset-0" />
      <div className="section-grid-layer hero-atmosphere-grid absolute inset-0" />
      <HeroParticleField factoryStageRef={factoryStageRef} pointerRef={pointerRef} />
      <div ref={hoverLightRef} className="hero-hover-light">
        <span ref={hoverLightCoreRef} className="hero-hover-light-core" />
      </div>

      <div ref={factoryStageRef} className="hero-factory-stage">
        <div ref={factoryParallaxRef} className="hero-factory-parallax">
          <div className="hero-factory-visual">
            <FactoryIllustration />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d1a30] to-transparent sm:h-28" />
    </>
  );
}

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
    <SectionShell
      background={
        <HeroBackground
          factoryParallaxRef={factoryParallaxRef}
          factoryStageRef={factoryStageRef}
          hoverLightCoreRef={hoverLightCoreRef}
          hoverLightRef={hoverLightRef}
          pointerRef={pointerRef}
        />
      }
      backgroundClassName="hero-atmosphere"
      id="hero"
      variant="hero"
      {...heroEventHandlers}
    >
      <div className="hero-reveal hero-content max-w-4xl">
        <div className="md:flex md:w-fit md:flex-col md:items-stretch lg:block lg:w-auto">
          <h1 className="hero-title-balance font-headline text-[2.5rem] leading-[1.1] tracking-tight text-surface-bright sm:text-[2.9rem] lg:text-[3.4rem] mb-8">
            Consulenza informatica
            <br /> e innovazione,
            <br />
            per la crescita
            <br className="2xl:hidden" /> del tuo{' '}
            <span className="text-tertiary-fixed">business</span>
          </h1>
          <p className="font-body text-lg text-[#d4dbea] mb-12 max-w-2xl leading-relaxed lg:text-xl">
            Ogni realtà ha processi, obiettivi e sfide diverse.
            <br />
            Noi li trasformiamo in soluzioni digitali mirate ed efficaci,
            <br />
            progettate per generare valore concreto.
          </p>
          <div className="hero-actions flex flex-col lg:flex-row gap-4">
            <a
              href="#contatti"
              className="hero-consultancy-cta inline-flex items-center justify-center px-8 py-4 rounded-md text-[1.0625rem] font-medium transition-all duration-300 bg-[#95e3ff] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95 lg:w-[16.5rem] xl:w-[18rem]"
            >
              <span className="cta-underline-label">Richiedi una Consulenza</span>
            </a>
            <a
              href="#siti-web"
              className="hero-solutions-cta inline-flex items-center justify-center px-8 py-4 rounded-md border border-white/25 bg-white/5 text-surface-bright text-[1.0625rem] font-medium transition-all duration-300 hover:bg-white/10 active:scale-95 lg:w-[16rem] xl:w-[18rem]"
            >
              <span className="cta-underline-label">Scopri le Soluzioni</span>
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
