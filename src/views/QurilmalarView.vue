<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-slate-100">Qurilmalar</h1>
        <p class="text-sm text-gray-500 dark:text-slate-400">Qurilmalar va terminallarni boshqarish</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          :disabled="atmStore.isLoading"
          @click="refresh"
        >
          <RefreshCw :size="16" :class="{ 'animate-spin': atmStore.isLoading }" />
          Yangilash
        </button>
        <button class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
          <Download :size="16" />
          Eksport
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            placeholder="Model, seriya raqam yoki bank bo'yicha qidirish..."
            class="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            v-model="searchQuery"
          />
        </div>
        <div>
          <select
            class="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100"
            v-model="modelFilter"
            @change="applyFilters"
          >
            <option value="">Barcha modellar</option>
            <option v-for="opt in modelOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div>
          <select
            class="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100"
            v-model="cardTypeFilter"
            @change="applyFilters"
          >
            <option value="">Barcha karta turlari</option>
            <option value="UZCARD">UZCARD</option>
            <option value="HUMO">HUMO</option>
          </select>
        </div>
        <div>
          <select
            class="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100"
            v-model="statusFilter"
            @change="applyFilters"
          >
            <option value="">Holati</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div v-if="atmStore.isLoading && atmStore.items.length === 0" class="p-4 space-y-3">
        <Skeleton v-for="i in 6" :key="i" height="2.5rem" />
      </div>

      <ErrorState
        v-else-if="atmStore.error"
        :message="atmStore.error"
        :on-retry="() => atmStore.fetchList()"
      />

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">MODEL</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">SERIYA RAQAM</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">TERMINAL ID</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">VILOYAT</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">KARTA TURI</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">HOLAT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
              <tr v-if="atmStore.items.length === 0">
                <td colspan="7" class="px-4 py-8">
                  <EmptyState message="Hech qanday qurilma topilmadi" />
                </td>
              </tr>
              <tr
                v-for="device in atmStore.items"
                :key="device.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-slate-400">{{ device.id }}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-800 dark:text-slate-100">{{ device.model }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-slate-300 font-mono">{{ device.serial_number }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-slate-300 font-mono">{{ device.terminal_id }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-slate-300 max-w-xs truncate">{{ device.region }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300">
                    {{ device.card_type }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit" :class="STATUS_BADGE_CLASSES[statusToVariant(device.status)]">
                    <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_DOT_CLASSES[statusToVariant(device.status)]"></span>
                    {{ statusToLabel(device.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-slate-400">Jami {{ atmStore.count }} ta qurilma</p>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAtmStore } from '@/stores/atmStore';
import { RefreshCw, Download } from 'lucide-vue-next';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { STATUS_BADGE_CLASSES, STATUS_DOT_CLASSES, statusToLabel, statusToVariant } from '@/types';
import { onRefresh } from '@/composables/useRefreshBus';

const atmStore = useAtmStore();
const searchQuery = ref('');
const modelFilter = ref('');
const cardTypeFilter = ref('');
const statusFilter = ref('');

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

const modelOptions = computed(() => atmStore.filterOptions?.model ?? []);

function mapStatusFilter(value: string): string {
  if (value === 'Online') return 'SOZ';
  if (value === 'Offline') return 'NOSOZ';
  return '';
}

function applyFilters(): void {
  atmStore.setFilters({
    status: mapStatusFilter(statusFilter.value),
    model: modelFilter.value,
    cardType: cardTypeFilter.value
  });
  atmStore.fetchList();
}

function goToPage(p: number): void {
  atmStore.setPage(p);
  atmStore.fetchList();
}

function refresh(): void {
  atmStore.fetchList();
}

watch(searchQuery, () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    atmStore.setFilters({ search: searchQuery.value });
    atmStore.fetchList();
  }, 400);
});

onMounted(() => {
  atmStore.fetchFilterOptions();
  atmStore.fetchList();
});

onBeforeUnmount(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
    searchDebounce = null;
  }
});

onRefresh(() => atmStore.fetchList());
</script>
