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
        <polyline className="v-trend v-plume-trend-out" points="206,122 248,92 314,108 374,74 416,60 452,42" />

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

function VolcanoIllustration({ svgRef }) {
  /*
   * GEOMETRY — viewBox 0 0 600 540
   *
   * Base:        x = 8  →  592   (584 px wide)
   * Crater rim:  x = 268 → 332   (64 px wide)
   * Back-rim peak: (300, 207)
   *
   * DESIGN INTENT
   * The mountain fill uses the same colour family as the hero background
   * (dark blue, semi-transparent) so it reads as a shape carved out of the
   * atmosphere rather than a solid object placed on top of it.
   * A single bright-cyan outline stroke defines the silhouette.
   * The crater is the only zone with higher contrast: a deep bowl fill
   * and an animated vent glow.
   * Everything else — ridge lines, plume, waves — is at low opacity,
   * reinforcing the integrated look.
   */
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="v-svg"
    >
      <defs>
        {/*
         * Mountain fill — semi-transparent blues that sit inside
         * the hero's existing dark-blue atmosphere.
         * Left facet slightly lighter, right slightly darker, centre teal
         * so the cone still reads as three-dimensional.
         */}
        <linearGradient id="vMtn" x1="8" y1="340" x2="592" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0D2754" stopOpacity="0.55" />
          <stop offset="28%"  stopColor="#113A7A" stopOpacity="0.48" />
          <stop offset="54%"  stopColor="#0E5A96" stopOpacity="0.40" />
          <stop offset="78%"  stopColor="#0E4882" stopOpacity="0.44" />
          <stop offset="100%" stopColor="#0A2450" stopOpacity="0.52" />
        </linearGradient>
        <path
          id="vMtnShape"
          d="
            M 8 494
            C 78 472, 196 304, 268 218
            C 280 210, 290 207, 300 207
            C 310 207, 320 210, 332 218
            C 404 304, 522 472, 592 494
            Z
          "
        />
        <clipPath id="vMtnClip">
          <use href="#vMtnShape" />
        </clipPath>

        {/* Crater bowl — opaque dark core so the bowl reads as depth */}
        <radialGradient
          id="vCraterBowl"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 228) scale(40 18)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#010810" />
          <stop offset="45%"  stopColor="#021428" />
          <stop offset="100%" stopColor="#072448" stopOpacity="0.80" />
        </radialGradient>

        {/* Volcanic vent glow */}
        <radialGradient
          id="vCraterGlow"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 230) scale(20 8)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#5ADFFF" stopOpacity="1"   />
          <stop offset="60%"  stopColor="#1A88C2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0E4484" stopOpacity="0"   />
        </radialGradient>

        {/* Subtle base glow bleeding into the bg */}
        <radialGradient
          id="vAura"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 494) scale(290 52)"
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
            C 286 179, 271 186, 254 186
            C 234 186, 216 175, 206 158
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
        <linearGradient id="vWave" x1="8" y1="0" x2="592" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#38B8EE" stopOpacity="0.06" />
          <stop offset="50%"  stopColor="#58CEFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#38B8EE" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* ── BASE AURA ─────────────────────────────────────────────────────── */}
      <ellipse cx="300" cy="496" rx="290" ry="52" fill="url(#vAura)" className="v-aura" />

      {/* ── FLOATING GROUP ────────────────────────────────────────────────── */}
      <g className="v-float-group">

        {/*
         * MOUNTAIN BODY
         * Semi-transparent fill + single outline stroke.
         * Wide base (8 → 592), narrow summit (268 → 332).
         */}
        <use
          href="#vMtnShape"
          fill="url(#vMtn)"
          stroke="#5ECFEE"
          strokeWidth="1.8"
          strokeOpacity="0.55"
          strokeLinejoin="round"
        />

        {/*
         * RIDGE LINES — very faint, just enough to suggest the cone facets
         */}
        <path className="v-ridge"
          d="M 272 226 C 214 340, 148 422, 96 492"
          stroke="#58C8EE" strokeOpacity="0.18" strokeWidth="1.4"
          strokeLinecap="round" strokeDasharray="10 9" />
        <path className="v-ridge v-ridge-b"
          d="M 300 244 L 300 492"
          stroke="#58C8EE" strokeOpacity="0.14" strokeWidth="1.2"
          strokeLinecap="round" strokeDasharray="8 8" />
        <path className="v-ridge v-ridge-c"
          d="M 328 226 C 386 340, 452 422, 504 492"
          stroke="#58C8EE" strokeOpacity="0.18" strokeWidth="1.4"
          strokeLinecap="round" strokeDasharray="10 9" />

        {/* Logo-inspired internal wave ribbons */}
        <g className="v-mtn-wave-group" clipPath="url(#vMtnClip)" transform="translate(0 -34)">
          <path className="v-mtn-wave v-mtn-wave-a"
            d="M 40 466 C 114 486, 180 480, 242 448 C 304 416, 368 416, 430 446 C 490 474, 544 474, 586 458"
            stroke="url(#vWave)" fill="none" />
          <path className="v-mtn-wave v-mtn-wave-b"
            d="M 58 488 C 126 506, 188 500, 246 472 C 306 442, 366 442, 424 468 C 476 492, 526 492, 566 478"
            stroke="url(#vWave)" fill="none" />
          <path className="v-mtn-wave v-mtn-wave-c"
            d="M 82 500 C 142 512, 198 510, 250 492 C 304 474, 358 474, 410 490 C 454 504, 492 504, 526 496"
            stroke="url(#vWave)" fill="none" />
          <path className="v-mtn-wave v-mtn-wave-e"
            d="M 96 516 C 150 524, 202 522, 252 508 C 304 492, 354 492, 404 506 C 444 516, 476 516, 508 510"
            stroke="url(#vWave)" fill="none" />

          {/* Crest foam artifact to make ribbons read as water waves */}
          <g className="v-mtn-crest-group" transform="translate(0 -3)">
            <path className="v-mtn-crest v-mtn-crest-a"
              d="M 40 466 C 114 486, 180 480, 242 448 C 304 416, 368 416, 430 446 C 490 474, 544 474, 586 458"
              fill="none" />
            <path className="v-mtn-crest v-mtn-crest-b"
              d="M 58 488 C 126 506, 188 500, 246 472 C 306 442, 366 442, 424 468 C 476 492, 526 492, 566 478"
              fill="none" />
            <path className="v-mtn-crest v-mtn-crest-c"
              d="M 82 500 C 142 512, 198 510, 250 492 C 304 474, 358 474, 410 490 C 454 504, 492 504, 526 496"
              fill="none" />
          </g>
        </g>

        {/*
         * CRATER BOWL
         * Opaque dark fill so the bowl reads as genuine depth against the
         * semi-transparent mountain body.
         */}
        <path
          d="
            M 268 218
            C 280 210, 290 207, 300 207
            C 310 207, 320 210, 332 218
            C 327 226, 320 233, 312 237
            C 308 239, 292 239, 288 237
            C 280 233, 273 226, 268 218
            Z
          "
          fill="url(#vCraterBowl)"
        />

        {/* Inner back-wall — lit far rim */}
        <path
          className="v-crater-backwall"
          d="M 276 220 C 284 214, 292 211, 300 211 C 308 211, 316 214, 324 220"
          fill="none"
          stroke="#60DCFF" strokeWidth="1.4" strokeOpacity="0.60" strokeLinecap="round"
        />

        {/* Outer rim highlight — the crater mouth crest, the brightest line */}
        <path
          className="v-crater-rim"
          d="M 268 218 C 280 210, 290 207, 300 207 C 310 207, 320 210, 332 218"
          fill="none"
          stroke="#A8EEFF" strokeWidth="2.6" strokeLinecap="round"
        />

        {/* Floor vent glow */}
        <ellipse
          className="v-crater-glow"
          cx="300" cy="230" rx="20" ry="8"
          fill="url(#vCraterGlow)"
        />

        {/* Plume stem */}
        <line
          className="v-stem"
          x1="300" y1="207" x2="300" y2="172"
          stroke="#86E8FF" strokeWidth="2.6" strokeLinecap="round"
        />

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
  const volcanoSvgRef = useRef(null);
  const boostTimeoutRef = useRef(null);
  const boostedAnimationsRef = useRef([]);

  const resetVolcanoBoost = useCallback(() => {
    if (boostTimeoutRef.current !== null) {
      clearTimeout(boostTimeoutRef.current);
      boostTimeoutRef.current = null;
    }
    boostedAnimationsRef.current.forEach(({ animation, playbackRate }) => {
      animation.playbackRate = playbackRate;
    });
    boostedAnimationsRef.current = [];
  }, []);

  const boostVolcanoAnimations = useCallback(() => {
    const volcanoSvg = volcanoSvgRef.current;
    if (!volcanoSvg || typeof volcanoSvg.getAnimations !== 'function') return;

    resetVolcanoBoost();
    const runningAnimations = volcanoSvg
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
  }, [resetVolcanoBoost]);

  useEffect(() => () => resetVolcanoBoost(), [resetVolcanoBoost]);

  const handlePointerMove  = (e) => { setPointer(getPointerState(e)); setIsActive(true); };
  const handlePointerLeave = ()  => { setPointer(DEFAULT_POINTER); setIsActive(false); };
  const handlePointerDown  = (e) => {
    const p = getPointerState(e);
    setPointer(p);
    setIsActive(true);
    boostVolcanoAnimations();
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

        <div className="hero-volcano-stage">
          <VolcanoIllustration svgRef={volcanoSvgRef} />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#081022] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="hero-reveal hero-content max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-surface-bright backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-tertiary-fixed" />
            Digital Consulting
          </div>
          <h1 className="font-headline text-[3rem] leading-[1.05] tracking-tight text-surface-bright sm:text-[3.4rem] lg:text-[4rem] mb-6">
            Soluzioni digitali e innovazione,{' '}
            alla portata di <span className="text-tertiary-fixed">tutti</span>
          </h1>
          <p className="font-body text-lg text-[#d4dbea] mb-10 max-w-2xl leading-relaxed sm:text-xl">
            Consulenza su misura per far crescere il tuo business
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contatti"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-md text-base font-medium transition-all duration-300 bg-gradient-to-br from-tertiary-fixed to-[#9ce6fb] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95"
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
