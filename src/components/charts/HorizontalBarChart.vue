<template>
  <div class="hbar-3d">
    <canvas ref="chartRef" class="hbar-3d__canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import {
  Chart,
  registerables,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  type ChartOptions,
  type TooltipItem
} from 'chart.js';
import { useChartTheme } from '@/composables/useChartTheme';

Chart.register(...registerables, BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

interface Props {
  labels: string[];
  data: number[];
  colors?: string[];
  valueSuffix?: string;
  datasetLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => [],
  valueSuffix: '',
  datasetLabel: ''
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'bar'> | null = null;

const { gridColor, axisTickColor, tooltip, isDark } = useChartTheme();

const DEFAULT_PALETTE = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

const rawColors = computed<string[]>(() => {
  if (props.colors.length > 0) {
    return props.labels.map((_, i) => props.colors[i % props.colors.length]);
  }
  return props.labels.map((_, i) => DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]);
});

function hexToRgb(input: string): { r: number; g: number; b: number } | null {
  const trimmed = input.trim();
  if (trimmed.startsWith('#')) {
    const hex = trimmed.replace('#', '');
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    if (full.length !== 6) return null;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16)
    };
  }
  return null;
}

function shade(color: string, factor: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  const adjust = (v: number) =>
    factor >= 0 ? Math.round(v + (255 - v) * factor) : Math.round(v * (1 + factor));
  return `rgb(${adjust(rgb.r)}, ${adjust(rgb.g)}, ${adjust(rgb.b)})`;
}

function buildBarGradient(ctx: CanvasRenderingContext2D, color: string): CanvasGradient {
  const g = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  g.addColorStop(0, shade(color, -0.08));
  g.addColorStop(0.5, color);
  g.addColorStop(1, shade(color, 0.12));
  return g;
}

const backgroundColors = computed(() => {
  const ctx = chartRef.value?.getContext('2d');
  if (!ctx) return rawColors.value;
  return rawColors.value.map((c) => buildBarGradient(ctx, c));
});

const hoverColors = computed(() => rawColors.value.map((c) => shade(c, 0.15)));

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      ...tooltip.value,
      callbacks: {
        label(context: TooltipItem<'bar'>) {
          const value = typeof context.parsed.x === 'number' ? context.parsed.x : 0;
          const suffix = props.valueSuffix ? ` ${props.valueSuffix}` : '';
          const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
          return `${formatted}${suffix}`;
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: gridColor.value },
      border: { display: false },
      ticks: {
        color: axisTickColor.value,
        font: { size: 11 }
      }
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: axisTickColor.value,
        font: { size: 11 }
      }
    }
  }
}));

function createChart(): void {
  if (!chartRef.value) return;
  destroyChart();
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.datasetLabel,
          data: props.data,
          backgroundColor: backgroundColors.value,
          hoverBackgroundColor: hoverColors.value,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.72,
          categoryPercentage: 0.85
        }
      ]
    },
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
watch(() => props.labels, createChart, { deep: true });
watch(isDark, createChart);

onBeforeUnmount(destroyChart);
</script>

<style scoped>
.hbar-3d {
  position: relative;
  width: 100%;
  height: 100%;
}
.hbar-3d__canvas {
  filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.18));
  transition: filter 0.3s ease;
}
.hbar-3d:hover .hbar-3d__canvas {
  filter: drop-shadow(0 3px 10px rgba(15, 23, 42, 0.25))
          drop-shadow(0 1px 4px rgba(59, 130, 246, 0.15));
}
</style>
