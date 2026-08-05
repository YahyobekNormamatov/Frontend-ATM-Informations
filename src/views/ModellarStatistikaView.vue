<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-slate-100">Modellar statistikasi</h1>
      <p class="text-sm text-gray-500 dark:text-slate-400">ATM va terminallar modellari bo'yicha statistik ma'lumotlar</p>
    </div>

    <div v-if="atmStore.isAllAtmsLoading && atmStore.allAtms.length === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton v-for="i in 2" :key="i" height="18rem" />
    </div>

    <ErrorState
      v-else-if="atmStore.allAtmsError"
      :message="atmStore.allAtmsError"
      :on-retry="() => atmStore.fetchAllAtms(true)"/>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4">Modellar bo'yicha taqsimot</h3>
        <div v-if="modelStats.length === 0" class="h-64 flex items-center justify-center">
          <EmptyState message="Model ma'lumoti mavjud emas" />
        </div>
        <template v-else>
          <div class="h-64">
            <DonutChart :data="modelChartData" />
          </div>
          <div class="flex flex-wrap justify-center gap-4 mt-4">
            <div v-for="item in modelStats" :key="item.model" class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></span>
              <span class="text-sm text-gray-600 dark:text-slate-300">{{ item.model }}</span>
              <span class="text-sm font-semibold text-gray-800 dark:text-slate-100">{{ item.count }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">Modellar samaradorligi</h3>
        <p class="text-xs text-gray-400 dark:text-slate-500 mb-3"></p>
        <div v-if="modelDetails.length === 0" class="py-8">
          <EmptyState message="Ma'lumot mavjud emas" />
        </div>
        <div v-else class="space-y-4">
          <div v-for="item in modelDetails" :key="item.model" class="space-y-1">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-slate-300">{{ item.model }}</span>
              <span class="font-semibold text-gray-800 dark:text-slate-100">{{ formatPercent(item.uptime) }}</span>
            </div>
            <div class="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${item.uptime}%`, backgroundColor: getPerformanceColor(item.uptime) }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden lg:col-span-2">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">Modellar haqida batafsil</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Model</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Soni</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Online</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Offline</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Soz ulushi</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Holati</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
              <tr v-if="modelDetails.length === 0">
                <td colspan="6" class="px-4 py-8">
                  <EmptyState message="Ma'lumot mavjud emas" />
                </td>
              </tr>
              <tr v-for="item in modelDetails" :key="item.model" class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-4 py-3 text-sm font-medium text-gray-800 dark:text-slate-100">{{ item.model }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">{{ item.total }}</td>
                <td class="px-4 py-3 text-sm text-green-600 dark:text-green-400">{{ item.online }}</td>
                <td class="px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ item.offline }}</td>
                <td class="px-4 py-3 text-sm font-semibold" :class="uptimeTextClass(item.uptime)">
                  {{ formatPercent(item.uptime) }}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium" :class="uptimeBadgeClass(item.uptime)">
                    {{ uptimeLabel(item.uptime) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import DonutChart from '@/components/charts/DonutChart.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useAtmStore } from '@/stores/atmStore';
import { formatPercent, safePercentage } from '@/utils/format';
import type { DoughnutChartData } from '@/types/api';
import { onRefresh } from '@/composables/useRefreshBus';

const atmStore = useAtmStore();

const PALETTE = ['#7C4DFF', '#00BFA5', '#F59E0B', '#3B82F6', '#EC4899', '#10B981', '#EF4444', '#6366F1'];

interface ModelDetail {
  model: string;
  total: number;
  online: number;
  offline: number;
  uptime: number;
}

const modelDetails = computed<ModelDetail[]>(() => {
  const map = new Map<string, { total: number; online: number; offline: number }>();
  for (const atm of atmStore.allAtms) {
    const key = atm.model || "Noma'lum";
    const entry = map.get(key) ?? { total: 0, online: 0, offline: 0 };
    entry.total += 1;
    if (atm.status?.toUpperCase() === 'SOZ') entry.online += 1;
    else entry.offline += 1;
    map.set(key, entry);
  }

  return Array.from(map.entries())
    .map(([model, stats]) => ({
      model,
      total: stats.total,
      online: stats.online,
      offline: stats.offline,
      uptime: safePercentage(stats.online, stats.total)
    }))
    .sort((a, b) => b.total - a.total);
});

const modelStats = computed(() =>
  modelDetails.value.map((item, idx) => ({
    model: item.model,
    count: item.total,
    color: PALETTE[idx % PALETTE.length]
  }))
);

const modelChartData = computed<DoughnutChartData>(() => ({
  labels: modelStats.value.map((m) => m.model),
  datasets: [
    {
      data: modelStats.value.map((m) => m.count),
      backgroundColor: modelStats.value.map((m) => m.color),
      borderWidth: 2
    }
  ]
}));

function getPerformanceColor(uptime: number): string {
  if (uptime >= 80) return '#10B981';
  if (uptime >= 50) return '#F59E0B';
  return '#EF4444';
}

function uptimeTextClass(uptime: number): string {
  if (uptime >= 80) return 'text-green-600 dark:text-green-400';
  if (uptime >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function uptimeBadgeClass(uptime: number): string {
  if (uptime >= 80) return 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300';
  if (uptime >= 50) return 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-300';
  return 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300';
}

function uptimeLabel(uptime: number): string {
  if (uptime >= 80) return 'Yaxshi';
  if (uptime >= 50) return "O'rtacha";
  return 'Yomon';
}

onMounted(() => {
  atmStore.fetchAllAtms();
});

onRefresh(() => atmStore.fetchAllAtms(true));
</script>
