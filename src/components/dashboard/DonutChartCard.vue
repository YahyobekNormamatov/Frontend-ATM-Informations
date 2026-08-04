<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
    <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4 tracking-wide">{{ title }}</h3>

    <div v-if="unavailable">
      <EmptyState :message="emptyMessage" />
    </div>
    <template v-else>
      <div class="flex items-center justify-center">
        <div class="w-48 h-48">
          <DonutChart :data="chartData" :options="chartOptions" :center-text="centerText" />
        </div>
      </div>
      <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-5">
        <div v-for="item in legend" :key="item.label" class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
          <span class="text-xs text-gray-600 dark:text-slate-400">{{ item.label }}</span>
          <span class="text-xs font-semibold text-gray-800 dark:text-slate-100">{{ item.value }}{{ legendSuffix }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChartOptions } from 'chart.js';
import DonutChart from '@/components/charts/DonutChart.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import type { DoughnutChartData } from '@/types/api';

interface Props {
  title: string;
  data: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  legend?: Array<{ label: string; value: number; color: string }>;
  centerText?: { value: string | number; label: string };
  legendSuffix?: string;
  unavailable?: boolean;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  unavailable: false,
  emptyMessage: "Ma'lumot mavjud emas",
  legendSuffix: '%',
  centerText: undefined,
  legend: () => []
});

const chartData = computed<DoughnutChartData>(() => ({
  labels: props.data.labels,
  datasets: [
    {
      data: props.data.values,
      backgroundColor: props.data.colors,
      borderWidth: 3
    }
  ]
}));

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false }
  },
  cutout: '72%'
};
</script>
