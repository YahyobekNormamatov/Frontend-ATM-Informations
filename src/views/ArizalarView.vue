<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-slate-100">Ta'mirlash protokollari</h1>
        <p class="text-sm text-gray-500 dark:text-slate-400">Ehtiyot qismlar va texnik xizmat bo'yicha barcha protokollar</p>
      </div>
      <button
        class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
        :disabled="store.isAllLoading"
        @click="store.fetchAll(true)"
      >
        <RefreshCw :size="16" :class="{ 'animate-spin': store.isAllLoading }" />
        Yangilash
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
        <p class="text-sm text-gray-500 dark:text-slate-400">Jami protokollar</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-slate-100">{{ store.allItems.length }}</p>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
        <p class="text-sm text-gray-500 dark:text-slate-400">Jami summa (NDS'siz)</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-slate-100">{{ formatSumShort(store.totals.totalAmount) }}</p>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
        <p class="text-sm text-gray-500 dark:text-slate-400">NDS summasi</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-slate-100">{{ formatSumShort(store.totals.vatAmount) }}</p>
      </div>
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
        <p class="text-sm text-purple-600 dark:text-purple-300">Umumiy (NDS bilan)</p>
        <p class="text-2xl font-bold text-purple-700 dark:text-purple-200">{{ formatSumShort(store.totals.totalWithVat) }}</p>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
      <MaintenanceTable
        :items="store.allItems"
        :is-loading="store.isAllLoading"
        :error="store.allError"
        :on-retry="() => store.fetchAll(true)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import { useMaintenanceStore } from '@/stores/maintenanceStore';
import MaintenanceTable from '@/components/maintenance/MaintenanceTable.vue';
import { formatSumShort } from '@/utils/format';
import { onRefresh } from '@/composables/useRefreshBus';

const store = useMaintenanceStore();

onMounted(() => {
  store.fetchAll();
});

onRefresh(() => store.fetchAll(true));
</script>
