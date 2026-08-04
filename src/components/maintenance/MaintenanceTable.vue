<template>
  <div>
    <div v-if="showFilters" class="p-4 border-b border-gray-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
      <input
        type="text"
        placeholder="Ehtiyot qism, filial yoki seriya bo'yicha qidirish..."
        class="px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        v-model="searchQuery"
      />
      <AppSelect
        v-model="filialFilter"
        :options="filialSelectOptions"
        placeholder="Barcha filiallar"
        searchable
        search-placeholder="Filial nomi bo'yicha qidiring..."
      />
      <AppSelect
        v-model="moduleFilter"
        :options="moduleSelectOptions"
        placeholder="Barcha modullar"
        searchable
        search-placeholder="Modul nomi bo'yicha qidiring..."
      />
    </div>

    <div v-if="isLoading && items.length === 0" class="p-4 space-y-3">
      <Skeleton v-for="i in 6" :key="i" height="2.75rem" />
    </div>

    <ErrorState
      v-else-if="error"
      :message="error"
      :on-retry="onRetry"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
          <tr>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-12">№</th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Modul jihozi</th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Seriya raqami</th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider min-w-[240px]">Ehtiyot qism nomi</th>
            <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Miqdor</th>
            <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Narxi (so'm)</th>
            <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Summa (so'm)</th>
            <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">NDS summasi</th>
            <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">NDS bilan summa</th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Filial nomi</th>
            <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">MFO bank</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
          <tr v-if="filteredItems.length === 0">
            <td colspan="11" class="px-4 py-10">
              <EmptyState message="Hech qanday ta'mirlash protokoli topilmadi" />
            </td>
          </tr>
          <tr
            v-for="item in filteredItems"
            :key="item.id"
            class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <td class="px-3 py-3 text-gray-500 dark:text-slate-400">{{ item.row_number }}</td>
            <td class="px-3 py-3 text-gray-800 dark:text-slate-100 font-medium">{{ item.equipment_module }}</td>
            <td class="px-3 py-3 text-gray-600 dark:text-slate-300 font-mono">{{ item.serial_number }}</td>
            <td class="px-3 py-3 text-gray-700 dark:text-slate-200 max-w-[360px]">
              <span class="line-clamp-2" :title="item.part_name">{{ item.part_name }}</span>
            </td>
            <td class="px-3 py-3 text-right text-gray-600 dark:text-slate-300 font-mono">{{ formatQuantity(item.quantity) }}</td>
            <td class="px-3 py-3 text-right text-gray-600 dark:text-slate-300 font-mono">{{ formatMoney(item.price_per_unit) }}</td>
            <td class="px-3 py-3 text-right text-gray-800 dark:text-slate-100 font-semibold font-mono">{{ formatMoney(item.total_amount) }}</td>
            <td class="px-3 py-3 text-right text-gray-500 dark:text-slate-400 font-mono">{{ formatMoney(item.vat_amount) }}</td>
            <td class="px-3 py-3 text-right text-purple-700 dark:text-purple-300 font-semibold font-mono">{{ formatMoney(item.total_with_vat) }}</td>
            <td class="px-3 py-3 text-gray-600 dark:text-slate-300 max-w-[220px] truncate" :title="item.filial_name">{{ item.filial_name }}</td>
            <td class="px-3 py-3 text-gray-600 dark:text-slate-300 font-mono">{{ item.mfo_bank }}</td>
          </tr>
        </tbody>
        <tfoot v-if="filteredItems.length > 0" class="bg-gray-50 dark:bg-slate-800/60 border-t border-gray-200 dark:border-slate-800">
          <tr>
            <td colspan="6" class="px-3 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Jami:</td>
            <td class="px-3 py-3 text-right text-sm text-gray-800 dark:text-slate-100 font-bold font-mono">{{ formatMoney(totals.total_amount) }}</td>
            <td class="px-3 py-3 text-right text-sm text-gray-500 dark:text-slate-400 font-mono">{{ formatMoney(totals.vat_amount) }}</td>
            <td class="px-3 py-3 text-right text-sm text-purple-700 dark:text-purple-300 font-bold font-mono">{{ formatMoney(totals.total_with_vat) }}</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="!isLoading && filteredItems.length > 0" class="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
      <p class="text-sm text-gray-500 dark:text-slate-400">
        <span class="font-semibold text-gray-800 dark:text-slate-100">{{ filteredItems.length }}</span>
        / {{ items.length }}
      </p>
    </div>
  </div>
</template>



<script setup lang="ts">
import { computed, ref } from 'vue';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import AppSelect from '@/components/common/AppSelect.vue';
import type { MaintenanceListItem } from '@/types/api';
import { toNumber } from '@/utils/format';

interface Props {
  items: MaintenanceListItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  showFilters?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  onRetry: undefined,
  showFilters: true
});

const searchQuery = ref('');
const filialFilter = ref('');
const moduleFilter = ref('');

const filialOptions = computed(() => {
  const set = new Set(props.items.map((i) => i.filial_name).filter(Boolean));
  return Array.from(set).sort();
});

const moduleOptions = computed(() => {
  const set = new Set(props.items.map((i) => i.equipment_module).filter(Boolean));
  return Array.from(set).sort();
});

const filialSelectOptions = computed(() => [
  { value: '', label: 'Barcha filiallar' },
  ...filialOptions.value.map((f) => ({ value: f, label: f }))
]);

const moduleSelectOptions = computed(() => [
  { value: '', label: 'Barcha modullar' },
  ...moduleOptions.value.map((m) => ({ value: m, label: m }))
]);

const filteredItems = computed(() => {
  let result = props.items;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    result = result.filter((i) =>
      (i.part_name ?? '').toLowerCase().includes(q) ||
      (i.filial_name ?? '').toLowerCase().includes(q) ||
      (i.serial_number ?? '').toLowerCase().includes(q) ||
      (i.equipment_module ?? '').toLowerCase().includes(q)
    );
  }
  if (filialFilter.value) {
    result = result.filter((i) => i.filial_name === filialFilter.value);
  }
  if (moduleFilter.value) {
    result = result.filter((i) => i.equipment_module === moduleFilter.value);
  }
  return result;
});

const totals = computed(() => {
  let total_amount = 0;
  let vat_amount = 0;
  let total_with_vat = 0;
  for (const item of filteredItems.value) {
    total_amount += toNumber(item.total_amount);
    vat_amount += toNumber(item.vat_amount);
    total_with_vat += toNumber(item.total_with_vat ?? item.total_amount);
  }
  return { total_amount, vat_amount, total_with_vat };
});

function formatQuantity(value: string | number | null | undefined): string {
  const n = toNumber(value);
  return Number.isInteger(n) ? String(n) : n.toString();
}

function formatMoney(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const n = toNumber(value);
  return Math.round(n).toLocaleString('uz-UZ').replace(/,/g, ' ');
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
