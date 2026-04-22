import { useMemo, useState } from 'react';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function getPointerState(e) {
  const b = e.currentTarget.getBoundingClientRect();
  const rx = clamp((e.clientX - b.left) / b.width, 0, 1);
  const ry = clamp((e.clientY - b.top) / b.height, 0, 1);
  return {
    pctX: Number((rx * 100).toFixed(2)),
    pctY: Number((ry * 100).toFixed(2)),
    shiftX: Number(((rx - 0.5) * 2).toFixed(4)),
    shiftY: Number(((ry - 0.5) * 2).toFixed(4))
  };
}

function VolcanoIllustration({ eruptionKey }) {
  /*
   * GEOMETRY
   * ─────────────────────────────────────────────────────────────────────────
   * ViewBox 0 0 600 540.
   *
   * MOUNTAIN SILHOUETTE — one unified path:
   *   Left flank:  cubic bezier  (22, 494) → (232, 218)
   *   Back rim:    two arcs      (232, 218) → (300, 202) → (368, 218)
   *                              This arch is the HIGHEST visible point —
   *                              the far wall of the crater as seen from
   *                              slightly in front.
   *   Right flank: cubic bezier  (368, 218) → (578, 494)
   *   Base:        implicit Z close
   *
   * The flanks DO NOT meet at a tip — they terminate at the crater rim
   * edges (232, 218) and (368, 218). The volcano is 136 px wide at the rim.
   *
   * CRATER BOWL — a concave path carved into the mountain top:
   *   Re-uses the same back-rim arc as the mountain top, then curves
   *   inward and downward to a floor at y ≈ 245, then back.
   *   This creates a true bowl depression, not a placed overlay.
   *
   * Depth is reinforced by four layers:
   *   1. Bowl fill       — dark radial gradient (darkest at floor centre)
   *   2. Back-wall arc   — lighter inner-rim stroke (lit far wall)
   *   3. Front-lip arc   — faint near-rim highlight (rim has thickness)
   *   4. Floor glow      — animated vent glow ellipse
   *
   * Ridge strokes originate near the crater rim and run down the flanks,
   * converging upward to point at the crater.
   * ─────────────────────────────────────────────────────────────────────────
   */
  return (
    <svg
      viewBox="0 0 600 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="v-svg"
    >
      <defs>
        {/* Mountain — left-to-right: dark navy → mid-blue → cyan-blue → dark navy */}
        <linearGradient id="vMtn" x1="22" y1="0" x2="578" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#051848" stopOpacity="0.97" />
          <stop offset="22%"  stopColor="#0B3C8A" stopOpacity="0.94" />
          <stop offset="50%"  stopColor="#166EC8" stopOpacity="0.90" />
          <stop offset="74%"  stopColor="#2AACE0" stopOpacity="0.87" />
          <stop offset="100%" stopColor="#093680" stopOpacity="0.93" />
        </linearGradient>

        {/* Crater bowl depth — darkest at floor centre, lightening toward rim */}
        <radialGradient
          id="vCraterBowl"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 234) scale(74 30)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#00060D" />
          <stop offset="40%"  stopColor="#031940" />
          <stop offset="78%"  stopColor="#083064" />
          <stop offset="100%" stopColor="#0C4088" stopOpacity="0.85" />
        </radialGradient>

        {/* Volcanic vent glow at crater floor */}
        <radialGradient
          id="vCraterGlow"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 236) scale(34 11)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#50DDFF" stopOpacity="0.95" />
          <stop offset="55%"  stopColor="#1686BE" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#0E4484" stopOpacity="0" />
        </radialGradient>

        {/* Base aura */}
        <radialGradient
          id="vAura"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 494) scale(254 58)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#34BBEC" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#34BBEC" stopOpacity="0" />
        </radialGradient>

        {/* Plume cloud background fill */}
        <radialGradient
          id="vPlumeFill"
          cx="0" cy="0" r="1"
          gradientTransform="translate(300 106) scale(122 72)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#0A2B6A" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#0A2B6A" stopOpacity="0.02" />
        </radialGradient>

        {/* Wave stroke gradient */}
        <linearGradient id="vWave" x1="20" y1="0" x2="596" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#26AEEA" stopOpacity="0.10" />
          <stop offset="50%"  stopColor="#56CEFF" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#26AEEA" stopOpacity="0.10" />
        </linearGradient>
      </defs>

      {/* ── BASE AURA ────────────────────────────────────────────────────── */}
      <ellipse cx="300" cy="494" rx="254" ry="58" fill="url(#vAura)" className="v-aura" />

      {/* ── FLOATING GROUP (mountain + crater + plume) ───────────────────── */}
      <g className="v-float-group">

        {/*
         * MOUNTAIN BODY
         * Left flank:  (22,494) → (232,218)  via CP (90,470)(190,294)
         * Back rim:    (232,218)→(300,202)→(368,218)  — the visible far rim
         * Right flank: (368,218) → (578,494) via CP (410,294)(510,470)
         */}
        <path
          className="v-mountain"
          d="
            M 22 494
            C 90 470, 190 294, 232 218
            C 252 207, 276 202, 300 202
            C 324 202, 348 207, 368 218
            C 410 294, 510 470, 578 494
            Z
          "
          fill="url(#vMtn)"
          stroke="#9ADFF0"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/*
         * RIDGE LINES
         * Start near the crater rim edges and run down the flanks.
         * Converge toward the summit, reinforcing the cone geometry.
         */}
        <path className="v-ridge"
          d="M 248 228 C 204 340, 152 422, 114 492"
          stroke="#76DAFF" strokeOpacity="0.48" strokeWidth="2"
          strokeLinecap="round" strokeDasharray="12 9" />
        <path className="v-ridge v-ridge-b"
          d="M 300 248 L 300 492"
          stroke="#76DAFF" strokeOpacity="0.38" strokeWidth="1.8"
          strokeLinecap="round" strokeDasharray="10 8" />
        <path className="v-ridge v-ridge-c"
          d="M 352 228 C 396 340, 448 422, 486 492"
          stroke="#76DAFF" strokeOpacity="0.48" strokeWidth="2"
          strokeLinecap="round" strokeDasharray="12 9" />

        {/*
         * CRATER BOWL
         * Re-traces the back-rim arc (identical to mountain top),
         * then curves inward to the crater floor and back.
         * This is a concave bowl, not a circle placed on top.
         *
         * Back rim:   M 232 218 → (300,202) → 368 218   [same path as mountain top]
         * Right wall: 368,218 → 318,245                 [inner right wall]
         * Floor:      318,245 → 282,245                 [crater floor]
         * Left wall:  282,245 → 232,218                 [inner left wall]
         */}
        <path
          className="v-crater-bowl"
          d="
            M 232 218
            C 252 207, 276 202, 300 202
            C 324 202, 348 207, 368 218
            C 354 228, 337 241, 318 245
            C 308 249, 292 249, 282 245
            C 263 241, 246 228, 232 218
            Z
          "
          fill="url(#vCraterBowl)"
        />

        {/*
         * INNER BACK-WALL ARC
         * The lit crest of the far inner crater wall — seen looking into
         * the bowl. Lighter stroke = sunlit rim edge on the far side.
         */}
        <path
          className="v-crater-backwall"
          d="M 252 221 C 267 213, 283 209, 300 209 C 317 209, 333 213, 348 221"
          fill="none"
          stroke="#58D8FF" strokeWidth="1.8" strokeOpacity="0.68" strokeLinecap="round"
        />

        {/*
         * FRONT LIP ARC
         * Faint arc below the rim — the near-side face of the rim,
         * giving the crater wall visible thickness.
         */}
        <path
          className="v-crater-lip"
          d="M 232 218 C 252 227, 276 231, 300 232 C 324 231, 348 227, 368 218"
          fill="none"
          stroke="#C6F2FF" strokeWidth="1.5" strokeOpacity="0.34" strokeLinecap="round"
        />

        {/* OUTER RIM HIGHLIGHT — the prominent ridge at the crater mouth */}
        <path
          className="v-crater-rim"
          d="M 232 218 C 252 207, 276 202, 300 202 C 324 202, 348 207, 368 218"
          fill="none"
          stroke="#A4ECFF" strokeWidth="3.2" strokeLinecap="round"
        />

        {/* CRATER FLOOR GLOW — volcanic heat at the vent */}
        <ellipse
          className="v-crater-glow"
          cx="300" cy="237" rx="33" ry="10"
          fill="url(#vCraterGlow)"
        />

        {/* Plume stem — rises from the back-rim peak */}
        <line
          className="v-stem"
          x1="300" y1="202" x2="300" y2="168"
          stroke="#86E8FF" strokeWidth="2.6" strokeLinecap="round"
        />

        {/* ── PLUME CLOUD ───────────────────────────────────────────────── */}
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

        {/* Growth trend line — exits cloud toward top-right */}
        <polyline
          className="v-trend"
          points="228,114 268,88 310,102 360,74 402,58"
          stroke="#36C6F8" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round"
          strokeOpacity="0.9" fill="none"
        />
        <polyline
          className="v-trend"
          points="392,50 404,58 394,68"
          stroke="#36C6F8" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round"
          strokeOpacity="0.9" fill="none"
        />

        {/* Cyan circuit nodes */}
        <circle cx="226" cy="114" r="5" fill="#8EEDFF" className="v-node" />
        <circle cx="364" cy="104" r="5" fill="#8EEDFF" className="v-node v-node-b" />

        {/* Orange accent nodes */}
        <circle cx="268" cy="88"  r="8" fill="#FFA726" className="v-node-orange" />
        <circle cx="360" cy="74"  r="8" fill="#FFA726" className="v-node-orange v-node-orange-b" />
        <circle cx="404" cy="58"  r="6" fill="#54C8FF" className="v-node v-node-b" />

      </g>

      {/* ── WAVES (anchored, don't float) ────────────────────────────────── */}
      <path className="v-wave"
        d="M 20 510 C 90 528, 163 532, 228 517 C 290 502, 346 502, 404 521 C 445 534, 490 536, 534 522 C 558 512, 581 512, 596 518"
        stroke="url(#vWave)" strokeWidth="4.8" strokeLinecap="round" fill="none" />
      <path className="v-wave v-wave-b"
        d="M 32 535 C 99 552, 166 554, 228 540 C 289 526, 346 528, 397 544 C 430 556, 470 556, 511 545 C 539 536, 567 536, 596 542"
        stroke="url(#vWave)" strokeWidth="3.6" strokeLinecap="round" fill="none" />
      <path className="v-wave"
        d="M 62 557 C 124 568, 180 568, 234 556 C 290 543, 340 545, 382 557"
        stroke="url(#vWave)" strokeWidth="2.8" strokeLinecap="round" strokeOpacity="0.44" fill="none" />

      {/* ── ERUPTION RINGS (on click) ─────────────────────────────────────── */}
      {eruptionKey ? (
        <g key={eruptionKey} className="v-eruption">
          <circle cx="300" cy="220" r="14" fill="none"
            stroke="#A6F5FF" strokeWidth="2.2" className="v-eruption-ring" />
          <circle cx="300" cy="220" r="14" fill="none"
            stroke="#7AE8FF" strokeWidth="1.6" className="v-eruption-ring v-eruption-ring-b" />
        </g>
      ) : null}
    </svg>
  );
}

export default function HeroSection() {
  const [pointer, setPointer] = useState(DEFAULT_POINTER);
  const [isActive, setIsActive] = useState(false);
  const [wave, setWave] = useState(null);
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
            Consulenza tecnologica su misura per far crescere il tuo business.
            Progettiamo soluzioni architetturali per aziende che puntano al futuro.
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
