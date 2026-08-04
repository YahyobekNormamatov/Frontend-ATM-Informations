<template>
  <div class="space-y-6">
    <div v-if="dashboardStore.isLoading && !dashboardStore.data" class="space-y-6">
      <Skeleton height="10rem" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton v-for="i in 4" :key="i" height="14rem" />
      </div>
    </div>

    <ErrorState
      v-else-if="dashboardStore.error && !dashboardStore.data"
      :message="dashboardStore.error"
      :on-retry="() => dashboardStore.fetchDashboard()"/>

    <template v-else>
      <div class="bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 text-white ring-1 ring-slate-800/60">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-medium text-gray-400">Umumiy pul oqimi va ATM holati</h2>
              <span class="text-xs text-gray-500">Joriy davr</span>
            </div>
            <div class="flex items-center gap-8 flex-wrap">
              <div>
                <p class="text-xs text-gray-400">Jami aylanma</p>
                <p class="text-3xl font-bold text-yellow-400">{{ formatSumShort(totalTurnover) }}</p>
                <p class="text-xs text-gray-500">Kirim + Chiqim UZS</p>
              </div>
              <div class="flex gap-6 text-sm flex-wrap">
                <div class="flex items-center gap-2">
                  <span class="text-green-400 text-lg">↑</span>
                  <div>
                    <p class="text-xs text-gray-500">Kirim</p>
                    <p class="text-gray-100 font-semibold">{{ formatSumShort(finance?.income) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-red-400 text-lg">↓</span>
                  <div>
                    <p class="text-xs text-gray-500">Chiqim</p>
                    <p class="text-gray-100 font-semibold">{{ formatSumShort(finance?.expense) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-purple-400 text-lg">≈</span>
                  <div>
                    <p class="text-xs text-gray-500">Foyda / zarar</p>
                    <p class="font-semibold" :class="(finance?.profit ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'">
                      {{ formatSumShort(finance?.profit) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-l border-gray-700 pl-6">
            <p class="text-xs text-gray-400">TARMOQ RISK BAHOSI</p>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-2xl font-bold text-yellow-400">{{ dashboardStore.networkRiskScore }}</span>
              <span class="text-sm text-gray-300">/ 100</span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">{{ dashboardStore.networkRiskLevel }}</span>
              <span class="text-xs text-gray-400">{{ stabilityText }}</span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p class="text-gray-500">Soz</p>
                <p class="text-green-400 font-bold">{{ summary?.soz ?? '—' }}</p>
              </div>
              <div>
                <p class="text-gray-500">Nosoz</p>
                <p class="text-red-400 font-bold">{{ summary?.nosoz ?? '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-4 border-t border-gray-700">
          <div>
            <p class="text-xs text-gray-500">JAMI ATM</p>
            <p class="text-lg font-bold">{{ summary?.total_atms ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-green-400">SOZ</p>
            <p class="text-lg font-bold">{{ summary?.soz ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-red-400">NOSOZ</p>
            <p class="text-lg font-bold">{{ summary?.nosoz ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-purple-400">UZCARD</p>
            <p class="text-lg font-bold">{{ summary?.uzcard ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-teal-400">HUMO</p>
            <p class="text-lg font-bold">{{ summary?.humo ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">UPTIME</p>
            <p class="text-lg font-bold">{{ formatPercent(dashboardStore.workingPercentage) }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="JAMI ATM"
          :value="summary?.total_atms ?? '—'"
          :icon="Landmark"
          iconBg="bg-purple-50"
          iconColor="text-purple-600 dark:text-purple-300"
        />
        <StatCard
          title="SOZ"
          :value="summary?.soz ?? '—'"
          :icon="Wifi"
          iconBg="bg-green-50"
          iconColor="text-green-600 dark:text-green-300"
          :progress="dashboardStore.workingPercentage"
          progressLabel="Ishlab turibdi"
        />
        <StatCard
          title="NOSOZ"
          :value="summary?.nosoz ?? '—'"
          :icon="WifiOff"
          iconBg="bg-red-50"
          iconColor="text-red-600 dark:text-red-300"
          :progress="dashboardStore.faultyPercentage"
          progressLabel="jami"
        />
        <StatCard
          title="TA'MIRLASH SARFI"
          :value="formatSumShort(maintenance?.repair_cost)"
          :icon="Wrench"
          iconBg="bg-yellow-50"
          iconColor="text-yellow-600 dark:text-yellow-300"
          :subtitle="`${maintenance?.repair_count ?? 0} ta protokol`"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DonutChartCard
          title="ALOQA DARAJASI"
          :data="{
            labels: ['Soz', 'Nosoz'],
            values: [summary?.soz ?? 0, summary?.nosoz ?? 0],
            colors: ['#10B981', '#EF4444']
          }"
          :legend="[
            { label: 'Soz', value: summary?.soz ?? 0, color: '#10B981' },
            { label: 'Nosoz', value: summary?.nosoz ?? 0, color: '#EF4444' }
          ]"
          legend-suffix=""
          :center-text="{ value: formatPercent(dashboardStore.workingPercentage), label: 'Soz ulushi' }"
        />

        <DonutChartCard
          title="KARTA TARQATISH"
          :data="cardMixData"
          :legend="cardMixLegend"
          :unavailable="!hasCardData"
          empty-message="Karta turi ma'lumoti mavjud emas"
          :center-text="{ value: (summary?.uzcard ?? 0) + (summary?.humo ?? 0), label: 'Jami ATM' }"/>

        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 lg:col-span-2 flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">Viloyatlar (soz / jami)</h3>
            <span class="text-xs text-gray-400 dark:text-slate-500"></span>
          </div>
          <div v-if="topRegions.length === 0" class="py-6">
            <EmptyState message="Viloyatlar bo'yicha ma'lumot mavjud emas" />
          </div>
          <div
            v-else
            class="space-y-3 overflow-y-auto pr-2 max-h-[240px] custom-scroll"
          >
            <div v-for="region in topRegions" :key="region.region" class="space-y-1">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-700 dark:text-slate-300 font-medium">{{ region.region }}</span>
                <span class="text-gray-500 dark:text-slate-400">
                  <span class="text-green-600 dark:text-green-400 font-semibold">{{ region.soz }}</span>
                  <span class="mx-1 text-gray-300 dark:text-slate-600">/</span>
                  <span>{{ region.total }}</span>
                  <span class="ml-2 text-xs" :class="regionUptimeColor(region)">
                    ({{ formatPercent(regionUptime(region)) }})
                  </span>
                </span>
              </div>
              <div class="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="regionUptimeBar(region)"
                  :style="{ width: `${regionUptime(region)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">ATM tarmog'i holati</h3>
          <span class="text-sm font-bold text-gray-800 dark:text-slate-100">Jami {{ summary?.total_atms ?? '—' }}</span>
        </div>
        <div class="flex items-center gap-6 flex-wrap">
          <div>
            <p class="text-3xl font-bold text-gray-800 dark:text-slate-100">{{ formatPercent(dashboardStore.workingPercentage) }}</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">Soz holatda</p>
          </div>
          <div class="flex-1 min-w-[200px]">
            <div class="flex h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800">
              <div class="bg-green-500" :style="{ width: `${dashboardStore.workingPercentage}%` }"></div>
              <div class="bg-red-500" :style="{ width: `${dashboardStore.faultyPercentage}%` }"></div>
            </div>
            <div class="flex flex-wrap gap-4 mt-3 text-xs">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <span class="text-gray-600 dark:text-slate-300">Soz {{ formatPercent(dashboardStore.workingPercentage) }}</span>
                <span class="text-gray-400 dark:text-slate-500">({{ summary?.soz ?? 0 }})</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                <span class="text-gray-600 dark:text-slate-300">Nosoz {{ formatPercent(dashboardStore.faultyPercentage) }}</span>
                <span class="text-gray-400 dark:text-slate-500">({{ summary?.nosoz ?? 0 }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import StatCard from '@/components/dashboard/StatCard.vue';
import DonutChartCard from '@/components/dashboard/DonutChartCard.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { Landmark, Wifi, WifiOff, Wrench } from 'lucide-vue-next';
import { formatPercent, formatSumShort, safePercentage } from '@/utils/format';
import { onRefresh } from '@/composables/useRefreshBus';
import type { DashboardRegionStat } from '@/types/api';

const dashboardStore = useDashboardStore();

const summary = computed(() => dashboardStore.summary);
const finance = computed(() => dashboardStore.finance);
const maintenance = computed(() => dashboardStore.maintenance);
const topRegions = computed(() => dashboardStore.topRegions);

const totalTurnover = computed(() => {
  if (!finance.value) return null;
  return finance.value.income + finance.value.expense;
});

const stabilityText = computed(() => {
  const level = dashboardStore.networkRiskLevel;
  if (level === 'YUQORI') return 'Barqaror';
  if (level === "O'RTA") return 'Nazorat talab qiladi';
  return "E'tibor talab qiladi";
});

const hasCardData = computed(() => (summary.value?.uzcard ?? 0) + (summary.value?.humo ?? 0) > 0);

const cardMixData = computed(() => {
  const uzcard = summary.value?.uzcard ?? 0;
  const humo = summary.value?.humo ?? 0;
  return {
    labels: ['UZCARD', 'HUMO'],
    values: [uzcard, humo],
    colors: ['#7C4DFF', '#00BFA5']
  };
});

const cardMixLegend = computed(() => {
  const total = (summary.value?.uzcard ?? 0) + (summary.value?.humo ?? 0);
  const asPct = (v: number) => (total ? Math.round((v / total) * 100) : 0);
  return [
    { label: 'UZCARD', value: asPct(summary.value?.uzcard ?? 0), color: '#7C4DFF' },
    { label: 'HUMO', value: asPct(summary.value?.humo ?? 0), color: '#00BFA5' }
  ];
});

function regionUptime(r: DashboardRegionStat): number {
  return safePercentage(r.soz ?? 0, r.total);
}
function regionUptimeColor(r: DashboardRegionStat): string {
  const u = regionUptime(r);
  if (u >= 80) return 'text-green-600 dark:text-green-400';
  if (u >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}
function regionUptimeBar(r: DashboardRegionStat): string {
  const u = regionUptime(r);
  if (u >= 80) return 'bg-green-500';
  if (u >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

onMounted(() => {
  dashboardStore.fetchDashboard();
});

onRefresh(() => dashboardStore.fetchDashboard());
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgb(203 213 225 / 0.6);
  border-radius: 3px;
}
:global(html.dark) .custom-scroll::-webkit-scrollbar-thumb {
  background: rgb(51 65 85 / 0.8);
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgb(148 163 184 / 0.8);
}
</style>
