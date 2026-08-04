<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-slate-100">Arizalar statistikasi</h1>
      <p class="text-sm text-gray-500 dark:text-slate-400">ATM arizalari bo'yicha statistik ma'lumotlar</p>
    </div>

    <div v-if="store.isAllLoading && store.allItems.length === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton v-for="i in 2" :key="i" height="18rem" />
    </div>

    <ErrorState
      v-else-if="store.allError"
      :message="store.allError"
      :on-retry="() => store.fetchAll(true)"
    />

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">Arizalar holati bo'yicha</h3>
        <p class="text-xs text-gray-400 dark:text-slate-500 mb-3">
          * Holat tushunchasi backendda mavjud emas — protokol sanasiga asoslangan taxminiy tasnif
        </p>
        <div v-if="store.statusBuckets.jami === 0" class="h-64 flex items-center justify-center">
          <EmptyState message="Ariza ma'lumoti mavjud emas" />
        </div>
        <div v-else class="h-64">
          <DualAxisChart :data="statusChartData" y-axis-unit="" />
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4">Oylik arizalar dinamikasi</h3>
        <div v-if="monthlyDynamics.labels.length === 0" class="h-64 flex items-center justify-center">
          <EmptyState message="Oylik dinamika uchun ma'lumot yetarli emas" />
        </div>
        <div v-else class="h-64">
          <DualAxisChart :data="monthlyChartData" y-axis-unit="" />
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 lg:col-span-2">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4">Qisqacha statistika</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <p class="text-2xl font-bold text-gray-800 dark:text-slate-100">{{ store.statusBuckets.jami }}</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">Jami arizalar</p>
          </div>
          <div class="text-center p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ store.statusBuckets.yangi }}</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">Yangi</p>
          </div>
          <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{{ store.statusBuckets.jarayonda }}</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">Jarayonda</p>
          </div>
          <div class="text-center p-4 bg-green-50 dark:bg-green-500/10 rounded-lg">
            <p class="text-2xl font-bold text-green-600 dark:text-green-300">{{ store.statusBuckets.yopilgan }}</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">Yopilgan</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 lg:col-span-2">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-4">Ta'mirlash sarflari</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-slate-400">Jami summa (NDS'siz)</p>
            <p class="text-xl font-bold text-gray-800 dark:text-slate-100 mt-1">{{ formatSumShort(store.totals.totalAmount) }}</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-slate-400">NDS summasi</p>
            <p class="text-xl font-bold text-gray-800 dark:text-slate-100 mt-1">{{ formatSumShort(store.totals.vatAmount) }}</p>
          </div>
          <div class="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
            <p class="text-xs text-purple-700 dark:text-purple-300">Jami summa (NDS bilan)</p>
            <p class="text-xl font-bold text-purple-700 dark:text-purple-200 mt-1">{{ formatSumShort(store.totals.totalWithVat) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import DualAxisChart from '@/components/charts/DualAxisChart.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useMaintenanceStore } from '@/stores/maintenanceStore';
import { formatSumShort } from '@/utils/format';
import type { BarLineChartData } from '@/types/api';
import { onRefresh } from '@/composables/useRefreshBus';

const store = useMaintenanceStore();

const monthlyDynamics = computed(() => store.monthlyDynamics);

const statusChartData = computed<BarLineChartData>(() => ({
  labels: ['Yangi', 'Jarayonda', 'Yopilgan'],
  datasets: [
    {
      label: 'Arizalar soni',
      data: [store.statusBuckets.yangi, store.statusBuckets.jarayonda, store.statusBuckets.yopilgan],
      backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
      borderRadius: 4
    }
  ]
}));

const monthlyChartData = computed<BarLineChartData>(() => ({
  labels: monthlyDynamics.value.labels,
  datasets: [
    {
      label: 'Arizalar',
      data: monthlyDynamics.value.counts,
      backgroundColor: 'rgba(124, 77, 255, 0.6)',
      borderRadius: 4
    }
  ]
}));

onMounted(() => {
  store.fetchAll();
});

onRefresh(() => store.fetchAll(true));
</script>
