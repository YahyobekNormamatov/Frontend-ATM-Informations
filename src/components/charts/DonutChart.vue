<template>
  <div class="w-full h-full relative">
    <canvas ref="chartRef"></canvas>
    <div v-if="centerText" class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="text-center leading-tight">
        <p class="text-3xl font-extrabold text-gray-800 dark:text-slate-100 tabular-nums">{{ centerText.value }}</p>
        <p class="text-[11px] uppercase tracking-wider text-gray-500 dark:text-slate-400 mt-0.5">{{ centerText.label }}</p>
      </div>
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
  ...props.options
}));

function themedData(): DoughnutChartData {
  return {
    labels: props.data.labels,
    datasets: props.data.datasets.map((ds) => ({
      ...ds,
      borderColor: ds.borderColor ?? chartBorderColor.value,
      borderWidth: ds.borderWidth ?? 2
    }))
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
