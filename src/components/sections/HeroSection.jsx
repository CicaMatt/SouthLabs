import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };
const BOOST_PLAYBACK_RATE = 2.8;
const BOOST_DURATION_MS = 520;
const PLUME_TREND_POINTS = '206,122 248,92 314,108 374,74 452,42';
const PLUME_TREND_ARROW_POINTS = '440,43 452,42 444,51';
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
      <use
        href="#vPlumeShape"
        className="v-plume-core"
        fill="url(#vPlumeCore)"
        transform={plumeHeightTransform}
      />

      <g transform={plumeInnerMirrorTransform}>
        <polyline className="v-graph-halo-line" points={PLUME_TREND_POINTS} />
        <polyline className="v-trend v-plume-trend-out" points={PLUME_TREND_POINTS} />

        <g clipPath="url(#vPlumeClip)">
          <g className="v-graph-grid">
            <line x1="190" y1="72" x2="430" y2="72" />
            <line x1="178" y1="102" x2="420" y2="102" />
            <line x1="172" y1="132" x2="414" y2="132" />
            <line x1="224" y1="52" x2="224" y2="142" />
            <line x1="304" y1="50" x2="304" y2="142" />
            <line x1="384" y1="48" x2="384" y2="142" />
          </g>

          <g className="v-graph-halo-bars">
            <line x1="208" y1="134" x2="208" y2="96" />
            <line x1="246" y1="134" x2="246" y2="84" />
            <line x1="286" y1="134" x2="286" y2="60" />
            <line x1="326" y1="134" x2="326" y2="80" />
            <line x1="364" y1="134" x2="364" y2="92" />
            <line x1="400" y1="134" x2="400" y2="106" />
          </g>

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

          <circle cx="248" cy="92" r="19" className="v-node-ring" />
          <circle cx="248" cy="92" r="12.2" fill="#8EEDFF" className="v-node-orange" />
          <circle cx="374" cy="74" r="18" className="v-node-ring v-node-ring-b" />
          <circle cx="374" cy="74" r="11.8" fill="#8EEDFF" className="v-node-orange v-node-orange-b" />

          <circle cx="248" cy="92" r="3.2" className="v-node-spark" />
          <circle cx="374" cy="74" r="3" className="v-node-spark v-node-spark-b" />
        </g>

        <polyline className="v-graph-sheen" points={PLUME_TREND_POINTS} />
        <polyline className="v-trend v-plume-trend-arrow v-plume-trend-out" points={PLUME_TREND_ARROW_POINTS} />
        <polyline className="v-graph-sheen v-graph-sheen-arrow" points={PLUME_TREND_ARROW_POINTS} />
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
        <linearGradient id="vFactoryFill" x1="70" y1="238" x2="494" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A2550" stopOpacity="0.60" />
          <stop offset="42%" stopColor="#0E437F" stopOpacity="0.48" />
          <stop offset="76%" stopColor="#0C376D" stopOpacity="0.56" />
          <stop offset="100%" stopColor="#071B3D" stopOpacity="0.60" />
        </linearGradient>
        <linearGradient id="vFactorySideFill" x1="380" y1="246" x2="494" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1C6EA2" stopOpacity="0.12" />
          <stop offset="58%" stopColor="#082D5D" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#020A1C" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="vFactoryFaceSheen" x1="90" y1="434" x2="480" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="42%" stopColor="#A8F2FF" stopOpacity="0.22" />
          <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vFactoryBaseDepthFill" x1="72" y1="448" x2="494" y2="508" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020918" stopOpacity="0.28" />
          <stop offset="42%" stopColor="#0B2E5A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#020715" stopOpacity="0.44" />
        </linearGradient>
        <linearGradient id="vFactoryRoofPlaneFill" x1="70" y1="410" x2="494" y2="335" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020A1A" stopOpacity="0.10" />
          <stop offset="50%" stopColor="#0B315F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#020918" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="vFactoryEdgeStroke" x1="70" y1="410" x2="494" y2="335" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE4FF" stopOpacity="0.08" />
          <stop offset="42%" stopColor="#DBFDFF" stopOpacity="0.54" />
          <stop offset="100%" stopColor="#7DEBFF" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="vPipeFill" x1="238" y1="192" x2="304" y2="322" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#123f7f" stopOpacity="0.64" />
          <stop offset="100%" stopColor="#082a5a" stopOpacity="0.56" />
        </linearGradient>
        <linearGradient id="vPipeInnerShadowFill" x1="242" y1="196" x2="275" y2="322" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#010716" stopOpacity="0.52" />
          <stop offset="54%" stopColor="#031934" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#0B3868" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="vPipeRightInnerShadowFill" x1="300" y1="196" x2="267" y2="322" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#010716" stopOpacity="0.52" />
          <stop offset="54%" stopColor="#031934" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#0B3868" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="vPipeShadowFacetFill" x1="258" y1="198" x2="286" y2="312" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86F1FF" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#1D6FA9" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0A315F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vPipeCastShadowFill" x1="236" y1="314" x2="308" y2="288" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#010716" stopOpacity="0.42" />
          <stop offset="70%" stopColor="#041833" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0B3868" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vPipeFlowStroke" x1="266" y1="202" x2="274" y2="296" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F4FEFF" stopOpacity="0.72" />
          <stop offset="48%" stopColor="#6AE8FF" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#58FFC7" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="vPipeLeftEdgeStroke" x1="248" y1="196" x2="236" y2="322" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9FEFF" stopOpacity="0.44" />
          <stop offset="58%" stopColor="#58DFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vPipeRightEdgeStroke" x1="292" y1="196" x2="306" y2="286" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9FEFF" stopOpacity="0.44" />
          <stop offset="58%" stopColor="#58DFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
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
        <linearGradient id="vWindowBevelStroke" x1="132" y1="408" x2="504" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3FFFF" stopOpacity="0.7" />
          <stop offset="48%" stopColor="#84EFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#06162E" stopOpacity="0.34" />
        </linearGradient>
        <path
          id="vFactoryShape"
          d="
            M 70 500
            L 70 400
            L 380 246
            L 494 335
            L 494 500
            Z
          "
        />
        <clipPath id="vFactoryClip">
          <use href="#vFactoryShape" />
        </clipPath>
        <path
          id="vPipeShape"
          d="
            M 236 318
            L 252 192
            L 290 192
            L 306 283
            Z
          "
        />
        <clipPath id="vPipeClip">
          <use href="#vPipeShape" />
        </clipPath>
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
        <linearGradient id="vGraphStroke" x1="190" y1="132" x2="452" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#47D7FF" stopOpacity="0.72" />
          <stop offset="46%" stopColor="#C8FBFF" stopOpacity="1" />
          <stop offset="72%" stopColor="#54F0D6" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#E9FEFF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="vGraphColumnGlow" x1="206" y1="134" x2="400" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2CD0FF" stopOpacity="0.48" />
          <stop offset="58%" stopColor="#91FAFF" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#50E7B9" stopOpacity="0.72" />
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
        <path d="M 20 500 H 580 V 520 H 20 Z" fill="url(#vFootingFill)" className="v-factory-footing" />

        <use href="#vFactoryShape" fill="url(#vFactoryFill)" className="v-factory-shell" />

        <g clipPath="url(#vFactoryClip)" className="v-factory-depth-layer">
          <path className="v-factory-side-plane" d="M 380 246 L 494 335 V 500 H 380 Z" />
          <path className="v-factory-roof-plane" d="M 70 400 L 380 246 L 494 335 L 494 349 L 380 264 L 70 415 Z" />
          <path className="v-factory-face-sheen" d="M 92 417 L 378 275 L 480 355 L 480 371 L 378 295 L 92 435 Z" />
          <path className="v-factory-base-depth" d="M 70 452 L 494 452 V 500 H 70 Z" />
          <path className="v-factory-corner-shadow" d="M 380 264 L 494 349 V 500 H 480 V 359 L 380 286 Z" />
          <path className="v-factory-panel-ridge" d="M 112 421 L 374 291 L 476 371" />
          <path className="v-factory-roof-highlight" d="M 70 400 L 380 246 L 494 335" />
          <path className="v-factory-left-depth" d="M 70 415 L 380 264" />
          <path className="v-factory-right-depth" d="M 380 264 L 494 349" />
        </g>

        <line className="v-factory-crease" x1="380" y1="246" x2="380" y2="500" />

        <use href="#vPipeShape" fill="url(#vPipeFill)" className="v-factory-shell v-pipe-shell" />
        <g clipPath="url(#vPipeClip)" className="v-pipe-depth-layer">
          <path className="v-pipe-cast-shadow" d="M 236 318 L 306 283 L 298 276 L 239 306 Z" />
          <path className="v-pipe-core-shadow" d="M 241 316 L 256 198 H 273 L 260 307 Z" />
          <path className="v-pipe-right-shadow" d="M 272 198 H 288 L 303 285 L 289 292 Z" />
          <path className="v-pipe-shadow-facet" d="M 260 198 H 272 L 284 292 L 263 304 Z" />
          <path className="v-pipe-edge v-pipe-left-edge" d="M 252 194 L 238 317" />
          <path className="v-pipe-edge v-pipe-right-edge" d="M 290 194 L 304 283" />
          <path className="v-pipe-collar-line" d="M 248 218 L 294 218" />
          <path className="v-pipe-flow-line" d="M 271 204 L 271 294" />
        </g>
        <path className="v-pipe-top-edge" d="M 252 192 H 290" />
        <path className="v-pipe-outline" d="M 252 192 L 290 192 M 252 192 L 236 318 M 290 192 L 306 283" />

        <path className="v-factory-window" d="M 132 430 L 188 402 L 188 500 H 132 Z" />
        <path className="v-factory-window v-factory-window-b" d="M 410 420 L 466 464 V 500 H 410 Z" />
        <path className="v-factory-window-highlight" d="M 132 430 L 188 402 L 188 500 H 132 Z" />
        <path className="v-factory-window-highlight v-factory-window-highlight-b" d="M 410 420 L 466 464 V 500 H 410 Z" />
        <path className="v-factory-window-bevel" d="M 132 430 L 188 402 M 188 402 V 500 M 132 500 H 188" />
        <path className="v-factory-window-bevel v-factory-window-bevel-b" d="M 410 420 L 466 464 M 466 464 V 500 M 410 500 H 466" />
        <path className="v-factory-window-grid" d="M 160 416 V 500 M 132 465 H 188" />
        <path className="v-factory-window-grid v-factory-window-grid-b" d="M 438 442 V 500 M 410 471 H 466" />

        <path className="v-factory-cutout" d="M 246 366 L 332 323 V 359 L 246 402 Z" />
        <path className="v-factory-cutout v-factory-cutout-b" d="M 246 416 L 332 373 V 409 L 246 452 Z" />
        <path className="v-factory-cutout v-factory-cutout-c" d="M 410 338 L 466 382 V 418 L 410 374 Z" />
        <path className="v-factory-cutout-highlight" d="M 246 366 L 332 323 V 359 L 246 402 Z" />
        <path className="v-factory-cutout-highlight v-factory-cutout-highlight-b" d="M 246 416 L 332 373 V 409 L 246 452 Z" />
        <path className="v-factory-cutout-highlight v-factory-cutout-highlight-c" d="M 410 338 L 466 382 V 418 L 410 374 Z" />
        <path className="v-factory-cutout-bevel" d="M 246 366 L 332 323 M 246 402 L 332 359" />
        <path className="v-factory-cutout-bevel v-factory-cutout-bevel-b" d="M 246 416 L 332 373 M 246 452 L 332 409" />
        <path className="v-factory-cutout-bevel v-factory-cutout-bevel-c" d="M 410 338 L 466 382 M 410 374 L 466 418" />

        <line className="v-pipe-link" x1="271" y1="192" x2="271" y2="166" />

        <g className="v-factory-trace-layer">
          <path className="v-factory-trace" d="M 70 500 L 70 400 L 380 246 L 494 335 L 494 500" />
          <path className="v-factory-trace" d="M 252 192 L 290 192 M 252 192 L 236 318 M 290 192 L 306 283" />
          <line className="v-factory-trace" x1="271" y1="192" x2="271" y2="166" />
        </g>

        <g className="v-factory-trace-layer v-factory-trace-layer-b">
          <path className="v-factory-trace v-factory-trace-b" d="M 70 500 L 70 400 L 380 246 L 494 335 L 494 500" />
          <path className="v-factory-trace v-factory-trace-b" d="M 252 192 L 290 192 M 252 192 L 236 318 M 290 192 L 306 283" />
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

  const handlePointerMove  = (e) => {
    if (e.pointerType === 'touch') return;
    setPointer(getPointerState(e));
    setIsActive(true);
  };
  const handlePointerLeave = ()  => { setPointer(DEFAULT_POINTER); setIsActive(false); };
  const handlePointerDown  = (e) => {
    if (e.pointerType === 'touch') return;
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
            Soluzioni digitali
            <br className="hidden lg:block" />
            <span className="lg:hidden"> </span>
            e innovazione,
            <br className="hidden lg:block" />
            <span className="lg:hidden"> </span>
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
