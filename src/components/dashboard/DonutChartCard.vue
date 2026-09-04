<template>
  <div class="donut-card">
    <div class="donut-card__title-wrap">
      <span class="donut-card__accent"></span>
      <h3 class="donut-card__title">{{ title }}</h3>
    </div>

    <div v-if="unavailable">
      <EmptyState :message="emptyMessage" />
    </div>
    <template v-else>
      <div class="flex items-center justify-center">
        <div class="w-52 h-52">
          <DonutChart :data="chartData" :options="chartOptions" :center-text="centerText" />
        </div>
      </div>
      <div class="donut-card__legend">
        <div
          v-for="item in legend"
          :key="item.label"
          class="donut-card__legend-item"
        >
          <span
            class="donut-card__dot"
            :style="{
              background: `radial-gradient(circle at 30% 30%, ${item.color}, ${item.color}66)`,
              boxShadow: `0 0 8px ${item.color}80, inset 0 1px 0 rgba(255,255,255,0.35)`
            }"
          ></span>
          <span class="donut-card__legend-label">{{ item.label }}</span>
          <span class="donut-card__legend-value">
            {{ item.value }}{{ legendSuffix }}
          </span>
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

<style scoped>
.donut-card {
  position: relative;
  background-image: linear-gradient(140deg, var(--ai-panel-from) 0%, var(--ai-panel-to) 100%);
  border: 1px solid var(--ai-border);
  border-radius: 16px;
  padding: 1.35rem 1.35rem 1.15rem;
  backdrop-filter: blur(8px);
  box-shadow: var(--ai-shadow-sm);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  isolation: isolate;
}
.donut-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(96, 165, 250, 0.08) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.7s ease;
  pointer-events: none;
  z-index: 0;
}
.donut-card:hover {
  transform: translateY(-3px);
  border-color: var(--ai-border-strong);
  box-shadow: var(--ai-shadow-md);
}
.donut-card:hover::before {
  transform: translateX(100%);
}

/* Title with accent bar */
.donut-card__title-wrap {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}
.donut-card__accent {
  width: 3px;
  height: 16px;
  border-radius: 9999px;
  background: linear-gradient(180deg, var(--ai-accent, #2563eb), var(--ai-accent-2, #60a5fa));
  box-shadow: 0 0 8px var(--ai-accent, #2563eb);
}
.donut-card__title {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ai-text-1);
}

/* Legend */
.donut-card__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.1rem;
  margin-top: 1.15rem;
  position: relative;
  z-index: 1;
}
.donut-card__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.15);
  transition: background 0.2s ease, border-color 0.2s ease;
}
.donut-card__legend-item:hover {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.35);
}
.donut-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  flex-shrink: 0;
}
.donut-card__legend-label {
  font-size: 0.72rem;
  color: var(--ai-text-3);
  font-weight: 500;
  letter-spacing: 0.02em;
}
.donut-card__legend-value {
  font-size: 0.78rem;
  color: var(--ai-text-1);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>
