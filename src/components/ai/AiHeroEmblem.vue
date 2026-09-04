<template>
  <div class="hero-emblem">
    <!-- Ambient halo -->
    <div class="hero-emblem__halo" aria-hidden="true" />

    <!-- Perspective floor grid -->
    <div class="hero-emblem__floor" aria-hidden="true">
      <div class="hero-emblem__floor-grid" />
    </div>

    <!-- Aurora conic ring -->
    <div class="hero-emblem__aurora" aria-hidden="true" />

    <!-- Radar ripples around logo -->
    <div class="hero-emblem__ripples" aria-hidden="true">
      <span class="hero-emblem__ripple" />
      <span class="hero-emblem__ripple" />
      <span class="hero-emblem__ripple" />
    </div>

    <!-- Main SVG: server boxes + data flow -->
    <svg
      class="hero-emblem__svg"
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <!-- Wing feather gradient -->
        <linearGradient id="feather-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="var(--emblem-wing-c3, #818cf8)" stop-opacity="1" />
          <stop offset="30%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0.9" />
          <stop offset="75%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0.5" />
          <stop offset="100%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0" />
        </linearGradient>

        <!-- Highlight edge (bright inner line) -->
        <linearGradient id="feather-hi" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#e0f2fe" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0" />
        </linearGradient>

        <!-- Wing background halo -->
        <radialGradient id="wing-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0.5" />
          <stop offset="100%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0" />
        </radialGradient>

        <!-- Data flow gradient -->
        <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0.15" />
          <stop offset="50%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0.7" />
          <stop offset="100%" stop-color="var(--emblem-wing-c3, #818cf8)" stop-opacity="0.95" />
        </linearGradient>

        <!-- Server box gradients -->
        <linearGradient id="box-face" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(30, 58, 138, 0.6)" />
          <stop offset="100%" stop-color="rgba(2, 6, 23, 0.85)" />
        </linearGradient>
        <linearGradient id="box-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(59, 130, 246, 0.55)" />
          <stop offset="100%" stop-color="rgba(30, 58, 138, 0.35)" />
        </linearGradient>
        <linearGradient id="box-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(15, 40, 90, 0.75)" />
          <stop offset="100%" stop-color="rgba(2, 6, 23, 0.9)" />
        </linearGradient>

        <!-- Body radial -->
        <radialGradient id="body-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--emblem-wing-c3, #818cf8)" stop-opacity="0.9" />
          <stop offset="60%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--emblem-wing-c2, #38bdf8)" stop-opacity="0" />
        </radialGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow-spark" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <!-- Isometric server-box symbol (reusable via <use>) -->
        <symbol id="server-box" viewBox="0 0 140 160" overflow="visible">
          <!-- Left side face -->
          <polygon points="0,50 55,80 55,145 0,115" fill="url(#box-side)"
                   stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.2" opacity="0.95" />
          <!-- Right/front face -->
          <polygon points="55,80 140,50 140,115 55,145" fill="url(#box-face)"
                   stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.2" opacity="0.95" />
          <!-- Top face -->
          <polygon points="55,80 140,50 85,20 0,50" fill="url(#box-top)"
                   stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.2" opacity="0.9" />

          <!-- Server rack slots on front face (horizontal lines) -->
          <g stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="0.6" opacity="0.6">
            <line x1="65" y1="93" x2="128" y2="72" />
            <line x1="65" y1="103" x2="128" y2="82" />
            <line x1="65" y1="113" x2="128" y2="92" />
            <line x1="65" y1="123" x2="128" y2="102" />
            <line x1="65" y1="133" x2="128" y2="112" />
          </g>

          <!-- LED indicator dots -->
          <circle cx="70" cy="98" r="1.6" fill="#22c55e" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="76" cy="97" r="1.6" fill="#38bdf8" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="82" cy="96" r="1.6" fill="#22c55e" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.9s" repeatCount="indefinite" />
          </circle>

          <!-- Circuit lines on top face -->
          <g stroke="var(--emblem-wing-c3, #818cf8)" stroke-width="0.5" opacity="0.55" fill="none">
            <path d="M 20 45 L 60 65 L 100 40" />
            <path d="M 40 35 L 80 55" />
          </g>
          <circle cx="60" cy="65" r="1.8" fill="var(--emblem-wing-c3, #818cf8)" opacity="0.9" />

          <!-- Connection port (small circle where data line originates) -->
          <circle cx="140" cy="82" r="4" fill="none"
                  stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.2" />
          <circle cx="140" cy="82" r="2" fill="var(--emblem-wing-c2, #38bdf8)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </symbol>

        <!-- Data flow paths (used by animateMotion sparks) -->
        <path id="flow-TL" d="M 190 220 C 340 260, 470 330, 600 400" />
        <path id="flow-BL" d="M 190 660 C 340 620, 470 500, 600 400" />
        <path id="flow-TR" d="M 1010 220 C 860 260, 730 330, 600 400" />
        <path id="flow-BR" d="M 1010 660 C 860 620, 730 500, 600 400" />

        <!-- Orbits -->
        <path id="orbit-outer" d="M 780 400 A 180 60 -10 1 1 420 400 A 180 60 -10 1 1 780 400" fill="none" />
        <path id="orbit-mid"   d="M 730 400 A 130 42 10 1 1 470 400 A 130 42 10 1 1 730 400" fill="none" />
      </defs>

      <!-- ============================================================
           CENTRAL BODY GLOW (behind logo)
      ============================================================ -->
      <circle cx="600" cy="400" r="280" fill="url(#body-glow)" opacity="0.65">
        <animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="600" cy="400" r="170" fill="url(#body-glow)" opacity="0.9">
        <animate attributeName="opacity" values="0.75;1;0.75" dur="2.4s" repeatCount="indefinite" />
      </circle>

      <!-- ============================================================
           4 SERVER BOXES (isometric, database towers) — larger, spread wider
      ============================================================ -->
      <use href="#server-box" x="30" y="110" width="180" height="210" />
      <use href="#server-box" x="30" y="570" width="180" height="210" />
      <use href="#server-box" x="990" y="110" width="180" height="210" />
      <use href="#server-box" x="990" y="570" width="180" height="210" />

      <!-- Box labels -->
      <g fill="var(--emblem-wing-c2, #38bdf8)" font-size="13" font-family="monospace"
         font-weight="700" letter-spacing="2" text-anchor="middle" opacity="0.9">
        <text x="120" y="345">DB • ATM</text>
        <text x="120" y="805">DB • FILIAL</text>
        <text x="1080" y="345">DB • MONITOR</text>
        <text x="1080" y="805">DB • SERVIS</text>
      </g>

      <!-- ============================================================
           DATA FLOW LINES (dashed animated) from each box to center
      ============================================================ -->
      <g fill="none" stroke-linecap="round">
        <!-- Static base lines (subtle) -->
        <path d="M 190 220 C 340 260, 470 330, 600 400"
              stroke="url(#flow-grad)" stroke-width="1.4" opacity="0.4" />
        <path d="M 190 660 C 340 620, 470 500, 600 400"
              stroke="url(#flow-grad)" stroke-width="1.4" opacity="0.4" />
        <path d="M 1010 220 C 860 260, 730 330, 600 400"
              stroke="url(#flow-grad)" stroke-width="1.4" opacity="0.4" />
        <path d="M 1010 660 C 860 620, 730 500, 600 400"
              stroke="url(#flow-grad)" stroke-width="1.4" opacity="0.4" />

        <!-- Dashed flowing overlay (animated dashoffset) -->
        <path d="M 190 220 C 340 260, 470 330, 600 400"
              stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.6"
              stroke-dasharray="5 20" opacity="0.9" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-50" dur="1.4s" repeatCount="indefinite" />
        </path>
        <path d="M 190 660 C 340 620, 470 500, 600 400"
              stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.6"
              stroke-dasharray="5 20" opacity="0.9" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-50" dur="1.6s" repeatCount="indefinite" />
        </path>
        <path d="M 1010 220 C 860 260, 730 330, 600 400"
              stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.6"
              stroke-dasharray="5 20" opacity="0.9" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-50" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M 1010 660 C 860 620, 730 500, 600 400"
              stroke="var(--emblem-wing-c2, #38bdf8)" stroke-width="1.6"
              stroke-dasharray="5 20" opacity="0.9" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-50" dur="1.7s" repeatCount="indefinite" />
        </path>
      </g>

      <!-- ============================================================
           DATA PULSE PACKETS (bright sparks traveling along flows)
      ============================================================ -->
      <g filter="url(#glow-spark)">
        <circle r="4" fill="#e0f2fe">
          <animateMotion dur="2.4s" repeatCount="indefinite">
            <mpath href="#flow-TL" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="r" values="0.5;4;3.5;0.5" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle r="3.5" fill="#bae6fd">
          <animateMotion dur="2.8s" begin="0.5s" repeatCount="indefinite">
            <mpath href="#flow-BL" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" begin="0.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="0.5;3.5;3;0.5" dur="2.8s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="#c4b5fd">
          <animateMotion dur="2.6s" begin="0.3s" repeatCount="indefinite">
            <mpath href="#flow-TR" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="r" values="0.5;4;3.5;0.5" dur="2.6s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle r="3.5" fill="#f9a8d4">
          <animateMotion dur="3s" begin="0.8s" repeatCount="indefinite">
            <mpath href="#flow-BR" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="r" values="0.5;3.5;3;0.5" dur="3s" begin="0.8s" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- Rings around center -->
      <g fill="none" stroke-linecap="round">
        <circle cx="600" cy="400" r="130"
                stroke="var(--emblem-wing-c2, #38bdf8)"
                stroke-width="1.6"
                stroke-dasharray="80 400"
                opacity="0.6"
                filter="url(#glow)">
          <animateTransform attributeName="transform" type="rotate"
                            from="0 600 400" to="360 600 400" dur="14s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="400" r="170"
                stroke="var(--emblem-wing-c3, #818cf8)"
                stroke-width="1.2"
                stroke-dasharray="40 480"
                opacity="0.5"
                filter="url(#glow)">
          <animateTransform attributeName="transform" type="rotate"
                            from="360 600 400" to="0 600 400" dur="20s" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- Orbital satellites -->
      <g filter="url(#glow-spark)">
        <circle r="3.5" fill="#e0f2fe">
          <animateMotion dur="14s" repeatCount="indefinite">
            <mpath href="#orbit-outer" />
          </animateMotion>
        </circle>
        <circle r="2.5" fill="#c4b5fd">
          <animateMotion dur="10s" begin="1s" repeatCount="indefinite">
            <mpath href="#orbit-mid" />
          </animateMotion>
        </circle>
      </g>

      <!-- Constellation stars scattered -->
      <g fill="var(--emblem-particle, #7dd3fc)">
        <circle cx="80" cy="80" r="1.4">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="1120" cy="80" r="1.4">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="740" r="1.4">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="3.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="1120" cy="740" r="1.4">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="60" r="1.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>

    <!-- ==== Central Turon Bank logo (AI receiving/scanning data) ==== -->
    <div class="hero-emblem__logo-ring">
      <div class="hero-emblem__prism" />

      <!-- 4 signal indicators around logo (one per data flow direction) -->
      <div class="hero-emblem__signals" aria-hidden="true">
        <span class="hero-emblem__signal hero-emblem__signal--tl" />
        <span class="hero-emblem__signal hero-emblem__signal--bl" />
        <span class="hero-emblem__signal hero-emblem__signal--tr" />
        <span class="hero-emblem__signal hero-emblem__signal--br" />
      </div>

      <div class="hero-emblem__logo">
        <div class="hero-emblem__charge-fill" />
        <div class="hero-emblem__logo-inner-glow" />
        <svg
          class="hero-emblem__logo-svg"
          viewBox="0 0 300 304"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M255.855 103.421L151.944 0L0 151.229L151.944 303.571L237.084 217.934L236.596 217.741C218.796 215.674 196.967 200.887 174.025 194.767C153.234 190.031 117.854 192.284 113.738 189.784C210.706 153.869 208.725 193.015 261.188 193.69L300 154.651C205.217 202.737 227.309 139.389 112.627 146.032C208.968 101.141 220.332 165.106 297.139 144.51L273.803 121.284L273.564 121.289C209.821 145.798 215.563 94.5428 113.183 100.88C195.18 63.1381 219.363 100.88 255.774 103.395L255.855 103.421Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero-emblem {
  position: relative;
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 3 / 2;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-emblem__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  animation: emblem-float 6s ease-in-out infinite;
}

/* Perspective floor grid */
.hero-emblem__floor {
  position: absolute;
  bottom: -6%;
  left: 50%;
  width: 135%;
  height: 42%;
  transform: translateX(-50%);
  perspective: 400px;
  pointer-events: none;
  opacity: 0.35;
  mask-image: linear-gradient(to bottom, transparent 0%, black 40%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 40%, black 90%, transparent 100%);
}
.hero-emblem__floor-grid {
  width: 100%;
  height: 100%;
  transform: rotateX(72deg);
  transform-origin: center top;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: floor-pan 8s linear infinite;
}

/* Ambient halo */
.hero-emblem__halo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 620px;
  height: 620px;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    var(--emblem-halo, rgba(59, 130, 246, 0.4)) 0%,
    transparent 60%
  );
  filter: blur(60px);
  pointer-events: none;
  animation: halo-breathe 5s ease-in-out infinite;
  z-index: 0;
}

/* Radar ripples */
.hero-emblem__ripples {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  pointer-events: none;
  z-index: 2;
}
.hero-emblem__ripple {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 2px solid var(--emblem-ring-inner, rgba(147, 197, 253, 0.55));
  opacity: 0;
  animation: ripple-out 3.6s ease-out infinite;
}
.hero-emblem__ripple:nth-child(2) { animation-delay: 1.2s; }
.hero-emblem__ripple:nth-child(3) { animation-delay: 2.4s; }

/* Aurora */
.hero-emblem__aurora {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 9999px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    var(--emblem-wing-c2, #38bdf8) 30deg,
    var(--emblem-wing-c3, #818cf8) 100deg,
    #ec4899 170deg,
    transparent 240deg,
    transparent 360deg
  );
  filter: blur(30px);
  opacity: 0.55;
  animation: aurora-spin 10s linear infinite;
  pointer-events: none;
  mask-image: radial-gradient(circle, transparent 25%, black 40%, black 75%, transparent 92%);
  -webkit-mask-image: radial-gradient(circle, transparent 25%, black 40%, black 75%, transparent 92%);
}

/* Central logo */
.hero-emblem__logo-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
}

.hero-emblem__prism {
  position: absolute;
  inset: -8px;
  border-radius: 9999px;
  padding: 2px;
  background: conic-gradient(
    from 0deg,
    var(--emblem-wing-c2, #38bdf8),
    var(--emblem-wing-c3, #818cf8),
    #ec4899,
    var(--emblem-wing-c2, #38bdf8),
    var(--emblem-wing-c3, #818cf8),
    #ec4899,
    var(--emblem-wing-c2, #38bdf8)
  );
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: prism-spin 7s linear infinite;
  opacity: 0.9;
  filter: drop-shadow(0 0 12px var(--emblem-ring-glow, rgba(59, 130, 246, 0.5)));
}

.hero-emblem__logo {
  position: relative;
  z-index: 2;
  width: 200px;
  height: 200px;
  border-radius: 9999px;
  background: var(--emblem-logo-bg,
    radial-gradient(circle at 30% 30%, rgba(30, 58, 138, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%));
  border: 1px solid var(--emblem-logo-border, rgba(96, 165, 250, 0.55));
  box-shadow:
    0 0 50px var(--emblem-logo-glow, rgba(59, 130, 246, 0.6)),
    inset 0 0 26px var(--emblem-logo-glow, rgba(59, 130, 246, 0.35)),
    inset 0 2px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  overflow: hidden;
  animation: logo-breathe 4s ease-in-out infinite;
}

.hero-emblem__logo-inner-glow {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: radial-gradient(
    circle at 50% 50%,
    var(--emblem-wing-c3, #818cf8) 0%,
    transparent 60%
  );
  opacity: 0.3;
  mix-blend-mode: screen;
  animation: inner-glow-pulse 3.5s ease-in-out infinite;
  pointer-events: none;
}

/* Charge fill — subtle energy pulse behind logo (doesn't cover it) */
.hero-emblem__charge-fill {
  position: absolute;
  inset: -8%;
  border-radius: 9999px;
  background: radial-gradient(
    circle at 50% 50%,
    transparent 0%,
    transparent 35%,
    rgba(147, 197, 253, 0.45) 55%,
    rgba(56, 189, 248, 0.25) 80%,
    transparent 100%
  );
  opacity: 0;
  transform: scale(0.5);
  animation: charge-fill 3.2s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  filter: blur(6px);
}

/* Signal receiver dots (4 around logo, matching data flow directions) */
.hero-emblem__signals {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}
.hero-emblem__signal {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background: radial-gradient(circle, #ffffff 0%, #38bdf8 60%, transparent 100%);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.9);
  transform: translate(-50%, -50%);
  animation: signal-receive 1.6s ease-out infinite;
}
.hero-emblem__signal--tl { top: 15%; left: 15%; animation-delay: 0s; }
.hero-emblem__signal--tr { top: 15%; right: 15%; transform: translate(50%, -50%); animation-delay: 0.4s; }
.hero-emblem__signal--bl { bottom: 15%; left: 15%; transform: translate(-50%, 50%); animation-delay: 0.8s; }
.hero-emblem__signal--br { bottom: 15%; right: 15%; transform: translate(50%, 50%); animation-delay: 1.2s; }

.hero-emblem__logo-svg {
  position: relative;
  z-index: 1;
  width: 60%;
  height: 60%;
  color: var(--emblem-logo-color, #93c5fd);
  filter: drop-shadow(0 0 12px var(--emblem-logo-shadow, rgba(96, 165, 250, 0.8)));
  animation: logo-pulse 3s ease-in-out infinite;
}

/* ================ Animations ================ */
@keyframes emblem-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes halo-breathe {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
}

@keyframes ripple-out {
  0% { opacity: 0.8; transform: scale(0.6); }
  100% { opacity: 0; transform: scale(2.4); }
}

@keyframes aurora-spin {
  from { transform: translate(-50%, -50%) rotate(0); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes prism-spin {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}

@keyframes charge-fill {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  45% {
    opacity: 0.9;
    transform: scale(1);
  }
  55% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@keyframes signal-receive {
  0% {
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
    opacity: 0.4;
  }
  40% {
    box-shadow: 0 0 24px rgba(56, 189, 248, 1),
                0 0 40px rgba(56, 189, 248, 0.6);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
    opacity: 0.3;
  }
}

@keyframes inner-glow-pulse {
  0%, 100% { opacity: 0.2; transform: scale(0.9); }
  50% { opacity: 0.45; transform: scale(1.1); }
}

@keyframes logo-breathe {
  0%, 100% {
    box-shadow:
      0 0 50px var(--emblem-logo-glow, rgba(59, 130, 246, 0.6)),
      inset 0 0 26px var(--emblem-logo-glow, rgba(59, 130, 246, 0.35)),
      inset 0 2px 0 rgba(255, 255, 255, 0.12);
  }
  50% {
    box-shadow:
      0 0 80px var(--emblem-ring-glow-strong, rgba(96, 165, 250, 0.9)),
      inset 0 0 40px var(--emblem-ring-glow-strong, rgba(96, 165, 250, 0.55)),
      inset 0 2px 0 rgba(255, 255, 255, 0.18);
  }
}

@keyframes logo-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 12px var(--emblem-logo-shadow, rgba(96, 165, 250, 0.8)));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 24px var(--emblem-logo-shadow-strong, rgba(147, 197, 253, 1)));
    transform: scale(1.05);
  }
}

@keyframes floor-pan {
  from { background-position: 0 0; }
  to   { background-position: 0 40px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-emblem__svg,
  .hero-emblem__aurora,
  .hero-emblem__prism,
  .hero-emblem__logo,
  .hero-emblem__logo-svg,
  .hero-emblem__charge-fill,
  .hero-emblem__signal,
  .hero-emblem__logo-inner-glow,
  .hero-emblem__halo,
  .hero-emblem__ripple,
  .hero-emblem__floor-grid {
    animation-duration: 14s;
  }
}
</style>
