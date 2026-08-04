<template>
  <div class="space-y-6">
    <div v-if="dashboardStore.isLoading && !dashboardStore.data" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Skeleton v-for="i in 5" :key="i" height="8rem" />
      </div>
      <Skeleton height="16rem" />
    </div>

    <ErrorState
      v-else-if="dashboardStore.error && !dashboardStore.data"
      :message="dashboardStore.error"
      :on-retry="() => dashboardStore.fetchDashboard()"
    />

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="JAMI ATM"
          :value="summary?.total_atms ?? '—'"
          :icon="Landmark"
          iconBg="bg-purple-50"
          iconColor="text-purple-600 dark:text-purple-300"
        />
        <StatCard
          title="ONLAYN"
          :value="summary?.soz ?? '—'"
          :icon="Wifi"
          iconBg="bg-green-50"
          iconColor="text-green-600 dark:text-green-300"
          :progress="dashboardStore.workingPercentage"
          progressLabel="Ishlayotgan qurilmalar"
        />
        <StatCard
          title="OGOHLANTIRISH"
          value="—"
          :icon="AlertTriangle"
          iconBg="bg-orange-50"
          iconColor="text-orange-500 dark:text-orange-300"
          subtitle="Backend API'da mavjud emas"
        />
        <StatCard
          title="PUL TUGAGAN"
          value="—"
          :icon="DollarSign"
          iconBg="bg-red-50"
          iconColor="text-red-500 dark:text-red-300"
          subtitle="Backend API'da mavjud emas"
        />
        <StatCard
          title="OFLAYN"
          :value="summary?.nosoz ?? '—'"
          :icon="WifiOff"
          iconBg="bg-gray-100"
          iconColor="text-gray-600 dark:text-slate-300"
          :progress="dashboardStore.faultyPercentage"
          progressLabel="jami"
          subtitle="Bog'lanish yo'q"
        />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
        <div class="flex items-center gap-4">
          <div class="flex rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <button
              class="px-4 py-2 text-sm font-medium transition-colors"
              :class="view === 'kirish'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'"
              @click="view = 'kirish'">
              Kirish / Chiqish
            </button>
            <button
              class="px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 dark:border-slate-700"
              :class="view === 'tranzaksiya'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'"
              @click="view = 'tranzaksiya'">
              Tranzaksiya turlari
            </button>
          </div>
        </div>
        <div v-if="view === 'kirish'" class="flex items-center gap-2">
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="chartView === 'table'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'"
            @click="chartView = 'table'">
            Jadval
          </button>
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="chartView === 'chart'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'"
            @click="chartView = 'chart'">
            Diagramma
          </button>
        </div>
      </div>

      <div v-if="view === 'tranzaksiya'" class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
        <EmptyState message="Tranzaksiya turlari bo'yicha filial kesimida ma'lumot API'da mavjud emas" />
      </div>

      <template v-else>
        <div v-if="chartView === 'table'" class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div v-if="topRegions.length === 0" class="p-8">
            <EmptyState message="Filiallar kesimidagi ma'lumot mavjud emas" />
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-12">№</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Viloyat</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Jami ATM</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Faol</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Nofaol</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Soz</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Nosoz</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Kirim</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Chiqim</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Uptime</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                <tr
                  v-for="(region, idx) in topRegions"
                  :key="`${region.region}-${idx}`"
                  class="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td class="px-4 py-3 text-gray-500 dark:text-slate-400">{{ idx + 1 }}</td>
                  <td class="px-4 py-3 font-medium text-gray-700 dark:text-slate-200 max-w-[200px] truncate" :title="region.region">{{ region.region }}</td>
                  <td class="px-4 py-3 text-right text-gray-700 dark:text-slate-200 font-semibold">{{ region.total }}</td>
                  <td class="px-4 py-3 text-right text-gray-600 dark:text-slate-300">{{ region.active }}</td>
                  <td class="px-4 py-3 text-right text-gray-500 dark:text-slate-400">{{ region.inactive ?? '—' }}</td>
                  <td class="px-4 py-3 text-right text-green-600 dark:text-green-400 font-semibold">{{ region.soz ?? '—' }}</td>
                  <td class="px-4 py-3 text-right text-red-600 dark:text-red-400 font-semibold">{{ region.nosoz ?? '—' }}</td>
                  <td class="px-4 py-3 text-right text-gray-600 dark:text-slate-300 font-mono">{{ formatMoneyOrDash(region.income) }}</td>
                  <td class="px-4 py-3 text-right text-gray-600 dark:text-slate-300 font-mono">{{ formatMoneyOrDash(region.expense) }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center gap-2 justify-end">
                      <div class="w-16 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full rounded-full" :class="uptimeBarClass(region)" :style="{ width: `${regionUptime(region)}%` }"></div>
                      </div>
                      <span class="font-semibold w-12 text-right" :class="uptimeTextClass(region)">{{ formatPercent(regionUptime(region)) }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 dark:bg-slate-800/60 border-t border-gray-200 dark:border-slate-800">
                <tr>
                  <td colspan="2" class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Jami:</td>
                  <td class="px-4 py-3 text-right text-sm text-gray-800 dark:text-slate-100 font-bold">{{ regionsTotal.total }}</td>
                  <td class="px-4 py-3 text-right text-sm text-gray-800 dark:text-slate-100 font-bold">{{ regionsTotal.active }}</td>
                  <td class="px-4 py-3 text-right text-sm text-gray-500 dark:text-slate-400 font-bold">{{ regionsTotal.inactive }}</td>
                  <td class="px-4 py-3 text-right text-sm text-green-600 dark:text-green-400 font-bold">{{ regionsTotal.soz }}</td>
                  <td class="px-4 py-3 text-right text-sm text-red-600 dark:text-red-400 font-bold">{{ regionsTotal.nosoz }}</td>
                  <td class="px-4 py-3 text-right text-sm text-gray-800 dark:text-slate-100 font-bold font-mono">{{ formatMoneyOrDash(regionsTotal.income) }}</td>
                  <td class="px-4 py-3 text-right text-sm text-gray-800 dark:text-slate-100 font-bold font-mono">{{ formatMoneyOrDash(regionsTotal.expense) }}</td>
                  <td class="px-4 py-3 text-right text-sm text-purple-700 dark:text-purple-300 font-bold">{{ formatPercent(safePercentage(regionsTotal.soz, regionsTotal.total)) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div v-else class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
          <div v-if="!chartHasData" class="p-8">
            <EmptyState message="Diagramma uchun ma'lumot mavjud emas" />
          </div>
          <template v-else>
            <div class="flex items-center gap-6 mb-6 flex-wrap">
              <div>
                <span class="text-xs text-gray-500 dark:text-slate-400">Jami ATM</span>
                <p class="text-lg font-bold text-purple-600 dark:text-purple-300">{{ regionsTotal.total }}</p>
              </div>
              <div>
                <span class="text-xs text-gray-500 dark:text-slate-400">Onlayn (soz)</span>
                <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ regionsTotal.soz }}</p>
              </div>
              <div>
                <span class="text-xs text-gray-500 dark:text-slate-400">Oflayn (nosoz)</span>
                <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ regionsTotal.nosoz }}</p>
              </div>
              <div>
                <span class="text-xs text-gray-500 dark:text-slate-400">Filiallar soni</span>
                <p class="text-lg font-bold text-gray-800 dark:text-slate-100">{{ topRegions.length }}</p>
              </div>
            </div>
            <div class="h-96">
              <DualAxisChart :data="chartData" y-axis-unit="ta" />
            </div>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import StatCard from '@/components/dashboard/StatCard.vue';
import DualAxisChart from '@/components/charts/DualAxisChart.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { Landmark, Wifi, AlertTriangle, DollarSign, WifiOff } from 'lucide-vue-next';
import { formatPercent, safePercentage } from '@/utils/format';
import type { BarLineChartData, DashboardRegionStat } from '@/types/api';
import { onRefresh } from '@/composables/useRefreshBus';

const dashboardStore = useDashboardStore();
const view = ref<'kirish' | 'tranzaksiya'>('kirish');
const chartView = ref<'table' | 'chart'>('table');

const summary = computed(() => dashboardStore.summary);
const topRegions = computed(() => dashboardStore.topRegions);

const regionsTotal = computed(() => {
  const acc = { total: 0, active: 0, inactive: 0, soz: 0, nosoz: 0, income: 0, expense: 0 };
  for (const r of topRegions.value) {
    acc.total += r.total ?? 0;
    acc.active += r.active ?? 0;
    acc.inactive += r.inactive ?? 0;
    acc.soz += r.soz ?? 0;
    acc.nosoz += r.nosoz ?? 0;
    acc.income += r.income ?? 0;
    acc.expense += r.expense ?? 0;
  }
  return acc;
});

function regionUptime(r: DashboardRegionStat): number {
  return safePercentage(r.soz ?? 0, r.total);
}

function uptimeBarClass(r: DashboardRegionStat): string {
  const u = regionUptime(r);
  if (u >= 80) return 'bg-green-500';
  if (u >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function uptimeTextClass(r: DashboardRegionStat): string {
  const u = regionUptime(r);
  if (u >= 80) return 'text-green-600 dark:text-green-400';
  if (u >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function formatMoneyOrDash(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return '—';
  return Math.round(value).toLocaleString('uz-UZ').replace(/,/g, ' ');
}


const chartHasData = computed(() => topRegions.value.length > 0);

const chartData = computed<BarLineChartData>(() => ({
  labels: topRegions.value.map((r) => r.region),
  datasets: [
    {
      type: 'line',
      label: 'Jami ATM',
      data: topRegions.value.map((r) => r.total ?? 0),
      borderColor: '#7C4DFF',
      backgroundColor: 'rgba(124, 77, 255, 0.12)',
      pointBackgroundColor: '#7C4DFF',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.35,
      fill: true,
      borderWidth: 2
    },
    {
      type: 'line',
      label: 'Onlayn (soz)',
      data: topRegions.value.map((r) => r.soz ?? 0),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.10)',
      pointBackgroundColor: '#10B981',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.35,
      fill: false,
      borderWidth: 2
    },
    {
      type: 'line',
      label: 'Oflayn (nosoz)',
      data: topRegions.value.map((r) => r.nosoz ?? 0),
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.10)',
      pointBackgroundColor: '#EF4444',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.35,
      fill: false,
      borderWidth: 2
    }
  ]
}));

onMounted(() => {
  if (!dashboardStore.data) {
    dashboardStore.fetchDashboard();
  }
});

onRefresh(() => dashboardStore.fetchDashboard());
</script>
