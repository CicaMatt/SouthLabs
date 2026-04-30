import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };
const BOOST_PLAYBACK_RATE = 2.8;
const BOOST_DURATION_MS = 520;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function getPointerState(e) {
  const b = e.currentTarget.getBoundingClientRect();
  const rx = clamp((e.clientX - b.left) / b.width, 0, 1);
  const ry = clamp((e.clientY - b.top) / b.height, 0, 1);
  return {
    pctX:   Number((rx * 100).toFixed(2)),
    pctY:   Number((ry * 100).toFixed(2)),
    shiftX: Number(((rx - 0.5) * 2).toFixed(4)),
    shiftY: Number(((ry - 0.5) * 2).toFixed(4))
  };
}

function PlumeCloud() {
  const plumeHeightTransform = 'translate(0 8.64) scale(1 0.92)';
  const plumeInnerMirrorTransform = 'translate(600 0) scale(-1 1)';
  return (
    <g className="v-plume-cloud" transform="translate(600 0) scale(-1 1)">
      <use
        href="#vPlumeShape"
        className="v-plume-shell"
        fill="url(#vPlumeFill)"
        transform={plumeHeightTransform}
      />
      <use
        href="#vPlumeShape"
        className="v-plume-shell-highlight"
        fill="none"
        stroke="#9EEBFF"
        strokeWidth="1.2"
        strokeOpacity="0.42"
        transform={plumeHeightTransform}
      />

      <g transform={plumeInnerMirrorTransform}>
        <polyline className="v-trend v-plume-trend-out" points="206,122 248,92 314,108 374,74 452,42" />

        <g clipPath="url(#vPlumeClip)">
          <line className="v-plume-baseline" x1="172" y1="134" x2="420" y2="134" />
          <line className="v-bar v-bar-1" x1="208" y1="134" x2="208" y2="96" />
          <line className="v-bar v-bar-2" x1="246" y1="134" x2="246" y2="84" />
          <line className="v-bar v-bar-3" x1="286" y1="134" x2="286" y2="60" />
          <line className="v-bar v-bar-4" x1="326" y1="134" x2="326" y2="80" />
          <line className="v-bar v-bar-5" x1="364" y1="134" x2="364" y2="92" />
          <line className="v-bar v-bar-6" x1="400" y1="134" x2="400" y2="106" />

          <line className="v-plume-side-link" x1="176" y1="122" x2="206" y2="122" />
          <line className="v-plume-side-link v-plume-side-link-b" x1="342" y1="108" x2="408" y2="108" />

          <circle cx="208" cy="122" r="6.5" fill="#8EEDFF" className="v-node" />
          <circle cx="364" cy="108" r="6.2" fill="#8EEDFF" className="v-node v-node-b" />

          <circle cx="248" cy="92" r="12.2" fill="#8EEDFF" className="v-node-orange" />
          <circle cx="374" cy="74" r="11.8" fill="#8EEDFF" className="v-node-orange v-node-orange-b" />
        </g>

        <polyline className="v-trend v-plume-trend-arrow v-plume-trend-out" points="440,43 452,42 444,51" />
      </g>
    </g>
  );
}

function FactoryIllustration({ svgRef }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="v-svg"
    >
      <defs>
        <linearGradient id="vFactoryFill" x1="70" y1="238" x2="530" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A2550" stopOpacity="0.60" />
          <stop offset="42%" stopColor="#0E437F" stopOpacity="0.48" />
          <stop offset="76%" stopColor="#0C376D" stopOpacity="0.56" />
          <stop offset="100%" stopColor="#071B3D" stopOpacity="0.60" />
        </linearGradient>
        <linearGradient id="vPipeFill" x1="238" y1="192" x2="304" y2="322" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#123f7f" stopOpacity="0.64" />
          <stop offset="100%" stopColor="#082a5a" stopOpacity="0.56" />
        </linearGradient>
        <linearGradient id="vFootingFill" x1="20" y1="500" x2="580" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A2D62" stopOpacity="0.58" />
          <stop offset="50%" stopColor="#0E4A92" stopOpacity="0.46" />
          <stop offset="100%" stopColor="#0A2D62" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient id="vWindowFill" x1="118" y1="418" x2="478" y2="494" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#20A5EE" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#1281CD" stopOpacity="0.46" />
        </linearGradient>
        <path
          id="vFactoryShape"
          d="
            M 70 500
            L 70 410
            L 420 224
            L 530 320
            L 530 500
            Z
          "
        />
        <clipPath id="vFactoryClip">
          <use href="#vFactoryShape" />
        </clipPath>
        <path
          id="vPipeShape"
          d="
            M 236 322
            L 252 192
            L 290 192
            L 306 285
            Z
          "
        />
        <clipPath id="vPipeClip">
          <use href="#vPipeShape" />
        </clipPath>
        <radialGradient
          id="vPipeGlow"
          cx="0" cy="0" r="1"
          gradientTransform="translate(271 192) scale(18 8)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7EE7FF" stopOpacity="1" />
          <stop offset="62%" stopColor="#2AA1D2" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#0E4382" stopOpacity="0" />
        </radialGradient>

        {/* Subtle base glow bleeding into the bg */}
        <radialGradient
          id="vAura"
          cx="0" cy="0" r="1"
          gradientTransform="translate(292 500) scale(272 52)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#2ABAEE" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2ABAEE" stopOpacity="0"    />
        </radialGradient>

        {/* Plume cloud shape and fills (logo-inspired) */}
        <path
          id="vPlumeShape"
          d="
            M 206 154
            C 183 154, 164 137, 164 114
            C 164 96, 175 81, 192 75
            C 190 69, 190 63, 192 57
            C 196 38, 212 25, 232 25
            C 241 20, 258 12, 277 12
            C 304 12, 327 25, 337 45
            C 345 37, 357 33, 370 33
            C 400 33, 424 56, 424 86
            C 438 93, 448 108, 448 126
            C 448 152, 427 173, 401 173
            C 392 173, 384 171, 376 168
            C 365 178, 351 184, 336 184
            C 321 184, 307 178, 297 168
            C 286 178, 272 186, 255 186
            C 238 186, 223 178, 212 166
            C 209 162, 207 158, 206 154
            Z
          "
        />
        <clipPath id="vPlumeClip">
          <use href="#vPlumeShape" transform="translate(0 8.64) scale(1 0.92)" />
        </clipPath>
        <linearGradient id="vPlumeFill" x1="300" y1="12" x2="300" y2="186" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1A4A8E" stopOpacity="0.58" />
          <stop offset="45%"  stopColor="#11386F" stopOpacity="0.56" />
          <stop offset="100%" stopColor="#081D45" stopOpacity="0.66" />
        </linearGradient>
        <radialGradient
          id="vPlumeCore"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 108) scale(124 72)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#2B6FB7" stopOpacity="0.36" />
          <stop offset="62%"  stopColor="#15437F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0A224C" stopOpacity="0.08" />
        </radialGradient>

        {/* Wave stroke */}
        <linearGradient id="vWave" x1="20" y1="0" x2="580" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#38B8EE" stopOpacity="0.06" />
          <stop offset="50%"  stopColor="#58CEFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#38B8EE" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* ── BASE AURA ─────────────────────────────────────────────────────── */}
      <ellipse cx="292" cy="500" rx="272" ry="52" fill="url(#vAura)" className="v-aura" />

      {/* ── FLOATING GROUP ────────────────────────────────────────────────── */}
      <g className="v-float-group">
        <path d="M 20 500 H 580 V 520 H 20 Z" fill="url(#vWindowFill)" className="v-factory-footing" />

        <use href="#vFactoryShape" fill="url(#vFactoryFill)" className="v-factory-shell" />
        <line className="v-factory-crease" x1="420" y1="224" x2="420" y2="500" />
        <line
          x1="232"
          y1="324"
          x2="310"
          y2="283"
          stroke="#1A4E8A"
          strokeWidth="7.2"
          strokeLinecap="round"
          strokeOpacity="0.96"
          clipPath="url(#vPipeClip)"
        />
        <use href="#vPipeShape" fill="url(#vPipeFill)" className="v-factory-shell v-pipe-shell" />
        <path className="v-pipe-outline" d="M 252 192 L 290 192 M 252 192 L 236 322 M 290 192 L 306 285" />

        <path className="v-factory-window" d="M 132 438 L 188 408 L 188 500 H 132 Z" />
        <path className="v-factory-window v-factory-window-b" d="M 448 420 L 504 469 V 500 H 448 Z" />
        <path className="v-factory-window-highlight" d="M 132 438 L 188 408 L 188 500 H 132 Z" />
        <path className="v-factory-window-highlight v-factory-window-highlight-b" d="M 448 420 L 504 469 V 500 H 448 Z" />

        <path className="v-factory-cutout" d="M 246 370 L 348 310 V 346 L 246 406 Z" />
        <path className="v-factory-cutout v-factory-cutout-b" d="M 246 420 L 348 360 V 396 L 246 456 Z" />
        <path className="v-factory-cutout v-factory-cutout-c" d="M 448 312 L 504 361 V 397 L 448 348 Z" />
        <path className="v-factory-cutout-highlight" d="M 246 370 L 348 310 V 346 L 246 406 Z" />
        <path className="v-factory-cutout-highlight v-factory-cutout-highlight-b" d="M 246 420 L 348 360 V 396 L 246 456 Z" />
        <path className="v-factory-cutout-highlight v-factory-cutout-highlight-c" d="M 448 312 L 504 361 V 397 L 448 348 Z" />

        <line className="v-pipe-link" x1="271" y1="192" x2="271" y2="166" />
        <ellipse className="v-pipe-glow" cx="271" cy="192" rx="18" ry="8" fill="url(#vPipeGlow)" />

        <g className="v-factory-trace-layer">
          <path className="v-factory-trace" d="M 20 500 H 580 V 520 H 20 Z" />
          <use href="#vFactoryShape" className="v-factory-trace" />
          <path className="v-factory-trace" d="M 252 192 L 290 192 M 252 192 L 236 322 M 290 192 L 306 285" />
          <line className="v-factory-trace" x1="271" y1="192" x2="271" y2="166" />
        </g>

        <g className="v-factory-trace-layer v-factory-trace-layer-b">
          <path className="v-factory-trace v-factory-trace-b" d="M 20 500 H 580 V 520 H 20 Z" />
          <use href="#vFactoryShape" className="v-factory-trace v-factory-trace-b" />
          <path className="v-factory-trace v-factory-trace-b" d="M 252 192 L 290 192 M 252 192 L 236 322 M 290 192 L 306 285" />
          <line className="v-factory-trace v-factory-trace-b" x1="271" y1="192" x2="271" y2="166" />
        </g>

        {/* ── PLUME CLOUD ─────────────────────────────────────────────── */}
        <PlumeCloud />

      </g>

      {/* ── WAVES — very faint, blending with background ───────────────────── */}
      <path className="v-wave"
        d="M 8 510 C 86 528, 163 532, 230 517 C 292 502, 348 502, 406 521 C 448 534, 496 536, 540 522 C 562 512, 584 512, 594 518"
        stroke="url(#vWave)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path className="v-wave v-wave-b"
        d="M 14 535 C 90 552, 164 554, 228 540 C 290 526, 348 528, 400 544 C 432 556, 474 556, 516 545 C 542 536, 570 536, 594 542"
        stroke="url(#vWave)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path className="v-wave"
        d="M 40 557 C 108 568, 172 568, 236 556 C 294 543, 346 545, 390 557"
        stroke="url(#vWave)" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.40" fill="none" />

    </svg>
  );
}

export default function HeroSection() {
  const [pointer, setPointer] = useState(DEFAULT_POINTER);
  const [isActive, setIsActive] = useState(false);
  const factorySvgRef = useRef(null);
  const boostTimeoutRef = useRef(null);
  const boostedAnimationsRef = useRef([]);

  const resetFactoryBoost = useCallback(() => {
    if (boostTimeoutRef.current !== null) {
      clearTimeout(boostTimeoutRef.current);
      boostTimeoutRef.current = null;
    }
    boostedAnimationsRef.current.forEach(({ animation, playbackRate }) => {
      animation.playbackRate = playbackRate;
    });
    boostedAnimationsRef.current = [];
  }, []);

  const boostFactoryAnimations = useCallback(() => {
    const factorySvg = factorySvgRef.current;
    if (!factorySvg || typeof factorySvg.getAnimations !== 'function') return;

    resetFactoryBoost();
    const runningAnimations = factorySvg
      .getAnimations({ subtree: true })
      .filter((animation) => typeof CSSAnimation === 'undefined' || animation instanceof CSSAnimation);

    if (!runningAnimations.length) return;

    boostedAnimationsRef.current = runningAnimations.map((animation) => ({
      animation,
      playbackRate: animation.playbackRate || 1
    }));

    boostedAnimationsRef.current.forEach(({ animation, playbackRate }) => {
      animation.playbackRate = playbackRate * BOOST_PLAYBACK_RATE;
    });

    boostTimeoutRef.current = setTimeout(() => {
      boostedAnimationsRef.current.forEach(({ animation, playbackRate }) => {
        animation.playbackRate = playbackRate;
      });
      boostedAnimationsRef.current = [];
      boostTimeoutRef.current = null;
    }, BOOST_DURATION_MS);
  }, [resetFactoryBoost]);

  useEffect(() => () => resetFactoryBoost(), [resetFactoryBoost]);

  const handlePointerMove  = (e) => { setPointer(getPointerState(e)); setIsActive(true); };
  const handlePointerLeave = ()  => { setPointer(DEFAULT_POINTER); setIsActive(false); };
  const handlePointerDown  = (e) => {
    const p = getPointerState(e);
    setPointer(p);
    setIsActive(true);
    boostFactoryAnimations();
  };

  const heroStyle = useMemo(() => ({
    '--hero-pointer-x': `${pointer.pctX}%`,
    '--hero-pointer-y': `${pointer.pctY}%`,
    '--hero-shift-x':   `${pointer.shiftX}`,
    '--hero-shift-y':   `${pointer.shiftY}`,
    '--hero-active':    isActive ? '1' : '0'
  }), [isActive, pointer]);

  return (
    <section
      className="hero-shell relative isolate overflow-hidden bg-primary pt-40 pb-24 lg:pt-56 lg:pb-40"
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={heroStyle}
    >
      <div aria-hidden="true" className="hero-atmosphere absolute inset-0 z-0">
        <div className="hero-atmosphere-base absolute inset-0" />
        <div className="hero-atmosphere-grid absolute inset-0" />
        <div className="hero-atmosphere-glow absolute inset-0" />
        <div className="hero-atmosphere-stream hero-atmosphere-stream-a absolute inset-0" />
        <div className="hero-atmosphere-stream hero-atmosphere-stream-b absolute inset-0" />

        <div className="hero-factory-stage">
          <FactoryIllustration svgRef={factorySvgRef} />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#081022] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="hero-reveal hero-content max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-surface-bright backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-tertiary-fixed" />
            Digital Consulting
          </div>
          <h1 className="hero-title-balance font-headline text-[3rem] leading-[1.05] tracking-tight text-surface-bright sm:text-[3.4rem] lg:text-[4rem] mb-6">
            Soluzioni digitali e innovazione,{' '}
            alla portata di <span className="text-tertiary-fixed">tutti</span>
          </h1>
          <p className="font-body text-lg text-[#d4dbea] mb-10 max-w-2xl leading-relaxed sm:text-xl">
            Consulenza su misura per
            <br className="sm:hidden" />
            {' '}far crescere il tuo business
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contatti"
              className="hero-consultancy-cta group inline-flex items-center justify-center px-8 py-4 rounded-md text-base font-medium transition-all duration-300 bg-gradient-to-br from-tertiary-fixed to-[#9ce6fb] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95"
            >
              Richiedi una Consulenza
              <span className="material-symbols-outlined ml-2 text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </a>
            <a
              href="#siti-web"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-white/25 bg-white/5 text-surface-bright text-base font-medium transition-all duration-300 hover:bg-white/10 active:scale-95"
            >
              Scopri le Soluzioni
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
