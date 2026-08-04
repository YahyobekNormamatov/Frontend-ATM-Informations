<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-1 flex-wrap">
          <h3 class="font-semibold text-gray-800 dark:text-slate-100 text-sm">{{ atm.name || "Nomsiz ATM" }}</h3>
          <span class="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded">{{ atm.region }}</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1" :class="statusClasses">
            <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass"></span>
            {{ statusLabel }}
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-slate-400">{{ atm.address }}</p>
        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400 flex-wrap">
          <span>TID: {{ atm.terminal_id }}</span>
          <span>{{ atm.model }}</span>
          <span class="text-gray-400 dark:text-slate-600">|</span>
          <span>{{ atm.card_type }}</span>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs text-gray-500 dark:text-slate-400">MERCHANT ID</p>
        <p class="text-sm font-bold text-gray-800 dark:text-slate-100">{{ atm.merchant_id }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 text-sm mb-4">
      <div>
        <p class="text-xs text-gray-500 dark:text-slate-400">SERIYA RAQAM</p>
        <p class="text-gray-700 dark:text-slate-200 text-sm font-mono">{{ atm.serial_number }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 dark:text-slate-400">KARTA TURI</p>
        <p class="text-gray-700 dark:text-slate-200 text-sm font-semibold">{{ atm.card_type }}</p>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500 dark:text-slate-400 font-medium">OYLIK STATISTIKA</p>
        <button
          class="text-xs text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 font-medium flex items-center gap-1"
          @click="toggleDetail"
        >
          {{ isExpanded ? 'Yopish' : 'Batafsil' }}
          <ChevronDown :size="12" :class="{ 'rotate-180': isExpanded }" class="transition-transform" />
        </button>
      </div>

      <div v-if="!isExpanded" class="text-xs text-gray-400 dark:text-slate-500 py-2">
        Oylik kirim/chiqim va ta'mirlash statistikasini ko'rish uchun "Batafsil" tugmasini bosing.
      </div>

      <div v-else>
        <div v-if="isDetailLoading" class="space-y-2">
          <Skeleton v-for="i in 3" :key="i" height="1.5rem" />
        </div>
        <ErrorState
          v-else-if="detailError"
          :message="detailError"
          :on-retry="() => loadDetail(true)"
        />
        <div v-else-if="monthlyStats.length === 0" class="py-4">
          <EmptyState message="Oylik statistika mavjud emas" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-gray-500 dark:text-slate-400">
                <th class="text-left py-1 pr-2 font-medium">Oy</th>
                <th class="text-right py-1 px-2 font-medium">Kirim</th>
                <th class="text-right py-1 px-2 font-medium">Chiqim</th>
                <th class="text-right py-1 pl-2 font-medium">Ta'mirlash</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-slate-800">
              <tr v-for="stat in monthlyStats" :key="`${stat.year}-${stat.month}`">
                <td class="py-1 pr-2 text-gray-700 dark:text-slate-300">{{ stat.month }}/{{ stat.year }}</td>
                <td class="py-1 px-2 text-right text-green-600 dark:text-green-400">{{ formatSumShort(stat.income) }}</td>
                <td class="py-1 px-2 text-right text-red-600 dark:text-red-400">{{ formatSumShort(stat.expense) }}</td>
                <td class="py-1 pl-2 text-right text-gray-500 dark:text-slate-400">{{ formatSumShort(stat.repair_cost) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import type { AtmListItem } from '@/types/api';
import { useAtmStore } from '@/stores/atmStore';
import { STATUS_BADGE_CLASSES, STATUS_DOT_CLASSES, statusToLabel, statusToVariant } from '@/types';
import { formatSumShort } from '@/utils/format';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const props = defineProps<{
  atm: AtmListItem;
}>();

const atmStore = useAtmStore();
const isExpanded = ref(false);

const statusClasses = computed(() => STATUS_BADGE_CLASSES[statusToVariant(props.atm.status)]);
const statusDotClass = computed(() => STATUS_DOT_CLASSES[statusToVariant(props.atm.status)]);
const statusLabel = computed(() => statusToLabel(props.atm.status));

const isDetailLoading = computed(() => atmStore.isDetailLoading);
const detailError = computed(() => atmStore.detailError);
const monthlyStats = computed(() => atmStore.detailCache.get(props.atm.id)?.monthly_statistics ?? []);

async function loadDetail(force = false): Promise<void> {
  await atmStore.fetchAtmDetail(props.atm.id, force);
}

function toggleDetail(): void {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value && monthlyStats.value.length === 0) {
    loadDetail();
  }
}
</script>
