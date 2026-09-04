import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { atmService } from '@/services/atmService';
import { extractErrorMessage } from '@/api/http';
import type { AtmDetailResponse, AtmFiltersResponse, AtmListItem } from '@/types/api';

export interface AtmListFilters {
  search: string;
  status: string;
  region: string;
  cardType: string;
  model: string;
  isActive: boolean | null;
}

const DEFAULT_FILTERS: AtmListFilters = {
  search: '',
  status: '',
  region: '',
  cardType: '',
  model: '',
  isActive: true
};

export const useAtmStore = defineStore('atm', () => {
  const items = ref<AtmListItem[]>([]);
  const count = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const filters = ref<AtmListFilters>({ ...DEFAULT_FILTERS });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filterOptions = ref<AtmFiltersResponse | null>(null);
  const isFilterOptionsLoading = ref(false);

  const allAtms = ref<AtmListItem[]>([]);
  const isAllAtmsLoading = ref(false);
  const allAtmsError = ref<string | null>(null);
  const allAtmsLoaded = ref(false);

  const detailCache = ref<Map<number, AtmDetailResponse>>(new Map());
  const isDetailLoading = ref(false);
  const detailError = ref<string | null>(null);

  const aiAnalysisCache = ref<Map<number, string>>(new Map());
  const isAiAnalysisLoading = ref(false);
  const aiAnalysisError = ref<string | null>(null);

  const totalPages = computed(() => Math.max(1, Math.ceil(count.value / pageSize.value)));

  const visiblePageNumbers = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    const span = 1;
    const start = Math.max(1, current - span);
    const end = Math.min(total, current + span);
    const nums: number[] = [];
    for (let p = start; p <= end; p++) nums.push(p);
    return nums;
  });

  async function fetchList(append = false): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await atmService.list({
        search: filters.value.search || undefined,
        status: filters.value.status || undefined,
        region: filters.value.region || undefined,
        card_type: filters.value.cardType || undefined,
        model: filters.value.model || undefined,
        is_active: filters.value.isActive ?? undefined,
        page: page.value,
        page_size: pageSize.value
      });
      items.value = append ? [...items.value, ...response.results] : response.results;
      count.value = response.count;
    } catch (err) {
      error.value = extractErrorMessage(err) || "ATM ro'yxatini yuklab bo'lmadi.";
    } finally {
      isLoading.value = false;
    }
  }

  function setFilters(partial: Partial<AtmListFilters>): void {
    filters.value = { ...filters.value, ...partial };
    page.value = 1;
  }

  function resetFilters(): void {
    filters.value = { ...DEFAULT_FILTERS };
    page.value = 1;
  }

  function setPage(newPage: number): void {
    if (newPage < 1 || newPage > totalPages.value) return;
    page.value = newPage;
  }

  async function fetchFilterOptions(): Promise<void> {
    if (filterOptions.value) return;
    isFilterOptionsLoading.value = true;
    try {
      filterOptions.value = await atmService.filters();
    } catch {
      filterOptions.value = null;
    } finally {
      isFilterOptionsLoading.value = false;
    }
  }

  async function fetchAllAtms(force = false): Promise<void> {
    if (allAtmsLoaded.value && !force) return;
    isAllAtmsLoading.value = true;
    allAtmsError.value = null;
    try {
      allAtms.value = await atmService.listAll({ is_active: true });
      allAtmsLoaded.value = true;
    } catch (err) {
      allAtmsError.value = extractErrorMessage(err) || "Ma'lumotlarni yuklab bo'lmadi.";
    } finally {
      isAllAtmsLoading.value = false;
    }
  }

  async function fetchAtmDetail(id: number, force = false): Promise<AtmDetailResponse | null> {
    if (!force && detailCache.value.has(id)) {
      return detailCache.value.get(id) ?? null;
    }
    isDetailLoading.value = true;
    detailError.value = null;
    try {
      const detail = await atmService.detail(id);
      detailCache.value.set(id, detail);
      return detail;
    } catch (err) {
      detailError.value = extractErrorMessage(err) || "ATM tafsilotlarini yuklab bo'lmadi.";
      return null;
    } finally {
      isDetailLoading.value = false;
    }
  }

  const POLL_INTERVAL_MS = 2500;
  const POLL_MAX_MS = 5 * 60 * 1000;

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchAiAnalysis(id: number, force = false): Promise<string | null> {
    if (!force && aiAnalysisCache.value.has(id)) {
      return aiAnalysisCache.value.get(id) ?? null;
    }

    isAiAnalysisLoading.value = true;
    aiAnalysisError.value = null;

    try {
      const created = await atmService.createAiAnalysis(id, { force });

      if (created.status === 'COMPLETED' && created.result) {
        aiAnalysisCache.value.set(id, created.result);
        return created.result;
      }

      const jobId = created.job_id;
      const startedAt = Date.now();

      while (Date.now() - startedAt < POLL_MAX_MS) {
        await sleep(POLL_INTERVAL_MS);

        const job = await atmService.getAiJob(jobId);

        if (job.status === 'COMPLETED') {
          aiAnalysisCache.value.set(id, job.result);
          return job.result;
        }

        if (job.status === 'FAILED') {
          aiAnalysisError.value = job.error || "AI tahlilini olib bo'lmadi.";
          return null;
        }
      }

      aiAnalysisError.value = 'AI tahlili juda uzoq vaqt oldi. Keyinroq qayta urinib ko\'ring.';
      return null;
    } catch (err) {
      aiAnalysisError.value = extractErrorMessage(err) || "AI tahlilini olib bo'lmadi.";
      return null;
    } finally {
      isAiAnalysisLoading.value = false;
    }
  }

  return {
    items,
    count,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    totalPages,
    visiblePageNumbers,

    filterOptions,
    isFilterOptionsLoading,

    allAtms,
    isAllAtmsLoading,
    allAtmsError,

    detailCache,
    isDetailLoading,
    detailError,

    aiAnalysisCache,
    isAiAnalysisLoading,
    aiAnalysisError,

    fetchList,
    setFilters,
    resetFilters,
    setPage,
    fetchFilterOptions,
    fetchAllAtms,
    fetchAtmDetail,
    fetchAiAnalysis
  };
});