import factoryBaseImageUrl from '../../../media/images/hero-factory-base.svg';

const PLUME_TREND_POINTS = '206,119 248,92 326,108 374,74 452,30';
const PLUME_TREND_ARROW_POINTS = '443,42 452,30 437,32';

// Animated chart-like plume overlay that sits above the cached factory base.
function PlumeChartOverlay() {
  return (
    <g className="v-plume-cloud">
      <polyline className="v-graph-halo-line" points={PLUME_TREND_POINTS} />
      <polyline className="v-trend v-plume-trend-out" points={PLUME_TREND_POINTS} />

      <g>
        <g className="v-graph-halo-bars">
          <line x1="208" y1="134" x2="208" y2="95" />
          <line x1="246" y1="134" x2="246" y2="84" />
          <line x1="286" y1="134" x2="286" y2="70" />
          <line x1="326" y1="134" x2="326" y2="50" />
          <line x1="364" y1="134" x2="364" y2="92" />
          <line x1="400" y1="134" x2="400" y2="106" />
        </g>

        <line className="v-plume-baseline-halo" x1="170" y1="134" x2="414" y2="134" />
        <line className="v-plume-baseline" x1="170" y1="134" x2="414" y2="134" />
        <g className="v-bar-flow">
          <line className="v-bar v-bar-1" x1="208" y1="134" x2="208" y2="95" />
          <line className="v-bar v-bar-2" x1="246" y1="134" x2="246" y2="84" />
          <line className="v-bar v-bar-3" x1="286" y1="134" x2="286" y2="70" />
          <line className="v-bar v-bar-4" x1="326" y1="134" x2="326" y2="50" />
          <line className="v-bar v-bar-5" x1="364" y1="134" x2="364" y2="92" />
          <line className="v-bar v-bar-6" x1="400" y1="134" x2="400" y2="106" />
        </g>

        <line className="v-plume-side-link-halo" x1="180" y1="119" x2="206" y2="119" />
        <line className="v-plume-side-link" x1="180" y1="119" x2="206" y2="119" />
        <line className="v-plume-side-link-halo" x1="326" y1="108" x2="408" y2="108" />
        <line
          className="v-plume-side-link v-plume-side-link-b"
          x1="326"
          y1="108"
          x2="408"
          y2="108"
        />

        <circle cx="207.5" cy="119" r="6.5" fill="#E0F5FF" className="v-node" />
        <circle cx="326" cy="108" r="6.2" fill="#E0F5FF" className="v-node v-node-b" />

        <circle cx="246" cy="92" r="19" className="v-node-ring" />
        <circle cx="246" cy="92" r="12.2" fill="#E0F5FF" className="v-node-orange" />
        <circle cx="374" cy="74" r="18" className="v-node-ring v-node-ring-b" />
        <circle
          cx="374"
          cy="74"
          r="11.8"
          fill="#E0F5FF"
          className="v-node-orange v-node-orange-b"
        />

        <circle cx="246" cy="92" r="3.2" className="v-node-spark" />
        <circle cx="374" cy="74" r="3" className="v-node-spark v-node-spark-b" />
      </g>

      <polyline className="v-graph-sheen" points={PLUME_TREND_POINTS} />
      <polyline
        className="v-trend v-plume-trend-arrow v-plume-trend-out"
        points={PLUME_TREND_ARROW_POINTS}
      />
    </g>
  );
}

// Decorative SVG hero illustration. Class names are animated by the hero CSS modules.
export default function FactoryIllustration() {
  return (
    <svg
      viewBox="0 0 600 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="v-svg hero-graphic-hover-target"
    >
      {/* Reusable gradients and clip paths for the factory and plume layers. */}
      <defs>
        <linearGradient
          id="vPipeFlowStroke"
          x1="266"
          y1="220"
          x2="274"
          y2="314"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F4FEFF" stopOpacity="0.72" />
          <stop offset="48%" stopColor="#95E3FF" stopOpacity="0.46" />
          <stop offset="100%" stopColor="#5AB8E8" stopOpacity="0.22" />
        </linearGradient>
        <path
          id="vFactoryShape"
          d="
            M 126 500
            L 126 391
            L 380 264
            L 494 337
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
            M 236 336
            L 252 210
            L 290 210
            L 306 301
            Z
          "
        />
        <clipPath id="vPipeClip">
          <use href="#vPipeShape" />
        </clipPath>
        <path id="vLeftWindowTopShape" d="M 264 366 L 350 323 V 359 L 264 402 Z" />
        <path id="vLeftWindowBottomShape" d="M 264 416 L 350 373 V 409 L 264 452 Z" />
        <path id="vRightWindowShape" d="M 410 338 L 466 374 V 410 L 410 374 Z" />
        <clipPath id="vLeftWindowTopClip">
          <use href="#vLeftWindowTopShape" />
        </clipPath>
        <clipPath id="vLeftWindowBottomClip">
          <use href="#vLeftWindowBottomShape" />
        </clipPath>
        <clipPath id="vRightWindowClip">
          <use href="#vRightWindowShape" />
        </clipPath>
        <linearGradient
          id="vGraphStroke"
          x1="190"
          y1="132"
          x2="452"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7FCEE8" stopOpacity="0.72" />
          <stop offset="46%" stopColor="#95E3FF" stopOpacity="1" />
          <stop offset="72%" stopColor="#95E3FF" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#95E3FF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient
          id="vGraphColumnGlow"
          x1="206"
          y1="134"
          x2="400"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7FCEE8" stopOpacity="0.48" />
          <stop offset="58%" stopColor="#95E3FF" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#95E3FF" stopOpacity="0.78" />
        </linearGradient>
        {/* Wave stroke */}
        <linearGradient id="vWave" x1="20" y1="0" x2="580" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A99B5" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#7AB1CC" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5A99B5" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Floating group */}
      <g className="v-float-group">
        <image
          href={factoryBaseImageUrl}
          x="0"
          y="0"
          width="600"
          height="540"
          preserveAspectRatio="xMidYMid meet"
        />

        <g clipPath="url(#vFactoryClip)">
          <path className="v-factory-roof-highlight" d="M 126 391 L 380 264 L 494 337" />
        </g>

        <line className="v-factory-crease" x1="380" y1="264" x2="380" y2="500" />

        <g clipPath="url(#vPipeClip)">
          <path className="v-pipe-collar-line" d="M 248 236 L 294 236" />
          <path className="v-pipe-flow-line" d="M 271 222 L 271 312" />
        </g>

        <g className="v-factory-left-door-group" transform="translate(22 0)">
          <path className="v-door-perimeter-signal" d="M 132 430 L 188 402 L 188 500 H 132 Z" />
        </g>
        <path
          className="v-door-perimeter-signal v-door-perimeter-signal-b"
          d="M 410 412 L 466 448 V 500 H 410 Z"
        />

        <g clipPath="url(#vLeftWindowTopClip)">
          <path className="v-window-sweep v-window-sweep-core" d="M 264 402 L 350 359" />
        </g>
        <g clipPath="url(#vLeftWindowBottomClip)">
          <path
            className="v-window-sweep v-window-sweep-core v-window-sweep-b"
            d="M 264 452 L 350 409"
          />
        </g>
        <g clipPath="url(#vRightWindowClip)">
          <path
            className="v-window-sweep v-window-sweep-core v-window-sweep-c"
            d="M 410 374 L 466 410"
          />
        </g>
        <path className="v-factory-panel-ridge" d="M 138 407.1 L 380 289 L 484 355.6" />

        <g className="v-factory-trace-layer">
          <path className="v-factory-trace" d="M 126 500 L 126 391 L 380 264 L 494 337 L 494 500" />
          <path
            className="v-factory-trace"
            d="M 252 210 L 290 210 M 252 210 L 236 336 M 290 210 L 306 301"
          />
          <line className="v-factory-trace" x1="271" y1="210" x2="271" y2="166" />
        </g>

        <PlumeChartOverlay />
      </g>

      {/* Waves - very faint, blending with background */}
      <path
        className="v-wave"
        d="M 8 510 C 86 528, 163 532, 230 517 C 292 502, 348 502, 406 521 C 448 534, 496 536, 540 522 C 562 512, 584 512, 594 518"
        stroke="url(#vWave)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="v-wave v-wave-b"
        d="M 14 535 C 90 552, 164 554, 228 540 C 290 526, 348 528, 400 544 C 432 556, 474 556, 516 545 C 542 536, 570 536, 594 542"
        stroke="url(#vWave)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="v-wave"
        d="M 40 557 C 108 568, 172 568, 236 556 C 294 543, 346 545, 390 557"
        stroke="url(#vWave)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.40"
        fill="none"
      />
    </svg>
  );
}
