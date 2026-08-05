<template>
  <Teleport to="body">
    <Transition name="region-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="close"
      >
        <div
          class="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-slate-800 flex flex-col overflow-hidden"
        >
          <div class="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                <MapPin class="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div class="min-w-0">
                <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Viloyat</p>
                <h2 class="text-lg font-bold text-gray-800 dark:text-slate-100 truncate" :title="region ?? ''">
                  {{ region || '—' }}
                </h2>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Yopish"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                <p class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">{{ stats.total }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Jami ATM</p>
              </div>
              <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                <p class="text-2xl font-extrabold text-green-600 dark:text-green-400 tabular-nums">{{ stats.soz }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Soz</p>
              </div>
              <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                <p class="text-2xl font-extrabold text-red-600 dark:text-red-400 tabular-nums">{{ stats.nosoz }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Nosoz</p>
              </div>
              <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                <p class="text-2xl font-extrabold text-purple-600 dark:text-purple-300 tabular-nums">{{ formatPercent(stats.uptime) }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Soz ulushi</p>
              </div>
              <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                <p class="text-2xl font-extrabold text-indigo-600 dark:text-indigo-300 tabular-nums">{{ stats.uzcard }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">UZCARD</p>
              </div>
              <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4 text-center">
                <p class="text-2xl font-extrabold text-teal-600 dark:text-teal-300 tabular-nums">{{ stats.humo }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">HUMO</p>
              </div>
            </div>

            <div v-if="hasFinance" class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="bg-green-50 dark:bg-green-500/10 rounded-xl p-4">
                <div class="flex items-center gap-2 text-xs text-green-700 dark:text-green-300 uppercase tracking-wider">
                  <ArrowUp class="w-3.5 h-3.5" />
                  Kirim
                </div>
                <p class="text-xl font-bold text-green-700 dark:text-green-300 mt-1 tabular-nums">{{ formatSumShort(finance?.income) }}</p>
              </div>
              <div class="bg-red-50 dark:bg-red-500/10 rounded-xl p-4">
                <div class="flex items-center gap-2 text-xs text-red-700 dark:text-red-300 uppercase tracking-wider">
                  <ArrowDown class="w-3.5 h-3.5" />
                  Chiqim
                </div>
                <p class="text-xl font-bold text-red-700 dark:text-red-300 mt-1 tabular-nums">{{ formatSumShort(finance?.expense) }}</p>
              </div>
              <div
                class="rounded-xl p-4"
                :class="(finance?.profit ?? 0) >= 0 ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10'"
              >
                <div
                  class="flex items-center gap-2 text-xs uppercase tracking-wider"
                  :class="(finance?.profit ?? 0) >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'"
                >
                  <TrendingUp v-if="(finance?.profit ?? 0) >= 0" class="w-3.5 h-3.5" />
                  <TrendingDown v-else class="w-3.5 h-3.5" />
                  Foyda / zarar
                </div>
                <p
                  class="text-xl font-bold mt-1 tabular-nums"
                  :class="(finance?.profit ?? 0) >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'"
                >
                  {{ formatSumShort(finance?.profit) }}
                </p>
              </div>
            </div>

            <div v-if="regionModels.length > 0">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
                Bu viloyatdagi modellar
                <span class="text-xs text-gray-400 dark:text-slate-500 font-normal ml-1">({{ regionModels.length }} xil)</span>
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="m in regionModels"
                  :key="m.model"
                  class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate max-w-[160px]" :title="m.model">{{ m.model }}</p>
                    <span class="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/15 px-2 py-0.5 rounded-full">{{ m.total }} ta</span>
                  </div>
                  <div class="flex items-center gap-3 text-xs">
                    <span class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-green-500"></span>
                      <span class="text-gray-500 dark:text-slate-400">Soz</span>
                      <span class="text-green-600 dark:text-green-400 font-semibold">{{ m.soz }}</span>
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-red-500"></span>
                      <span class="text-gray-500 dark:text-slate-400">Nosoz</span>
                      <span class="text-red-600 dark:text-red-400 font-semibold">{{ m.nosoz }}</span>
                    </span>
                  </div>
                  <div class="mt-2 w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500" :style="{ width: `${safePercentage(m.soz, m.total)}%` }"></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">
                  Viloyatdagi ATM'lar
                  <span class="text-xs text-gray-400 dark:text-slate-500 font-normal ml-1">({{ regionAtms.length }} ta)</span>
                </h3>
              </div>

              <div class="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">№</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">ATM nomi</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">TID</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Merchant</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Seriya</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Model</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Karta</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Holat</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                      <tr v-if="regionAtms.length === 0">
                        <td colspan="8" class="px-4 py-10 text-center text-sm text-gray-500 dark:text-slate-400">
                          Bu viloyatda ATM topilmadi
                        </td>
                      </tr>
                      <tr
                        v-for="(atm, idx) in regionAtms"
                        :key="atm.id"
                        class="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td class="px-4 py-2.5 text-gray-500 dark:text-slate-400">{{ idx + 1 }}</td>
                        <td class="px-4 py-2.5 font-medium text-gray-800 dark:text-slate-100 max-w-[240px] truncate" :title="atm.name">
                          {{ atm.name || 'Nomsiz ATM' }}
                        </td>
                        <td class="px-4 py-2.5 text-gray-600 dark:text-slate-300 font-mono">{{ atm.terminal_id || '—' }}</td>
                        <td class="px-4 py-2.5 text-gray-600 dark:text-slate-300 font-mono">{{ atm.merchant_id || '—' }}</td>
                        <td class="px-4 py-2.5 text-gray-600 dark:text-slate-300 font-mono">{{ atm.serial_number || '—' }}</td>
                        <td class="px-4 py-2.5 text-gray-600 dark:text-slate-300">{{ atm.model || '—' }}</td>
                        <td class="px-4 py-2.5">
                          <span v-if="atm.card_type" class="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300">
                            {{ atm.card_type }}
                          </span>
                          <span v-else class="text-gray-400 dark:text-slate-500">—</span>
                        </td>
                        <td class="px-4 py-2.5">
                          <span class="px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5" :class="STATUS_BADGE_CLASSES[statusToVariant(atm.status)]">
                            <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_DOT_CLASSES[statusToVariant(atm.status)]"></span>
                            {{ statusToLabel(atm.status) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div v-if="regionMaintenance.length > 0">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
                Bu viloyatdagi so'nggi ta'mirlashlar
                <span class="text-xs text-gray-400 dark:text-slate-500 font-normal ml-1">({{ regionMaintenance.length }} ta)</span>
              </h3>
              <div class="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Sana</th>
                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Ehtiyot qism</th>
                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">TID</th>
                        <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Summa</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                      <tr v-for="item in regionMaintenance" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td class="px-4 py-2.5 text-gray-500 dark:text-slate-400 font-mono">{{ item.protocol_date }}</td>
                        <td class="px-4 py-2.5 text-gray-700 dark:text-slate-200 max-w-[320px] truncate" :title="item.part_name">
                          {{ item.part_name }}
                        </td>
                        <td class="px-4 py-2.5 text-gray-600 dark:text-slate-300 font-mono">{{ item.atm?.terminal_id || '—' }}</td>
                        <td class="px-4 py-2.5 text-right text-purple-700 dark:text-purple-300 font-semibold font-mono">{{ formatSumShort(item.total_amount) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div v-if="yearlyStats.length > 0 || monthlyChart.length > 0 || repairTrend.length > 0" class="pt-2 border-t border-gray-100 dark:border-slate-800">
              <div class="flex items-center gap-2 mb-4">
                <BarChart3 class="w-4 h-4 text-gray-400 dark:text-slate-500" />
                <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">Umumiy tarmoq statistikasi</h3>
                <span class="text-xs text-gray-400 dark:text-slate-500">— butun tarmoq bo'yicha</span>
              </div>

              <div v-if="yearlyStats.length > 0" class="mb-5">
                <p class="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Yillik moliyaviy xulosa</p>
                <div class="grid grid-cols-1 gap-3" :class="yearlyStats.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'">
                  <div
                    v-for="y in yearlyStats"
                    :key="y.year"
                    class="rounded-xl border border-gray-100 dark:border-slate-800 p-4"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <div class="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center">
                          <Calendar class="w-4 h-4 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <p class="text-lg font-bold text-gray-800 dark:text-slate-100 tabular-nums">{{ y.year }}</p>
                          <p class="text-xs text-gray-500 dark:text-slate-400">{{ y.monthCount }} oy</p>
                        </div>
                      </div>
                      <span
                        class="px-2 py-0.5 text-xs font-semibold rounded-full"
                        :class="y.profit >= 0
                          ? 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-300'
                          : 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300'"
                      >
                        {{ y.profit >= 0 ? 'Foyda' : 'Zarar' }}
                      </span>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-slate-400">Kirim</p>
                        <p class="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5 tabular-nums">{{ formatSumShort(y.income) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-slate-400">Chiqim</p>
                        <p class="text-sm font-bold text-red-600 dark:text-red-400 mt-0.5 tabular-nums">{{ formatSumShort(y.expense) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-slate-400">Foyda</p>
                        <p
                          class="text-sm font-bold mt-0.5 tabular-nums"
                          :class="y.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                        >
                          {{ formatSumShort(y.profit) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="monthlyChart.length > 0" class="mb-5">
                <p class="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Oylik pul oqimi dinamikasi
                  <span class="ml-2 normal-case text-gray-400 dark:text-slate-500">{{ monthlyRange }}</span>
                </p>
                <div class="rounded-xl border border-gray-100 dark:border-slate-800 p-4">
                  <div class="h-64">
                    <DualAxisChart :data="monthlyChartData" y-axis-unit="mln" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div v-if="repairTrend.length > 0">
                  <p class="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ta'mirlash sarflari trendi</p>
                  <div class="rounded-xl border border-gray-100 dark:border-slate-800 p-4">
                    <div class="h-56">
                      <DualAxisChart :data="repairTrendChartData" y-axis-unit="mln" />
                    </div>
                  </div>
                </div>

                <div v-if="topModels.length > 0">
                  <p class="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Butun tarmoq bo'yicha top modellar</p>
                  <div class="rounded-xl border border-gray-100 dark:border-slate-800 p-4">
                    <div class="h-56">
                      <HorizontalBarChart
                        :labels="topModels.map(m => m.model)"
                        :data="topModels.map(m => m.total)"
                        :colors="['#7C4DFF', '#00BFA5', '#F59E0B', '#3B82F6', '#EC4899']"
                        value-suffix="ta"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { MapPin, X, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-vue-next';
import { useAtmStore } from '@/stores/atmStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import { STATUS_BADGE_CLASSES, STATUS_DOT_CLASSES, statusToLabel, statusToVariant } from '@/types';
import { formatPercent, formatSumShort, safePercentage } from '@/utils/format';
import { monthKeyToLabel } from '@/utils/chartMappers';
import DualAxisChart from '@/components/charts/DualAxisChart.vue';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart.vue';
import type { BarLineChartData } from '@/types/api';

const props = defineProps<{
  open: boolean;
  region: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const atmStore = useAtmStore();
const dashboardStore = useDashboardStore();

const MLN = 1_000_000;

const regionAtms = computed(() => {
  if (!props.region) return [];
  return atmStore.allAtms.filter((a) => a.region === props.region);
});

const stats = computed(() => {
  const list = regionAtms.value;
  let soz = 0;
  let nosoz = 0;
  let uzcard = 0;
  let humo = 0;
  for (const a of list) {
    if ((a.status ?? '').toUpperCase() === 'SOZ') soz += 1;
    else nosoz += 1;
    const card = (a.card_type ?? '').toUpperCase();
    if (card === 'UZCARD') uzcard += 1;
    else if (card === 'HUMO') humo += 1;
  }
  const fromTopRegions = dashboardStore.topRegions.find((r) => r.region === props.region);
  const total = fromTopRegions?.total ?? list.length;
  return {
    total,
    soz: fromTopRegions?.soz ?? soz,
    nosoz: fromTopRegions?.nosoz ?? nosoz,
    uzcard: fromTopRegions?.uzcard ?? uzcard,
    humo: fromTopRegions?.humo ?? humo,
    uptime: safePercentage(fromTopRegions?.soz ?? soz, total)
  };
});

const regionModels = computed(() => {
  const map = new Map<string, { total: number; soz: number; nosoz: number }>();
  for (const a of regionAtms.value) {
    const key = a.model || "Noma'lum";
    const entry = map.get(key) ?? { total: 0, soz: 0, nosoz: 0 };
    entry.total += 1;
    if ((a.status ?? '').toUpperCase() === 'SOZ') entry.soz += 1;
    else entry.nosoz += 1;
    map.set(key, entry);
  }
  return Array.from(map.entries())
    .map(([model, s]) => ({ model, ...s }))
    .sort((a, b) => b.total - a.total);
});

const finance = computed(() => {
  if (!props.region) return null;
  return dashboardStore.regionFinance.find((f) => f.region === props.region) ?? null;
});

const hasFinance = computed(() => finance.value !== null);

const regionMaintenance = computed(() => {
  if (!props.region || !dashboardStore.data) return [];
  const recent = dashboardStore.data.recent_maintenance ?? [];
  return recent.filter((m) => m.atm?.region === props.region);
});

const monthlyChart = computed(() => dashboardStore.monthlyChart);
const topModels = computed(() => dashboardStore.topModels);
const repairTrend = computed(() => dashboardStore.repairTrend);

function monthLabel(year: number, month: number): string {
  return monthKeyToLabel(`${year}-${String(month).padStart(2, '0')}`);
}

const monthlyChartData = computed<BarLineChartData>(() => ({
  labels: monthlyChart.value.map((m) => monthLabel(m.year, m.month)),
  datasets: [
    {
      type: 'bar',
      label: 'Kirim',
      data: monthlyChart.value.map((m) => +(m.income / MLN).toFixed(2)),
      backgroundColor: 'rgba(16, 185, 129, 0.75)',
      borderRadius: 4
    },
    {
      type: 'bar',
      label: 'Chiqim',
      data: monthlyChart.value.map((m) => +(m.expense / MLN).toFixed(2)),
      backgroundColor: 'rgba(239, 68, 68, 0.75)',
      borderRadius: 4
    },
    {
      type: 'line',
      label: 'Foyda',
      data: monthlyChart.value.map((m) => +(m.profit / MLN).toFixed(2)),
      borderColor: '#8B5CF6',
      backgroundColor: 'transparent',
      pointBackgroundColor: '#8B5CF6',
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.35,
      fill: false,
      borderWidth: 2
    }
  ]
}));

const monthlyRange = computed(() => {
  if (monthlyChart.value.length === 0) return '';
  const first = monthlyChart.value[0];
  const last = monthlyChart.value[monthlyChart.value.length - 1];
  return `${monthLabel(first.year, first.month)} — ${monthLabel(last.year, last.month)}`;
});

const yearlyStats = computed(() => {
  const map = new Map<number, { income: number; expense: number; profit: number; months: Set<number> }>();
  for (const m of monthlyChart.value) {
    const entry = map.get(m.year) ?? { income: 0, expense: 0, profit: 0, months: new Set<number>() };
    entry.income += m.income;
    entry.expense += m.expense;
    entry.profit += m.profit;
    entry.months.add(m.month);
    map.set(m.year, entry);
  }
  return Array.from(map.entries())
    .map(([year, s]) => ({ year, income: s.income, expense: s.expense, profit: s.profit, monthCount: s.months.size }))
    .sort((a, b) => a.year - b.year);
});

const repairTrendChartData = computed<BarLineChartData>(() => ({
  labels: repairTrend.value.map((r) => monthLabel(r.year, r.month)),
  datasets: [
    {
      type: 'bar',
      label: 'Xarajat',
      data: repairTrend.value.map((r) => +(r.repair_cost / MLN).toFixed(2)),
      backgroundColor: 'rgba(245, 158, 11, 0.75)',
      borderRadius: 4
    },
    {
      type: 'line',
      label: 'Protokollar soni',
      data: repairTrend.value.map((r) => r.repair_count),
      borderColor: '#7C4DFF',
      backgroundColor: 'transparent',
      pointBackgroundColor: '#7C4DFF',
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.35,
      fill: false,
      borderWidth: 2
    }
  ]
}));

function close(): void {
  emit('update:open', false);
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) {
    event.preventDefault();
    close();
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeydown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeydown);
    }
  }
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.region-modal-enter-active,
.region-modal-leave-active {
  transition: opacity 0.18s ease;
}
.region-modal-enter-active > div,
.region-modal-leave-active > div {
  transition: transform 0.22s ease, opacity 0.18s ease;
}
.region-modal-enter-from,
.region-modal-leave-to {
  opacity: 0;
}
.region-modal-enter-from > div,
.region-modal-leave-to > div {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>
