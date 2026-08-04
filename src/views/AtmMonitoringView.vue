<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
      </div>
      <div class="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-1">
        <button
          class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="viewMode === 'table'
            ? 'bg-purple-600 text-white'
            : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'"
          @click="viewMode = 'table'"
        >
          Jadval
        </button>
        <button
          class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="viewMode === 'chart'
            ? 'bg-purple-600 text-white'
            : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'"
          @click="viewMode = 'chart'"
        >
          Diagramma
        </button>
      </div>
    </div>

    <template v-if="viewMode === 'table'">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="selectedTab === tab.key
              ? 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'"
            @click="selectTab(tab.key)"
          >
            {{ tab.label }}
            <span class="ml-1.5 px-2 py-0.5 rounded-full text-xs" :class="getStatusBadgeClass(tab.key)">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="TID, Seriya raqam bo'yicha qidirish..."
            class="px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            v-model="searchQuery"
          />
          <select
            class="px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100"
            v-model="selectedRegion"
            @change="applyFilters"
          >
            <option value="">Barcha viloyatlar</option>
            <option v-for="region in regionOptions" :key="region.value" :value="region.value">{{ region.label }}</option>
          </select>
          <select
            class="px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100"
            v-model="selectedCardType"
            @change="applyFilters"
          >
            <option value="">Barcha karta turlari</option>
            <option value="UZCARD">UZCARD</option>
            <option value="HUMO">HUMO</option>
          </select>
          <select
            class="px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100"
            v-model="selectedTab"
            @change="selectTab(selectedTab)"
          >
            <option value="all">Holati - barchasi</option>
            <option value="SOZ">Soz</option>
            <option value="NOSOZ">Nosoz</option>
          </select>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div v-if="atmStore.isLoading && atmStore.items.length === 0" class="p-4 space-y-3">
          <Skeleton v-for="i in 8" :key="i" height="2.5rem" />
        </div>

        <ErrorState
          v-else-if="atmStore.error && atmStore.items.length === 0"
          :message="atmStore.error"
          :on-retry="() => atmStore.fetchList()"
        />

        <template v-else>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">№</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">ATM nomi</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Viloyat</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">TID</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Merchant</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Seriya</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Model</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Karta</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider min-w-[220px]">Manzil</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Holat</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                <tr v-if="atmStore.items.length === 0">
                  <td colspan="10" class="px-4 py-10">
                    <EmptyState message="Hech qanday ATM topilmadi" />
                  </td>
                </tr>
                <tr
                  v-for="(atm, idx) in atmStore.items"
                  :key="atm.id"
                  class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="px-4 py-3 text-gray-500 dark:text-slate-400">
                    {{ (atmStore.page - 1) * atmStore.pageSize + idx + 1 }}
                  </td>
                  <td class="px-4 py-3 font-medium text-gray-800 dark:text-slate-100 max-w-[240px] truncate" :title="atm.name">
                    {{ atm.name || 'Nomsiz ATM' }}
                  </td>
                  <td class="px-4 py-3 text-gray-600 dark:text-slate-300">{{ atm.region }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-slate-300 font-mono">{{ atm.terminal_id || '—' }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-slate-300 font-mono">{{ atm.merchant_id || '—' }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-slate-300 font-mono">{{ atm.serial_number || '—' }}</td>
                  <td class="px-4 py-3 text-gray-600 dark:text-slate-300">{{ atm.model || '—' }}</td>
                  <td class="px-4 py-3">
                    <span v-if="atm.card_type" class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300">
                      {{ atm.card_type }}
                    </span>
                    <span v-else class="text-gray-400 dark:text-slate-500">—</span>
                  </td>
                  <td class="px-4 py-3 text-gray-600 dark:text-slate-300 max-w-[280px] truncate" :title="atm.address ?? ''">
                    {{ atm.address || '—' }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5" :class="STATUS_BADGE_CLASSES[statusToVariant(atm.status)]">
                      <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_DOT_CLASSES[statusToVariant(atm.status)]"></span>
                      {{ statusToLabel(atm.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-gray-500 dark:text-slate-400">
              Jami <span class="font-semibold text-gray-800 dark:text-slate-100">{{ atmStore.count }}</span> ta ATM
              <span v-if="atmStore.count > 0" class="text-gray-400 dark:text-slate-500"> - sahifa {{ atmStore.page }} / {{ atmStore.totalPages }}</span>
            </p>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 text-sm text-gray-500 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                :disabled="atmStore.page <= 1"
                @click="goToPage(atmStore.page - 1)"
              >
                Oldingi
              </button>
              <button
                v-for="p in atmStore.visiblePageNumbers"
                :key="p"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="p === atmStore.page
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'"
                @click="goToPage(p)"
              >
                {{ p }}
              </button>
              <button
                class="px-3 py-1.5 text-sm text-gray-500 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                :disabled="atmStore.page >= atmStore.totalPages"
                @click="goToPage(atmStore.page + 1)"
              >
                Keyingi
              </button>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template v-else>
      <div v-if="atmStore.isAllAtmsLoading && atmStore.allAtms.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton v-for="i in 2" :key="i" height="18rem" />
        <Skeleton height="22rem" class-name="md:col-span-2" />
      </div>
      <ErrorState
        v-else-if="atmStore.allAtmsError && atmStore.allAtms.length === 0"
        :message="atmStore.allAtmsError"
        :on-retry="() => atmStore.fetchAllAtms(true)"
      />

      <template v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 text-center">
            <p class="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">{{ chartTotals.total }}</p>
            <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Jami ATM</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 text-center">
            <p class="text-4xl font-extrabold text-green-600 dark:text-green-400 tabular-nums">{{ chartTotals.soz }}</p>
            <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Soz</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 text-center">
            <p class="text-4xl font-extrabold text-red-600 dark:text-red-400 tabular-nums">{{ chartTotals.nosoz }}</p>
            <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Nosoz</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 text-center">
            <p class="text-4xl font-extrabold text-purple-600 dark:text-purple-300 tabular-nums">{{ formatPercent(chartTotals.uptime) }}</p>
            <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">Uptime</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4 text-center">ATM soni - Top viloyatlar</h3>
            <div v-if="regionSeries.labels.length === 0" class="h-64 flex items-center justify-center">
              <EmptyState message="Viloyat ma'lumoti mavjud emas" />
            </div>
            <div v-else class="h-64">
              <HorizontalBarChart
                :labels="regionSeries.labels.slice(0, 6)"
                :data="regionSeries.total.slice(0, 6)"
                value-suffix="ta"
              />
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4 text-center">Karta turlari taqsimoti</h3>
            <div v-if="cardTypeCounts.length === 0" class="h-64 flex items-center justify-center">
              <EmptyState message="Karta turi ma'lumoti mavjud emas" />
            </div>
            <template v-else>
              <div class="flex items-center justify-center">
                <div class="w-52 h-52">
                  <DonutChart
                    :data="cardTypeDonutData"
                    :center-text="{ value: chartTotals.total, label: 'Jami ATM' }"
                  />
                </div>
              </div>
              <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                <div v-for="(item, i) in cardTypeCounts" :key="item.label" class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: CARD_COLORS[i] }"></span>
                  <span class="text-xs text-gray-600 dark:text-slate-300">{{ item.label }}</span>
                  <span class="text-xs font-semibold text-gray-800 dark:text-slate-100">{{ item.count }}</span>
                  <span class="text-xs text-gray-400 dark:text-slate-500">({{ cardTypePercent(item.count) }}%)</span>
                </div>
              </div>
            </template>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4 text-center">Viloyat kesimida (barcha)</h3>
            <div v-if="regionSeries.labels.length === 0" class="h-64 flex items-center justify-center">
              <EmptyState message="Ma'lumot mavjud emas" />
            </div>
            <div v-else class="h-64">
              <DualAxisChart :data="regionVerticalBarData" y-axis-unit="" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4 text-center">Modellar bo'yicha ATM</h3>
            <div v-if="modelSeries.labels.length === 0" class="h-64 flex items-center justify-center">
              <EmptyState message="Model ma'lumoti mavjud emas" />
            </div>
            <div v-else class="h-64">
              <DualAxisChart :data="modelChartData" y-axis-unit="" />
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4 text-center">Holati bo'yicha</h3>
            <div class="flex items-center justify-center">
              <div class="w-52 h-52">
                <DonutChart
                  :data="statusDonutData"
                  :center-text="{ value: formatPercent(chartTotals.uptime), label: 'Soz ulushi' }"
                />
              </div>
            </div>
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span class="text-xs text-gray-600 dark:text-slate-300">Soz</span>
                <span class="text-xs font-semibold text-gray-800 dark:text-slate-100">{{ chartTotals.soz }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span class="text-xs text-gray-600 dark:text-slate-300">Nosoz</span>
                <span class="text-xs font-semibold text-gray-800 dark:text-slate-100">{{ chartTotals.nosoz }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4 text-center">Top ATM modellari</h3>
            <div v-if="modelSeries.labels.length === 0" class="h-64 flex items-center justify-center">
              <EmptyState message="Model ma'lumoti mavjud emas" />
            </div>
            <div v-else class="h-64">
              <HorizontalBarChart
                :labels="modelSeries.labels.slice(0, 6)"
                :data="modelSeries.counts.slice(0, 6)"
                :colors="['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']"
                value-suffix="ta"
              />
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAtmStore } from '@/stores/atmStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import DonutChart from '@/components/charts/DonutChart.vue';
import DualAxisChart from '@/components/charts/DualAxisChart.vue';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart.vue';
import { STATUS_BADGE_CLASSES, STATUS_DOT_CLASSES, statusToLabel, statusToVariant } from '@/types';
import { formatPercent, safePercentage } from '@/utils/format';
import type { BarLineChartData, DoughnutChartData } from '@/types/api';
import { onRefresh } from '@/composables/useRefreshBus';

type StatusTab = 'all' | 'SOZ' | 'NOSOZ';
type ViewMode = 'table' | 'chart';

const atmStore = useAtmStore();
const dashboardStore = useDashboardStore();

const viewMode = ref<ViewMode>('table');
const selectedTab = ref<StatusTab>('all');
const searchQuery = ref('');
const selectedRegion = ref('');
const selectedCardType = ref('');

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

const summary = computed(() => dashboardStore.summary);

const statusTabs = computed(() => [
  { key: 'all' as StatusTab, label: 'Barchasi', count: summary.value?.total_atms ?? atmStore.count },
  { key: 'SOZ' as StatusTab, label: 'Soz', count: summary.value?.soz ?? 0 },
  { key: 'NOSOZ' as StatusTab, label: 'Nosoz', count: summary.value?.nosoz ?? 0 }
]);

const regionOptions = computed(() => {
  const fromBackend = atmStore.filterOptions?.region;
  if (fromBackend && fromBackend.length > 0) return fromBackend;

  const set = new Set<string>();
  for (const atm of atmStore.allAtms) {
    if (atm.region) set.add(atm.region);
  }
  return Array.from(set)
    .sort((a, b) => a.localeCompare(b, 'uz'))
    .map((r) => ({ value: r, label: r }));
});

function getStatusBadgeClass(key: StatusTab): string {
  const classes: Record<StatusTab, string> = {
    all: 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300',
    SOZ: 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300',
    NOSOZ: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300'
  };
  return classes[key];
}

function selectTab(key: StatusTab): void {
  selectedTab.value = key;
  atmStore.setFilters({ status: key === 'all' ? '' : key });
  atmStore.fetchList();
}

function applyFilters(): void {
  atmStore.setFilters({
    search: searchQuery.value,
    region: selectedRegion.value,
    cardType: selectedCardType.value,
    status: selectedTab.value === 'all' ? '' : selectedTab.value
  });
  atmStore.fetchList();
}

function goToPage(p: number): void {
  atmStore.setPage(p);
  atmStore.fetchList();
}

watch(searchQuery, () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    atmStore.setFilters({ search: searchQuery.value });
    atmStore.fetchList();
  }, 400);
});

const CARD_COLORS = ['#7C4DFF', '#00BFA5', '#F59E0B', '#3B82F6'];

const chartTotals = computed(() => {
  let soz = 0;
  let nosoz = 0;
  for (const atm of atmStore.allAtms) {
    if ((atm.status ?? '').toUpperCase() === 'SOZ') soz += 1;
    else nosoz += 1;
  }
  const total = atmStore.allAtms.length;
  return { total, soz, nosoz, uptime: safePercentage(soz, total) };
});

const statusDonutData = computed<DoughnutChartData>(() => ({
  labels: ['Soz', 'Nosoz'],
  datasets: [
    {
      data: [chartTotals.value.soz, chartTotals.value.nosoz],
      backgroundColor: ['#10B981', '#EF4444'],
      borderWidth: 3
    }
  ]
}));

const cardTypeCounts = computed(() => {
  const map = new Map<string, number>();
  for (const atm of atmStore.allAtms) {
    const key = atm.card_type || "Noma'lum";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
});

const cardTypeDonutData = computed<DoughnutChartData>(() => ({
  labels: cardTypeCounts.value.map((c) => c.label),
  datasets: [
    {
      data: cardTypeCounts.value.map((c) => c.count),
      backgroundColor: cardTypeCounts.value.map((_, i) => CARD_COLORS[i % CARD_COLORS.length]),
      borderWidth: 3
    }
  ]
}));

const regionSeries = computed(() => {
  const map = new Map<string, { total: number; soz: number; nosoz: number }>();
  for (const atm of atmStore.allAtms) {
    const key = atm.region || "Noma'lum";
    const entry = map.get(key) ?? { total: 0, soz: 0, nosoz: 0 };
    entry.total += 1;
    if ((atm.status ?? '').toUpperCase() === 'SOZ') entry.soz += 1;
    else entry.nosoz += 1;
    map.set(key, entry);
  }
  const rows = Array.from(map.entries())
    .map(([region, s]) => ({ region, ...s }))
    .sort((a, b) => b.total - a.total);
  return {
    labels: rows.map((r) => r.region),
    total: rows.map((r) => r.total),
    soz: rows.map((r) => r.soz),
    nosoz: rows.map((r) => r.nosoz)
  };
});

const regionVerticalBarData = computed<BarLineChartData>(() => ({
  labels: regionSeries.value.labels,
  datasets: [
    {
      type: 'bar',
      label: 'Soz',
      data: regionSeries.value.soz,
      backgroundColor: '#10B981',
      borderRadius: 4
    },
    {
      type: 'bar',
      label: 'Nosoz',
      data: regionSeries.value.nosoz,
      backgroundColor: '#EF4444',
      borderRadius: 4
    }
  ]
}));

function cardTypePercent(count: number): number {
  return chartTotals.value.total > 0 ? Math.round((count / chartTotals.value.total) * 100) : 0;
}

const modelSeries = computed(() => {
  const map = new Map<string, number>();
  for (const atm of atmStore.allAtms) {
    const key = atm.model || "Noma'lum";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const rows = Array.from(map.entries())
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count);
  return {
    labels: rows.map((r) => r.model),
    counts: rows.map((r) => r.count)
  };
});

const modelChartData = computed<BarLineChartData>(() => ({
  labels: modelSeries.value.labels,
  datasets: [
    {
      type: 'bar',
      label: 'ATM soni',
      data: modelSeries.value.counts,
      backgroundColor: modelSeries.value.labels.map((_, i) => CARD_COLORS[i % CARD_COLORS.length]),
      borderRadius: 6
    }
  ]
}));

onMounted(() => {
  atmStore.resetFilters();
  atmStore.pageSize = 20;
  atmStore.fetchFilterOptions();
  if (!dashboardStore.data) {
    dashboardStore.fetchDashboard();
  }
  atmStore.fetchList();
  atmStore.fetchAllAtms();
});

watch(viewMode, (next) => {
  if (next === 'chart' && atmStore.allAtms.length === 0) {
    atmStore.fetchAllAtms();
  }
});

onBeforeUnmount(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
    searchDebounce = null;
  }
});

onRefresh(() => {
  if (viewMode.value === 'table') {
    atmStore.fetchList();
    dashboardStore.fetchDashboard();
  } else {
    atmStore.fetchAllAtms(true);
  }
});
</script>
