<template>
  <div class="dual-3d">
    <canvas ref="chartRef" class="dual-3d__canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import {
  Chart,
  registerables,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type TooltipItem
} from 'chart.js';
import type { BarLineChartData } from '@/types/api';
import { useChartTheme } from '@/composables/useChartTheme';

Chart.register(
  ...registerables,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

type BarChartOptions = ChartOptions<'bar'>;

interface Props {
  data: BarLineChartData;
  options?: BarChartOptions;
  yAxisUnit?: string;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  yAxisUnit: 'mlrd'
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'bar'> | null = null;

const { gridColor, axisTickColor, legendColor, tooltip, isDark } = useChartTheme();

const chartOptions = computed<BarChartOptions>(() => {
  const unitSuffix = props.yAxisUnit ? ` ${props.yAxisUnit}` : '';
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: legendColor.value,
          font: { size: 12, weight: 500 }
        }
      },
      tooltip: {
        ...tooltip.value,
        callbacks: {
          label(context: TooltipItem<'bar'>) {
            const label = context.dataset.label ?? '';
            const value = typeof context.parsed.y === 'number' ? context.parsed.y : 0;
            const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
            return `${label}: ${formatted}${unitSuffix}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: gridColor.value },
        border: { display: false },
        ticks: {
          color: axisTickColor.value,
          font: { size: 11 },
          callback(value) {
            return `${value}${unitSuffix}`;
          }
        }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: axisTickColor.value,
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 30
        }
      }
    },
    ...props.options
  };
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
  const m = trimmed.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
}

function shade(color: string, factor: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  const adj = (v: number) =>
    factor >= 0 ? Math.round(v + (255 - v) * factor) : Math.round(v * (1 + factor));
  return `rgb(${adj(rgb.r)}, ${adj(rgb.g)}, ${adj(rgb.b)})`;
}

function buildVerticalGradient(
  ctx: CanvasRenderingContext2D,
  color: string
): CanvasGradient {
  const h = ctx.canvas.height;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, shade(color, 0.12));
  g.addColorStop(0.55, color);
  g.addColorStop(1, shade(color, -0.15));
  return g;
}

function enhancedData(): ChartData<'bar'> {
  const ctx = chartRef.value?.getContext('2d');
  if (!ctx) return props.data as unknown as ChartData<'bar'>;

  const datasets = props.data.datasets.map((ds) => {
    const t = ds.type ?? 'bar';
    const singleColor =
      typeof ds.backgroundColor === 'string' ? ds.backgroundColor : undefined;

    if (t === 'bar' && singleColor) {
      return {
        ...ds,
        backgroundColor: buildVerticalGradient(ctx, singleColor),
        hoverBackgroundColor: shade(singleColor, 0.2),
        borderRadius: 8,
        borderSkipped: false
      };
    }
    if (t === 'line') {
      return {
        ...ds,
        borderWidth: (ds.borderWidth as number) ?? 3,
        pointRadius: (ds.pointRadius as number) ?? 4,
        pointHoverRadius: (ds.pointHoverRadius as number) ?? 6,
        pointBackgroundColor:
          (ds.pointBackgroundColor as string) ?? (ds.borderColor as string) ?? singleColor,
        tension: (ds.tension as number) ?? 0.35,
        fill: ds.fill ?? false
      };
    }
    return ds;
  });

  return {
    labels: props.data.labels,
    datasets
  } as unknown as ChartData<'bar'>;
}

function createChart(): void {
  if (!chartRef.value) return;
  destroyChart();
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: enhancedData(),
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
.dual-3d {
  position: relative;
  width: 100%;
  height: 100%;
}
.dual-3d__canvas {
  filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.18));
  transition: filter 0.3s ease;
}
.dual-3d:hover .dual-3d__canvas {
  filter: drop-shadow(0 3px 10px rgba(15, 23, 42, 0.25))
          drop-shadow(0 1px 4px rgba(59, 130, 246, 0.15));
}
</style>
