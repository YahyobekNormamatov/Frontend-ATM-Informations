<template>
  <div class="w-full h-full">
    <canvas ref="chartRef"></canvas>
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

function createChart(): void {
  if (!chartRef.value) return;
  destroyChart();
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: props.data as unknown as ChartData<'bar'>,
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
