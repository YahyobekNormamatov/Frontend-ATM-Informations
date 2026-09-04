<template>
  <div class="donut-3d">
    <div class="donut-3d__floor" aria-hidden="true"></div>
    <div class="donut-3d__glow" aria-hidden="true"></div>
    <canvas ref="chartRef" class="donut-3d__canvas"></canvas>
    <div v-if="centerText" class="donut-3d__center pointer-events-none">
      <div class="donut-3d__center-halo" aria-hidden="true"></div>
      <p class="donut-3d__value">{{ centerText.value }}</p>
      <p class="donut-3d__label">{{ centerText.label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { Chart, registerables, DoughnutController, ArcElement, type ChartOptions } from 'chart.js';
import type { DoughnutChartData } from '@/types/api';
import { useChartTheme } from '@/composables/useChartTheme';

Chart.register(...registerables, DoughnutController, ArcElement);

interface Props {
  data: DoughnutChartData;
  options?: ChartOptions<'doughnut'>;
  centerText?: {
    value: string | number;
    label: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  centerText: undefined
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'doughnut'> | null = null;

const { chartBorderColor, tooltip, isDark } = useChartTheme();

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: tooltip.value
  },
  cutout: '70%',
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
    animateRotate: true,
    animateScale: true
  },
  ...props.options
}));

function hexToRgb(input: string): { r: number; g: number; b: number } | null {
  const trimmed = input.trim();
  if (trimmed.startsWith('#')) {
    const hex = trimmed.replace('#', '');
    const full = hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex;
    if (full.length !== 6) return null;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16)
    };
  }
  const match = trimmed.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (match) {
    return { r: +match[1], g: +match[2], b: +match[3] };
  }
  return null;
}

function toRgba(color: string, alpha: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function shade(color: string, factor: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  const adjust = (v: number) =>
    factor >= 0
      ? Math.round(v + (255 - v) * factor)
      : Math.round(v * (1 + factor));
  return `rgb(${adjust(rgb.r)}, ${adjust(rgb.g)}, ${adjust(rgb.b)})`;
}

function buildGradient(ctx: CanvasRenderingContext2D, color: string): CanvasGradient {
  const { width, height } = ctx.canvas;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, shade(color, 0.08));
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, shade(color, -0.15));
  return gradient;
}

function themedData(): DoughnutChartData {
  const ctx = chartRef.value?.getContext('2d');
  if (!ctx) return props.data;

  const datasets = props.data.datasets.map((ds) => {
    const originalColors = Array.isArray(ds.backgroundColor)
      ? ds.backgroundColor
      : [ds.backgroundColor as string];
    const enhancedColors = originalColors.map((c) => buildGradient(ctx, c));
    const hoverColors = originalColors.map((c) => toRgba(shade(c, 0.1), 1));
    return {
      ...ds,
      backgroundColor: enhancedColors,
      hoverBackgroundColor: hoverColors,
      hoverOffset: 4,
      borderColor: ds.borderColor ?? chartBorderColor.value,
      borderWidth: ds.borderWidth ?? 2,
      borderJoinStyle: 'round' as CanvasLineJoin,
      spacing: 1
    };
  });

  return {
    labels: props.data.labels,
    datasets: datasets as unknown as DoughnutChartData['datasets']
  };
}

function createChart(): void {
  if (!chartRef.value) return;
  destroyChart();
  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: themedData(),
    options: chartOptions.value
  });
}

function destroyChart(): void {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

onMounted(createChart);

watch(() => props.data, createChart, { deep: true });
watch(() => props.options, createChart, { deep: true });
watch(isDark, createChart);

onBeforeUnmount(destroyChart);
</script>

<style scoped>
.donut-3d {
  position: relative;
  width: 100%;
  height: 100%;
  isolation: isolate;
}

/* Ambient glow behind the donut (subtle) */
.donut-3d__glow {
  position: absolute;
  inset: 12%;
  border-radius: 9999px;
  background: radial-gradient(
    circle at 50% 45%,
    rgba(96, 165, 250, 0.18) 0%,
    rgba(59, 130, 246, 0.08) 50%,
    transparent 75%
  );
  filter: blur(16px);
  z-index: 0;
}

/* 3D floor shadow (soft ellipse under donut) */
.donut-3d__floor {
  position: absolute;
  left: 50%;
  bottom: 5%;
  width: 68%;
  height: 8%;
  transform: translateX(-50%);
  border-radius: 9999px;
  background: radial-gradient(
    ellipse at center,
    rgba(2, 6, 23, 0.28) 0%,
    rgba(2, 6, 23, 0.12) 45%,
    transparent 78%
  );
  filter: blur(8px);
  z-index: 0;
}

.donut-3d__canvas {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.2))
          drop-shadow(0 2px 4px rgba(59, 130, 246, 0.12));
}

/* Center text stack */
.donut-3d__center {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.05;
}

.donut-3d__center-halo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(96, 165, 250, 0.14) 0%,
    rgba(59, 130, 246, 0.06) 55%,
    transparent 80%
  );
  filter: blur(6px);
  pointer-events: none;
}

.donut-3d__value {
  position: relative;
  font-size: 2rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  color: var(--ai-text-1, #0f172a);
  filter: drop-shadow(0 1px 3px rgba(59, 130, 246, 0.2));
}

.donut-3d__label {
  position: relative;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ai-text-3, #64748b);
  margin-top: 0.35rem;
}

</style>
