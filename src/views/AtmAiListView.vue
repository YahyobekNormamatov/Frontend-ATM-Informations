<template>
  <div class="space-y-6">
    <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
      <router-link
        :to="{ name: 'AiAnalytics' }"
        class="inline-flex items-center gap-1 text-purple-600 dark:text-purple-300 hover:underline"
      >
        <ChevronLeft class="w-4 h-4" />
        AI Portal
      </router-link>
      <span class="text-gray-300 dark:text-slate-600">/</span>
      <span class="text-gray-700 dark:text-slate-200 font-medium">AI Bankomat tahlili</span>
    </nav>

    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-slate-100">AI Bankomat tahlili</h1>
      <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">
        Har bir ATM uchun sun'iy intellekt tomonidan generatsiya qilinadigan tahliliy hisobot
      </p>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">AI Tahlil</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
              <tr v-if="atmStore.items.length === 0">
                <td colspan="8" class="px-4 py-10">
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
                <td class="px-4 py-3 text-center">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-200 bg-purple-50 dark:bg-purple-500/15 hover:bg-purple-100 dark:hover:bg-purple-500/25 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    @click="openAiAnalysis(atm)"
                  >
                    <Sparkles class="w-3.5 h-3.5" />
                    Tahlil qilish
                  </button>
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
              :class="p === atmStore.page ? 'bg-purple-600 text-white' : 'text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'"
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

    <AiAnalysisModal
      v-model:open="aiModalOpen"
      :atm-id="selectedAtm?.id ?? null"
      :atm-name="selectedAtm?.name ?? null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ChevronLeft, Sparkles } from 'lucide-vue-next';
import { useAtmStore } from '@/stores/atmStore';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import AiAnalysisModal from '@/components/ai/AiAnalysisModal.vue';
import { onRefresh } from '@/composables/useRefreshBus';
import type { AtmListItem } from '@/types/api';

const atmStore = useAtmStore();

const searchQuery = ref('');
const selectedRegion = ref('');

const aiModalOpen = ref(false);
const selectedAtm = ref<AtmListItem | null>(null);

function openAiAnalysis(atm: AtmListItem): void {
  selectedAtm.value = atm;
  aiModalOpen.value = true;
}

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

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

function applyFilters(): void {
  atmStore.setFilters({
    search: searchQuery.value,
    region: selectedRegion.value
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

onMounted(() => {
  atmStore.resetFilters();
  atmStore.pageSize = 20;
  atmStore.fetchFilterOptions();
  atmStore.fetchList();
  atmStore.fetchAllAtms();
});

onBeforeUnmount(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
    searchDebounce = null;
  }
});

onRefresh(() => {
  atmStore.fetchList();
});
</script>
