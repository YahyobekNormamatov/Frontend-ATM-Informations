<template>
  <div class="ai-bg" :class="{ 'ai-bg--dark': isDark }" aria-hidden="true">
    <canvas ref="canvasRef" class="ai-bg__canvas" />
    <div class="ai-bg__grid" />
    <div class="ai-bg__glow ai-bg__glow--1" />
    <div class="ai-bg__glow ai-bg__glow--2" />
    <div class="ai-bg__glow ai-bg__glow--3" />
    <div class="ai-bg__stars">
      <span v-for="i in 40" :key="i" class="ai-bg__star" :style="starStyle(i)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
  isDark: boolean;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let rafId = 0;
let resizeObserver: ResizeObserver | null = null;

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
}

const PARTICLE_COUNT = 90;
const CONNECT_DIST = 130;

function starStyle(i: number) {
  const top = (i * 37) % 100;
  const left = (i * 71) % 100;
  const delay = (i % 10) * 0.6;
  const size = 1 + ((i * 13) % 3);
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  };
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles: Particle[] = [];

  const seed = () => {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      vz: (Math.random() - 0.5) * 0.002,
      size: Math.random() * 1.4 + 0.6
    }));
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (particles.length === 0) seed();
  };

  const step = () => {
    ctx.clearRect(0, 0, width, height);

    const dark = props.isDark;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      if (p.z < 0.3 || p.z > 1.1) p.vz *= -1;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d < CONNECT_DIST) {
          const baseAlpha = dark ? 0.35 : 0.18;
          const alpha = (1 - d / CONNECT_DIST) * baseAlpha * Math.min(p.z, q.z);
          ctx.strokeStyle = dark
            ? `rgba(96, 165, 250, ${alpha})`
            : `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      const radius = p.size * p.z * 1.8;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3);
      if (dark) {
        gradient.addColorStop(0, `rgba(147, 197, 253, ${0.9 * p.z})`);
        gradient.addColorStop(0.4, `rgba(59, 130, 246, ${0.35 * p.z})`);
        gradient.addColorStop(1, 'rgba(29, 78, 216, 0)');
      } else {
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.5 * p.z})`);
        gradient.addColorStop(0.4, `rgba(37, 99, 235, ${0.18 * p.z})`);
        gradient.addColorStop(1, 'rgba(30, 64, 175, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  };

  resize();
  step();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.ai-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 0%, #dbeafe 0%, #eff6ff 55%, #ffffff 100%);
  pointer-events: none;
  transition: background 0.4s ease;
}
.ai-bg--dark {
  background:
    radial-gradient(ellipse at 50% 0%, #0b1e42 0%, #050c1f 55%, #020617 100%);
}

.ai-bg__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
}
.ai-bg--dark .ai-bg__canvas {
  opacity: 0.85;
}

.ai-bg__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.09) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%);
  animation: bg-grid-pan 40s linear infinite;
  transition: background-image 0.4s ease;
}
.ai-bg--dark .ai-bg__grid {
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.09) 1px, transparent 1px);
}

.ai-bg__glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(120px);
  mix-blend-mode: multiply;
  opacity: 0.35;
  transition: opacity 0.4s ease, mix-blend-mode 0.4s ease;
}
.ai-bg--dark .ai-bg__glow {
  mix-blend-mode: screen;
  opacity: 0.55;
}
.ai-bg__glow--1 {
  width: 620px;
  height: 620px;
  left: 50%;
  top: 8%;
  transform: translateX(-50%);
  background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
  animation: bg-pulse 8s ease-in-out infinite;
}
.ai-bg--dark .ai-bg__glow--1 {
  background: radial-gradient(circle, #2563eb 0%, transparent 70%);
}
.ai-bg__glow--2 {
  width: 420px;
  height: 420px;
  left: 8%;
  top: 55%;
  background: radial-gradient(circle, #a5f3fc 0%, transparent 70%);
  animation: bg-pulse-side 11s ease-in-out infinite 2s;
}
.ai-bg--dark .ai-bg__glow--2 {
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
}
.ai-bg__glow--3 {
  width: 500px;
  height: 500px;
  right: 6%;
  top: 45%;
  background: radial-gradient(circle, #ddd6fe 0%, transparent 70%);
  animation: bg-pulse-side 13s ease-in-out infinite 1s;
}
.ai-bg--dark .ai-bg__glow--3 {
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
}

.ai-bg__stars {
  position: absolute;
  inset: 0;
}
.ai-bg__star {
  position: absolute;
  background: #2563eb;
  border-radius: 9999px;
  opacity: 0.35;
  animation: bg-twinkle 3.5s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.35);
}
.ai-bg--dark .ai-bg__star {
  background: white;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
}

@keyframes bg-grid-pan {
  from { background-position: 0 0, 0 0; }
  to   { background-position: 48px 48px, 48px 48px; }
}
@keyframes bg-pulse {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: var(--pulse-opacity, 0.35); }
  50%      { transform: translateX(-50%) scale(1.1); opacity: calc(var(--pulse-opacity, 0.35) + 0.15); }
}
@keyframes bg-pulse-side {
  0%, 100% { transform: scale(1); opacity: var(--pulse-opacity, 0.35); }
  50%      { transform: scale(1.15); opacity: calc(var(--pulse-opacity, 0.35) + 0.15); }
}
@keyframes bg-twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50%      { opacity: 0.9; transform: scale(1.4); }
}
</style>
