<template>
  <Teleport to="body">
    <Transition name="atm-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="close">
        <div
          class="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-slate-800 flex flex-col overflow-hidden">
          <div class="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                <Landmark class="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">ATM ma'lumoti</p>
                  <span
                    v-if="detail?.technical?.status"
                    class="px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5"
                    :class="STATUS_BADGE_CLASSES[statusToVariant(detail.technical.status)]">
                    <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_DOT_CLASSES[statusToVariant(detail.technical.status)]"></span>
                    {{ statusToLabel(detail.technical.status) }}
                  </span>
                </div>
                <h2 class="text-lg font-bold text-gray-800 dark:text-slate-100 truncate" :title="detail?.general.name ?? ''">
                  {{ detail?.general.name || fallbackName || 'ATM' }}
                </h2>
                <p v-if="detail" class="text-xs text-gray-500 dark:text-slate-400 truncate">
                  {{ detail.general.region }} · {{ detail.general.address || "—" }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Yopish"
              @click="close">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <div
              v-if="atmStore.isDetailLoading && !detail"
              class="flex flex-col items-center justify-center py-16">
              <div class="relative w-12 h-12 mb-3">
                <div class="absolute inset-0 rounded-full border-4 border-purple-100 dark:border-purple-500/20"></div>
                <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 dark:border-t-purple-300 animate-spin"></div>
              </div>
              <p class="text-sm text-gray-600 dark:text-slate-300">Ma'lumot yuklanmoqda...</p>
            </div>

            <div
              v-else-if="atmStore.detailError && !detail"
              class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/15 flex items-center justify-center mb-3">
                <AlertCircle class="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p class="text-sm font-medium text-gray-800 dark:text-slate-100">Ma'lumotni olib bo'lmadi</p>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">{{ atmStore.detailError }}</p>
              <button
                type="button"
                class="mt-4 px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                @click="retry"
              >
                Qayta urinish
              </button>
            </div>

            <div v-else-if="detail" class="space-y-5">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4">
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    <Info class="w-3.5 h-3.5" />
                    Umumiy ma'lumot
                  </div>
                  <div class="space-y-2.5">
                    <InfoRow label="Viloyat" :value="detail.general.region" />
                    <InfoRow label="Manzil" :value="detail.general.address" />
                    <InfoRow label="Model" :value="detail.general.model" mono />
                    <div class="flex items-center justify-between py-1 text-sm">
                      <span class="text-gray-500 dark:text-slate-400">Karta turi</span>
                      <span
                        v-if="detail.general.card_type"
                        class="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300"
                      >
                        {{ detail.general.card_type }}
                      </span>
                      <span v-else class="text-gray-400 dark:text-slate-500">—</span>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4">
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    <Cpu class="w-3.5 h-3.5" />
                    Texnik ma'lumot
                  </div>
                  <div class="space-y-2.5">
                    <InfoRow label="TID" :value="detail.technical.terminal_id" mono />
                    <InfoRow label="Merchant ID" :value="detail.technical.merchant_id" mono />
                    <InfoRow label="Seriya raqami" :value="detail.technical.serial_number" mono />
                    <InfoRow label="Inventar №" :value="detail.technical.inventory_number" mono />
                  </div>
                </div>

                <div v-if="detail.service_contract" class="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-4">
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    <FileText class="w-3.5 h-3.5" />
                    Servis shartnoma
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p class="text-xs text-gray-500 dark:text-slate-400">Btech oylik</p>
                      <p class="text-sm font-bold text-gray-800 dark:text-slate-100 tabular-nums">
                        {{ formatMoney(detail.service_contract.btech_monthly_fee) }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-slate-400">Glob oylik</p>
                      <p class="text-sm font-bold text-gray-800 dark:text-slate-100 tabular-nums">
                        {{ formatMoney(detail.service_contract.glob_monthly_fee) }}
                      </p>
                    </div>
                  </div>
                  <div v-if="detail.service_contract.payments.length > 0" class="pt-3 border-t border-gray-200 dark:border-slate-700">
                    <p class="text-xs text-gray-500 dark:text-slate-400 mb-2">So'nggi to'lovlar</p>
                    <div class="space-y-1.5 max-h-32 overflow-y-auto">
                      <div
                        v-for="(p, i) in detail.service_contract.payments"
                        :key="i"
                        class="flex items-center justify-between text-xs"
                      >
                        <span class="text-gray-600 dark:text-slate-300">
                          {{ monthLabel(p.year, p.month) }} · {{ p.payment_type }}
                        </span>
                        <span class="font-semibold text-gray-800 dark:text-slate-100 tabular-nums">
                          {{ formatMoney(p.amount) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="monthlyStats.length > 0" class="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-5">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">Oylik moliya dinamikasi</h3>
                    <p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Kirim, chiqim va ta'mirlash sarfi ({{ monthlyRange }})</p>
                  </div>
                </div>
                <div class="h-64">
                  <DualAxisChart :data="monthlyChartData" y-axis-unit="ming so'm" />
                </div>
              </div>

              <div v-if="yearlyStats.length > 0">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Yillik statistika</h3>
                <div class="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
                        <tr>
                          <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Yil</th>
                          <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Karta</th>
                          <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Kirim</th>
                          <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Chiqim</th>
                          <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Ta'mirlash</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                        <tr v-for="y in yearlyStats" :key="`${y.year}-${y.card_type}`" class="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td class="px-4 py-2.5 font-semibold text-gray-800 dark:text-slate-100 tabular-nums">{{ y.year }}</td>
                          <td class="px-4 py-2.5">
                            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300">
                              {{ y.card_type }}
                            </span>
                          </td>
                          <td class="px-4 py-2.5 text-right text-green-600 dark:text-green-400 font-mono">{{ formatMoney(y.income) }}</td>
                          <td class="px-4 py-2.5 text-right text-red-600 dark:text-red-400 font-mono">{{ formatMoney(y.expense) }}</td>
                          <td class="px-4 py-2.5 text-right text-yellow-600 dark:text-yellow-400 font-mono">{{ formatMoney(y.repair_cost) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div v-if="monthlyStats.length > 0">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
                  Oylik statistika
                  <span class="text-xs text-gray-400 dark:text-slate-500 font-normal ml-1"></span>
                </h3>
                <div class="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                  <div class="overflow-x-auto max-h-80 overflow-y-auto">
                    <table class="w-full text-sm">
                      <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 sticky top-0">
                        <tr>
                          <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Oy</th>
                          <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Kirim</th>
                          <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Chiqim</th>
                          <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Ta'mirlash</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                        <tr v-for="m in monthlyStats" :key="`${m.year}-${m.month}`" class="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td class="px-4 py-2 font-medium text-gray-800 dark:text-slate-100">{{ monthLabel(m.year, m.month) }}</td>
                          <td class="px-4 py-2 text-right text-green-600 dark:text-green-400 font-mono">{{ formatMoney(m.income) }}</td>
                          <td class="px-4 py-2 text-right text-red-600 dark:text-red-400 font-mono">{{ formatMoney(m.expense) }}</td>
                          <td class="px-4 py-2 text-right text-yellow-600 dark:text-yellow-400 font-mono">{{ formatMoney(m.repair_cost) }}</td>
                        </tr>
                      </tbody>
                    </table>
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
import { computed, h, onBeforeUnmount, watch } from 'vue';
import { Landmark, X, AlertCircle, Info, Cpu, FileText } from 'lucide-vue-next';
import { useAtmStore } from '@/stores/atmStore';
import { STATUS_BADGE_CLASSES, STATUS_DOT_CLASSES, statusToLabel, statusToVariant } from '@/types';
import { formatSumShort } from '@/utils/format';
import { monthKeyToLabel } from '@/utils/chartMappers';
import DualAxisChart from '@/components/charts/DualAxisChart.vue';
import type { BarLineChartData } from '@/types/api';

const props = defineProps<{
  open: boolean;
  atmId: number | null;
  fallbackName?: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const atmStore = useAtmStore();

const detail = computed(() => {
  if (props.atmId == null) return null;
  return atmStore.detailCache.get(props.atmId) ?? null;
});

const monthlyStats = computed(() => {
  const stats = detail.value?.monthly_statistics ?? [];
  return [...stats].sort((a, b) => a.year - b.year || a.month - b.month);
});

const yearlyStats = computed(() => detail.value?.yearly_statistics ?? []);

function monthLabel(year: number, month: number): string {
  return monthKeyToLabel(`${year}-${String(month).padStart(2, '0')}`);
}

const THOUSAND = 1_000;

function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return '—';
  return formatSumShort(value);
}

const monthlyChartData = computed<BarLineChartData>(() => ({
  labels: monthlyStats.value.map((m) => monthLabel(m.year, m.month)),
  datasets: [
    {
      type: 'bar',
      label: 'Kirim',
      data: monthlyStats.value.map((m) => +(m.income / THOUSAND).toFixed(2)),
      backgroundColor: 'rgba(16, 185, 129, 0.75)',
      borderRadius: 4
    },
    {
      type: 'bar',
      label: 'Chiqim',
      data: monthlyStats.value.map((m) => +(m.expense / THOUSAND).toFixed(2)),
      backgroundColor: 'rgba(239, 68, 68, 0.75)',
      borderRadius: 4
    },
    {
      type: 'line',
      label: "Ta'mirlash",
      data: monthlyStats.value.map((m) => +(m.repair_cost / THOUSAND).toFixed(2)),
      borderColor: '#F59E0B',
      backgroundColor: 'transparent',
      pointBackgroundColor: '#F59E0B',
      pointRadius: 3,
      pointHoverRadius: 5,
      tension: 0.35,
      fill: false,
      borderWidth: 2
    }
  ]
}));

const monthlyRange = computed(() => {
  if (monthlyStats.value.length === 0) return '';
  const first = monthlyStats.value[0];
  const last = monthlyStats.value[monthlyStats.value.length - 1];
  return `${monthLabel(first.year, first.month)} — ${monthLabel(last.year, last.month)}`;
});

const InfoRow = (props: { label: string; value: string | number | null | undefined; mono?: boolean }) => {
  return h('div', { class: 'flex items-center justify-between py-1 text-sm gap-3' }, [
    h('span', { class: 'text-gray-500 dark:text-slate-400 flex-shrink-0' }, props.label),
    h(
      'span',
      {
        class: [
          'text-gray-800 dark:text-slate-100 font-medium text-right truncate',
          props.mono ? 'font-mono' : ''
        ].join(' '),
        title: props.value != null ? String(props.value) : ''
      },
      props.value !== null && props.value !== undefined && props.value !== '' ? String(props.value) : '—'
    )
  ]);
};

function close(): void {
  emit('update:open', false);
}

function retry(): void {
  if (props.atmId == null) return;
  atmStore.fetchAtmDetail(props.atmId, true);
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
      if (props.atmId != null && !atmStore.detailCache.has(props.atmId)) {
        atmStore.fetchAtmDetail(props.atmId);
      }
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
.atm-modal-enter-active,
.atm-modal-leave-active {
  transition: opacity 0.18s ease;
}
.atm-modal-enter-active > div,
.atm-modal-leave-active > div {
  transition: transform 0.22s ease, opacity 0.18s ease;
}
.atm-modal-enter-from,
.atm-modal-leave-to {
  opacity: 0;
}
.atm-modal-enter-from > div,
.atm-modal-leave-to > div {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>
