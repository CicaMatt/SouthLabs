import { useMemo, useState } from 'react';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };
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

function VolcanoIllustration({ eruptionKey }) {
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

        {/* Plume cloud fill */}
        <radialGradient
          id="vPlumeFill"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 106) scale(122 72)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#0A2B6A" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#0A2B6A" stopOpacity="0.02" />
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
        <path
          d="
            M 8 494
            C 78 472, 196 304, 268 218
            C 280 210, 290 207, 300 207
            C 310 207, 320 210, 332 218
            C 404 304, 522 472, 592 494
            Z
          "
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
        <ellipse
          className="v-plume-ring"
          cx="300" cy="106" rx="118" ry="70"
          fill="url(#vPlumeFill)"
          stroke="#52CCED" strokeWidth="2.2" strokeDasharray="18 11"
        />

        {/* Circuit base rail */}
        <path className="v-circuit-rail"
          d="M 206 118 L 394 118"
          stroke="#46CCFA" strokeWidth="2" strokeOpacity="0.72" strokeLinecap="round" />

        {/* Bar chart — 5 bars of increasing then decreasing height */}
        <line x1="234" y1="118" x2="234" y2="92"  className="v-bar v-bar-1" stroke="#46CCFA" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.9" />
        <line x1="260" y1="118" x2="260" y2="78"  className="v-bar v-bar-2" stroke="#46CCFA" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.9" />
        <line x1="288" y1="118" x2="288" y2="64"  className="v-bar v-bar-3" stroke="#46CCFA" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.9" />
        <line x1="316" y1="118" x2="316" y2="76"  className="v-bar v-bar-4" stroke="#46CCFA" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.9" />
        <line x1="344" y1="118" x2="344" y2="90"  className="v-bar v-bar-5" stroke="#46CCFA" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.9" />

        {/* Horizontal circuit connectors */}
        <path className="v-circuit-rail" d="M 210 104 L 244 104" stroke="#78E2FF" strokeWidth="2" strokeOpacity="0.60" strokeLinecap="round" />
        <path className="v-circuit-rail" d="M 350 104 L 390 104" stroke="#78E2FF" strokeWidth="2" strokeOpacity="0.60" strokeLinecap="round" />

        {/* Growth trend line */}
        <polyline className="v-trend"
          points="228,114 268,88 310,102 360,74 402,58"
          stroke="#36C6F8" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" fill="none" />
        {/* Arrow head */}
        <polyline className="v-trend"
          points="392,50 404,58 394,68"
          stroke="#36C6F8" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" fill="none" />

        {/* Cyan circuit nodes */}
        <circle cx="226" cy="114" r="5" fill="#8EEDFF" className="v-node" />
        <circle cx="364" cy="104" r="5" fill="#8EEDFF" className="v-node v-node-b" />

        {/* Orange accent nodes */}
        <circle cx="268" cy="88"  r="8" fill="#FFA726" className="v-node-orange" />
        <circle cx="360" cy="74"  r="8" fill="#FFA726" className="v-node-orange v-node-orange-b" />
        <circle cx="404" cy="58"  r="6" fill="#54C8FF" className="v-node v-node-b" />

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

      {/* ── ERUPTION RINGS ────────────────────────────────────────────────── */}
      {eruptionKey ? (
        <g key={eruptionKey} className="v-eruption">
          <circle cx="300" cy="218" r="10" fill="none"
            stroke="#A6F5FF" strokeWidth="1.8" className="v-eruption-ring" />
          <circle cx="300" cy="218" r="10" fill="none"
            stroke="#7AE8FF" strokeWidth="1.2" className="v-eruption-ring v-eruption-ring-b" />
        </g>
      ) : null}
    </svg>
  );
}

export default function HeroSection() {
  const [pointer, setPointer] = useState(DEFAULT_POINTER);
  const [isActive, setIsActive] = useState(false);
  const [wave, setWave]         = useState(null);
  const [eruptionKey, setEruptionKey] = useState(null);

  const handlePointerMove  = (e) => { setPointer(getPointerState(e)); setIsActive(true); };
  const handlePointerLeave = ()  => { setPointer(DEFAULT_POINTER); setIsActive(false); };
  const handlePointerDown  = (e) => {
    const p = getPointerState(e);
    setPointer(p);
    setIsActive(true);
    setEruptionKey(Date.now());
    setWave({ key: Date.now(), pctX: p.pctX, pctY: p.pctY });
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

        {wave ? (
          <span
            key={wave.key}
            className="hero-click-wave absolute inset-0"
            style={{ '--hero-wave-x': `${wave.pctX}%`, '--hero-wave-y': `${wave.pctY}%` }}
          />
        ) : null}

        <div className="hero-volcano-stage">
          <VolcanoIllustration eruptionKey={eruptionKey} />
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
            Soluzioni Digitali e Innovazione,{' '}
            <span className="text-tertiary-fixed">per Tutti</span>
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
              href="#soluzioni-web"
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