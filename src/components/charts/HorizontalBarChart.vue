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

const backgroundColors = computed<string[]>(() => {
  if (props.colors.length > 0) {
    return props.labels.map((_, i) => props.colors[i % props.colors.length]);
  }
  return props.labels.map((_, i) => DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]);
});

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
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.7
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
