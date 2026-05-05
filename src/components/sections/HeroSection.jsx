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
        <linearGradient id="vFactoryFill" x1="126" y1="256" x2="494" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A2550" stopOpacity="0.60" />
          <stop offset="42%" stopColor="#0E437F" stopOpacity="0.48" />
          <stop offset="76%" stopColor="#0C376D" stopOpacity="0.56" />
          <stop offset="100%" stopColor="#071B3D" stopOpacity="0.60" />
        </linearGradient>
        <linearGradient id="vFactoryFaceSheen" x1="90" y1="434" x2="480" y2="288" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="42%" stopColor="#A8F2FF" stopOpacity="0.14" />
          <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vFactoryLeftShadeFill" x1="126" y1="500" x2="380" y2="282" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020817" stopOpacity="0.64" />
          <stop offset="16%" stopColor="#031126" stopOpacity="0.58" />
          <stop offset="34%" stopColor="#06214A" stopOpacity="0.49" />
          <stop offset="52%" stopColor="#0A3565" stopOpacity="0.40" />
          <stop offset="70%" stopColor="#145B84" stopOpacity="0.30" />
          <stop offset="86%" stopColor="#3FAED0" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#91F1FF" stopOpacity="0.11" />
        </linearGradient>
        <linearGradient id="vFactoryLeftOcclusionFill" x1="126" y1="470" x2="304" y2="352" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#010611" stopOpacity="0.46" />
          <stop offset="24%" stopColor="#020C1D" stopOpacity="0.36" />
          <stop offset="48%" stopColor="#041833" stopOpacity="0.23" />
          <stop offset="72%" stopColor="#092D54" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#0F5F8C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vFactoryLeftRimFill" x1="318" y1="500" x2="410" y2="292" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43CEF2" stopOpacity="0" />
          <stop offset="24%" stopColor="#49D3F5" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#5BDEF9" stopOpacity="0.08" />
          <stop offset="72%" stopColor="#82F0FF" stopOpacity="0.11" />
          <stop offset="88%" stopColor="#B9FAFF" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#E8FEFF" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="vFactorySidePlaneFill" x1="380" y1="500" x2="494" y2="337" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A305D" stopOpacity="0.60" />
          <stop offset="18%" stopColor="#0D3B6A" stopOpacity="0.59" />
          <stop offset="36%" stopColor="#104875" stopOpacity="0.60" />
          <stop offset="56%" stopColor="#176A98" stopOpacity="0.52" />
          <stop offset="74%" stopColor="#278BBC" stopOpacity="0.42" />
          <stop offset="90%" stopColor="#58CDE3" stopOpacity="0.27" />
          <stop offset="100%" stopColor="#A4F3FA" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="vFactoryRightInnerShadeFill" x1="368" y1="392" x2="438" y2="392" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#010716" stopOpacity="0" />
          <stop offset="22%" stopColor="#021027" stopOpacity="0.07" />
          <stop offset="48%" stopColor="#062249" stopOpacity="0.18" />
          <stop offset="74%" stopColor="#0A3D68" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0D5F8F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vFactoryRightLightWashFill" x1="416" y1="500" x2="494" y2="337" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3BCAF0" stopOpacity="0" />
          <stop offset="24%" stopColor="#45D3F4" stopOpacity="0.05" />
          <stop offset="48%" stopColor="#65E9FF" stopOpacity="0.11" />
          <stop offset="68%" stopColor="#8EF2FF" stopOpacity="0.16" />
          <stop offset="84%" stopColor="#C5FBFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F2FFFF" stopOpacity="0.29" />
        </linearGradient>
        <linearGradient id="vFactoryRoofUpperShadeFill" x1="126" y1="406" x2="494" y2="337" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#010817" stopOpacity="0.42" />
          <stop offset="26%" stopColor="#031833" stopOpacity="0.34" />
          <stop offset="52%" stopColor="#0A3E6A" stopOpacity="0.19" />
          <stop offset="78%" stopColor="#24B5D2" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#D9FEFF" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id="vFactoryRoofUpperLightFill" x1="324" y1="372" x2="494" y2="337" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1FB9E8" stopOpacity="0" />
          <stop offset="40%" stopColor="#51E2FA" stopOpacity="0.07" />
          <stop offset="72%" stopColor="#A5FBFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F3FFFF" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="vFactoryRoofRightLightFill" x1="344" y1="352" x2="494" y2="337" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#42D0F2" stopOpacity="0" />
          <stop offset="30%" stopColor="#43D9F7" stopOpacity="0.055" />
          <stop offset="58%" stopColor="#77F2FF" stopOpacity="0.105" />
          <stop offset="82%" stopColor="#C5FCFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#F6FFFF" stopOpacity="0.20" />
        </linearGradient>
        <filter id="vFactorySoftShadeBlur" x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="vFactorySoftLightBlur" x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="vFactoryBaseDepthFill" x1="300" y1="292" x2="300" y2="532" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020918" stopOpacity="0" />
          <stop offset="38%" stopColor="#041934" stopOpacity="0.04" />
          <stop offset="58%" stopColor="#06264A" stopOpacity="0.10" />
          <stop offset="76%" stopColor="#03162F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#010614" stopOpacity="0.40" />
        </linearGradient>
        <linearGradient id="vFactoryRoofPlaneFill" x1="126" y1="401" x2="494" y2="337" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020A1A" stopOpacity="0.10" />
          <stop offset="50%" stopColor="#0B315F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#020918" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="vFactoryEdgeStroke" x1="126" y1="401" x2="494" y2="337" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE4FF" stopOpacity="0.08" />
          <stop offset="42%" stopColor="#DBFDFF" stopOpacity="0.54" />
          <stop offset="100%" stopColor="#7DEBFF" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="vPipeFill" x1="238" y1="336" x2="306" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#061B3D" stopOpacity="0.66" />
          <stop offset="34%" stopColor="#0A2F61" stopOpacity="0.60" />
          <stop offset="68%" stopColor="#0F4D84" stopOpacity="0.54" />
          <stop offset="100%" stopColor="#1B79AA" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="vPipeBodyDepthFill" x1="272" y1="210" x2="272" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020918" stopOpacity="0" />
          <stop offset="42%" stopColor="#03142C" stopOpacity="0.06" />
          <stop offset="70%" stopColor="#041B38" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#010613" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id="vPipeLeftOcclusionFill" x1="236" y1="336" x2="272" y2="214" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#010611" stopOpacity="0.42" />
          <stop offset="32%" stopColor="#021027" stopOpacity="0.28" />
          <stop offset="62%" stopColor="#062448" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0E5C89" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vPipeRightLightWashFill" x1="274" y1="340" x2="306" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#35C5ED" stopOpacity="0" />
          <stop offset="34%" stopColor="#55DDF7" stopOpacity="0.06" />
          <stop offset="62%" stopColor="#85F1FF" stopOpacity="0.13" />
          <stop offset="84%" stopColor="#C3FBFF" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#F4FFFF" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="vPipeTopLightFill" x1="250" y1="214" x2="292" y2="214" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#65DFF8" stopOpacity="0" />
          <stop offset="54%" stopColor="#A4F6FF" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#F4FFFF" stopOpacity="0.20" />
        </linearGradient>
        <filter id="vPipeSoftShadeBlur" x="-28%" y="-16%" width="156%" height="132%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <filter id="vPipeSoftLightBlur" x="-28%" y="-16%" width="156%" height="132%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="3.8" />
        </filter>
        <linearGradient id="vPipeFlowStroke" x1="266" y1="220" x2="274" y2="314" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F4FEFF" stopOpacity="0.72" />
          <stop offset="48%" stopColor="#6AE8FF" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#58FFC7" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="vPipeLeftEdgeStroke" x1="248" y1="214" x2="236" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9FEFF" stopOpacity="0.44" />
          <stop offset="58%" stopColor="#58DFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vPipeRightEdgeStroke" x1="292" y1="214" x2="306" y2="304" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9FEFF" stopOpacity="0.44" />
          <stop offset="58%" stopColor="#58DFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vFootingFill" x1="76" y1="500" x2="544" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A2D62" stopOpacity="0.58" />
          <stop offset="50%" stopColor="#0E4A92" stopOpacity="0.46" />
          <stop offset="100%" stopColor="#0A2D62" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient id="vDoorPanelFill" x1="132" y1="402" x2="188" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A6C9F" />
          <stop offset="44%" stopColor="#0B3E74" />
          <stop offset="100%" stopColor="#061A38" />
        </linearGradient>
        <linearGradient id="vDoorPanelFillRight" x1="410" y1="412" x2="466" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2484AE" />
          <stop offset="48%" stopColor="#0D4B7C" />
          <stop offset="100%" stopColor="#061A38" />
        </linearGradient>
        <linearGradient id="vSlotPanelFill" x1="264" y1="323" x2="350" y2="452" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8F7FB" />
          <stop offset="22%" stopColor="#A6EAF2" />
          <stop offset="48%" stopColor="#55B9CC" />
          <stop offset="74%" stopColor="#1D638F" />
          <stop offset="100%" stopColor="#082242" />
        </linearGradient>
        <linearGradient id="vSlotPanelFillRight" x1="410" y1="338" x2="466" y2="410" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DDF8FB" />
          <stop offset="24%" stopColor="#AFEFF5" />
          <stop offset="52%" stopColor="#63C6D6" />
          <stop offset="100%" stopColor="#14527A" />
        </linearGradient>
        <linearGradient id="vPanelStroke" x1="132" y1="402" x2="466" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E4FEFF" />
          <stop offset="44%" stopColor="#73E7F8" />
          <stop offset="100%" stopColor="#2E719B" />
        </linearGradient>
        <linearGradient id="vLeftDoorPanelStroke" x1="132" y1="402" x2="188" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3FFFF" />
          <stop offset="48%" stopColor="#A9F4FA" />
          <stop offset="100%" stopColor="#6DB9CF" />
        </linearGradient>
        <linearGradient id="vWindowPanelStroke" x1="264" y1="323" x2="466" y2="452" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B9EEF4" />
          <stop offset="48%" stopColor="#5FC5D5" />
          <stop offset="100%" stopColor="#1F5D82" />
        </linearGradient>
        <linearGradient id="vPanelEdgeLightStroke" x1="132" y1="402" x2="466" y2="374" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C7F7FA" />
          <stop offset="56%" stopColor="#7DDCE8" />
          <stop offset="100%" stopColor="#A6F0F6" />
        </linearGradient>
        <linearGradient id="vPanelEdgeDepthStroke" x1="132" y1="500" x2="466" y2="410" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#04112A" />
          <stop offset="58%" stopColor="#092A52" />
          <stop offset="100%" stopColor="#0D3D64" />
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
        {/* Subtle base glow bleeding into the bg */}
        <radialGradient
          id="vAura"
          cx="0" cy="0" r="1"
          gradientTransform="translate(310 500) scale(234 52)"
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
      <ellipse cx="310" cy="500" rx="234" ry="52" fill="url(#vAura)" className="v-aura" />

      {/* ── FLOATING GROUP ────────────────────────────────────────────────── */}
      <g className="v-float-group">
        <path d="M 76 500 H 544 V 520 H 76 Z" fill="url(#vFootingFill)" className="v-factory-footing" />

        <use href="#vFactoryShape" fill="url(#vFactoryFill)" className="v-factory-shell" />

        <g clipPath="url(#vFactoryClip)" className="v-factory-depth-layer">
          <path className="v-factory-roof-plane" d="M 126 391 L 380 264 L 494 337 L 494 355 L 380 282 L 126 406 Z" />
          <path className="v-factory-roof-upper-shade" d="M 126 391 L 380 264 L 494 337 L 494 355 L 380 282 L 126 406 Z" />
          <path className="v-factory-roof-upper-light" d="M 308 300 L 380 264 L 494 337 L 494 355 L 406 300 Z" />
          <path className="v-factory-roof-light-plane" d="M 346 281 L 380 264 L 494 337 L 494 355 L 420 308 Z" />
          <path
            className="v-factory-face-sheen"
            d="
              M 144 403 L 244 353 L 244 364 L 144 414 Z
            "
          />
          <path className="v-factory-base-depth" d="M 126 391 L 380 264 L 494 337 V 532 H 126 Z" />
          <path className="v-factory-left-shade" d="M 126 406 L 380 282 V 532 H 126 Z" />
          <path className="v-factory-left-inner-shadow" d="M 126 406 L 252 355 L 226 532 H 126 Z" />
          <path className="v-factory-left-reflected-light" d="M 320 311 L 408 294 V 532 H 344 Z" />
          <path className="v-factory-side-plane" d="M 380 282 L 494 355 V 532 H 380 Z" />
          <path className="v-factory-right-inner-shadow" d="M 368 274 L 434 316 V 532 H 368 Z" />
          <path className="v-factory-right-light-wash" d="M 420 308 L 494 355 V 532 H 448 Z" />
          <path className="v-factory-roof-highlight" d="M 126 391 L 380 264 L 494 337" />
          <path className="v-factory-left-depth" d="M 126 406 L 380 282" />
          <path className="v-factory-right-depth" d="M 380 282 L 494 355" />
        </g>

        <line className="v-factory-crease" x1="380" y1="264" x2="380" y2="500" />

        <use href="#vPipeShape" fill="url(#vPipeFill)" className="v-factory-shell v-pipe-shell" />
        <g clipPath="url(#vPipeClip)" className="v-pipe-depth-layer">
          <path className="v-pipe-body-depth" d="M 236 336 L 252 210 H 290 L 306 301 V 360 H 236 Z" />
          <path className="v-pipe-left-occlusion" d="M 232 348 L 248 208 H 270 L 258 348 Z" />
          <path className="v-pipe-right-light" d="M 270 208 H 294 L 314 306 L 286 348 Z" />
          <path className="v-pipe-top-light" d="M 248 208 H 292 L 298 238 H 244 Z" />
          <path className="v-pipe-edge v-pipe-left-edge" d="M 252 212 L 238 335" />
          <path className="v-pipe-edge v-pipe-right-edge" d="M 290 212 L 304 301" />
          <path className="v-pipe-collar-line" d="M 248 236 L 294 236" />
          <path className="v-pipe-flow-line" d="M 271 222 L 271 312" />
        </g>
        <path className="v-pipe-top-edge" d="M 252 210 H 290" />
        <path className="v-pipe-outline" d="M 252 210 L 290 210 M 252 210 L 236 336 M 290 210 L 306 301" />

        <g className="v-factory-left-door-group" transform="translate(22 0)">
          <path className="v-factory-window v-door-panel" d="M 132 430 L 188 402 L 188 500 H 132 Z" />
          <path className="v-door-perimeter-signal" d="M 132 430 L 188 402 L 188 500 H 132 Z" />
          <path className="v-panel-edge-light v-door-edge-light" d="M 132 430 L 188 402" />
          <path className="v-panel-edge-depth v-door-edge-depth" d="M 188 402 V 500 M 132 500 H 188" />
        </g>
        <path className="v-factory-window v-factory-window-b v-door-panel" d="M 410 412 L 466 448 V 500 H 410 Z" />
        <path className="v-door-perimeter-signal v-door-perimeter-signal-b" d="M 410 412 L 466 448 V 500 H 410 Z" />
        <path className="v-panel-edge-light v-door-edge-light v-door-edge-light-b" d="M 410 412 L 466 448" />
        <path className="v-panel-edge-depth v-door-edge-depth v-door-edge-depth-b" d="M 466 448 V 500 M 410 500 H 466" />

        <g className="v-factory-left-window-group" transform="translate(0 0)">
          <path className="v-factory-cutout v-window-panel" d="M 264 366 L 350 323 V 359 L 264 402 Z" />
          <g clipPath="url(#vLeftWindowTopClip)">
            <path className="v-window-sweep v-window-sweep-glow" d="M 268 398 L 348 358" />
            <path className="v-window-sweep v-window-sweep-core" d="M 268 398 L 348 358" />
          </g>
          <path className="v-panel-edge-light v-panel-edge-light-soft v-window-edge-light" d="M 264 366 L 350 323" />
          <path className="v-panel-edge-depth v-panel-edge-depth-soft v-window-edge-depth" d="M 264 402 L 350 359" />
          <path className="v-factory-cutout v-factory-cutout-b v-window-panel" d="M 264 416 L 350 373 V 409 L 264 452 Z" />
          <g clipPath="url(#vLeftWindowBottomClip)">
            <path className="v-window-sweep v-window-sweep-glow v-window-sweep-b" d="M 268 448 L 348 408" />
            <path className="v-window-sweep v-window-sweep-core v-window-sweep-b" d="M 268 448 L 348 408" />
          </g>
          <path className="v-panel-edge-light v-panel-edge-light-soft v-window-edge-light v-window-edge-light-b" d="M 264 416 L 350 373" />
          <path className="v-panel-edge-depth v-panel-edge-depth-soft v-window-edge-depth v-window-edge-depth-b" d="M 264 452 L 350 409" />
        </g>
        <path className="v-factory-cutout v-factory-cutout-c v-window-panel" d="M 410 338 L 466 374 V 410 L 410 374 Z" />
        <g clipPath="url(#vRightWindowClip)">
          <path className="v-window-sweep v-window-sweep-glow v-window-sweep-c" d="M 414 375 L 462 405" />
          <path className="v-window-sweep v-window-sweep-core v-window-sweep-c" d="M 414 375 L 462 405" />
        </g>
        <path className="v-panel-edge-light v-panel-edge-light-soft v-window-edge-light v-window-edge-light-c" d="M 410 338 L 466 374" />
        <path className="v-panel-edge-depth v-panel-edge-depth-soft v-window-edge-depth v-window-edge-depth-c" d="M 410 374 L 466 410" />
        <path className="v-factory-panel-ridge-base" d="M 138 407.1 L 380 289 L 484 355.6" />
        <path className="v-factory-panel-ridge-bridge" d="M 336 310.5 L 380 289 L 424 317.2" />
        <path className="v-factory-panel-ridge" d="M 138 407.1 L 380 289 L 484 355.6" />

        <line className="v-pipe-link" x1="271" y1="210" x2="271" y2="166" />

        <g className="v-factory-trace-layer">
          <path className="v-factory-trace" d="M 126 500 L 126 391 L 380 264 L 494 337 L 494 500" />
          <path className="v-factory-trace" d="M 252 210 L 290 210 M 252 210 L 236 336 M 290 210 L 306 301" />
          <line className="v-factory-trace" x1="271" y1="210" x2="271" y2="166" />
        </g>

        <g className="v-factory-trace-layer v-factory-trace-layer-b">
          <path className="v-factory-trace v-factory-trace-b" d="M 126 500 L 126 391 L 380 264 L 494 337 L 494 500" />
          <path className="v-factory-trace v-factory-trace-b" d="M 252 210 L 290 210 M 252 210 L 236 336 M 290 210 L 306 301" />
          <line className="v-factory-trace v-factory-trace-b" x1="271" y1="210" x2="271" y2="166" />
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
  const [subheadlineLineWidth, setSubheadlineLineWidth] = useState(null);
  const subheadlineRef = useRef(null);
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

  useEffect(() => {
    const subheadline = subheadlineRef.current;
    if (!subheadline) return undefined;

    let frameId = null;
    let isMounted = true;

    const measureSubheadline = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        if (!isMounted) return;

        const range = document.createRange();
        range.selectNodeContents(subheadline);
        const lineWidths = Array.from(range.getClientRects())
          .filter((rect) => rect.width > 1 && rect.height > 1)
          .map((rect) => rect.width);
        range.detach();

        const fallbackWidth = subheadline.getBoundingClientRect().width;
        const nextWidth = Math.ceil(lineWidths.length ? Math.max(...lineWidths) : fallbackWidth);
        setSubheadlineLineWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
      });
    };

    measureSubheadline();

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(measureSubheadline);
    resizeObserver?.observe(subheadline);

    window.addEventListener('resize', measureSubheadline);
    document.fonts?.ready?.then(measureSubheadline);

    return () => {
      isMounted = false;
      if (frameId !== null) cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureSubheadline);
    };
  }, []);

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
  const heroActionsStyle = useMemo(() => (
    subheadlineLineWidth ? { '--hero-subheadline-inline-width': `${subheadlineLineWidth}px` } : undefined
  ), [subheadlineLineWidth]);

  return (
    <section
      className="hero-shell relative isolate overflow-hidden bg-primary pt-32 pb-24 lg:pt-40 lg:pb-36"
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
          <div className="md:flex md:w-fit md:flex-col md:items-stretch lg:block lg:w-auto">
            <h1 className="hero-title-balance font-headline text-[3rem] leading-[1.05] tracking-tight text-surface-bright sm:text-[3.4rem] lg:text-[4rem] mb-6">
              Soluzioni digitali
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              e innovazione<span className="md:hidden lg:inline">,</span>
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              alla portata di <span className="text-tertiary-fixed">tutti</span>
            </h1>
            <p ref={subheadlineRef} className="font-body text-lg text-[#d4dbea] mb-10 max-w-2xl leading-relaxed sm:text-xl">
              Consulenza su misura per
              <br className="sm:hidden md:block lg:hidden" />
              {' '}far crescere il tuo business
            </p>
            <div className="hero-actions flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4" style={heroActionsStyle}>
              <a
                href="#contatti"
                className="hero-consultancy-cta group relative inline-flex items-center justify-center px-8 py-4 pr-12 rounded-md text-base font-medium transition-all duration-300 bg-gradient-to-br from-tertiary-fixed to-[#9ce6fb] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95"
              >
                Richiedi una Consulenza
                <span className="material-symbols-outlined absolute right-3 text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
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
      </div>
    </section>
  );
}
