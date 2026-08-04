import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { maintenanceService } from '@/services/maintenanceService';
import { extractErrorMessage } from '@/api/http';
import type { MaintenanceListItem } from '@/types/api';
import { groupCountsByMonth } from '@/utils/chartMappers';
import { toNumber } from '@/utils/format';
import { classifyProtocolStatus } from '@/utils/maintenanceStatus';

export const useMaintenanceStore = defineStore('maintenance', () => {
  const items = ref<MaintenanceListItem[]>([]);
  const count = ref(0);
  const page = ref(1);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const allItems = ref<MaintenanceListItem[]>([]);
  const isAllLoading = ref(false);
  const allError = ref<string | null>(null);
  const allLoaded = ref(false);

  const totalPages = computed(() => Math.max(1, Math.ceil(count.value / pageSize.value)));

  const visiblePageNumbers = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    const start = Math.max(1, current - 1);
    const end = Math.min(total, current + 1);
    const nums: number[] = [];
    for (let p = start; p <= end; p++) nums.push(p);
    return nums;
  });

  async function fetchList(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await maintenanceService.list({ page: page.value, page_size: pageSize.value });
      items.value = response.results;
      count.value = response.count;
    } catch (err) {
      error.value = extractErrorMessage(err) || "Arizalar ro'yxatini yuklab bo'lmadi.";
    } finally {
      isLoading.value = false;
    }
  }

  function setPage(newPage: number): void {
    if (newPage < 1 || newPage > totalPages.value) return;
    page.value = newPage;
  }

  async function fetchAll(force = false): Promise<void> {
    if (allLoaded.value && !force) return;
    isAllLoading.value = true;
    allError.value = null;
    try {
      const results = await maintenanceService.listAll();
      allItems.value = results.sort((a, b) => a.row_number - b.row_number);
      allLoaded.value = true;
    } catch (err) {
      allError.value = extractErrorMessage(err) || "Ma'lumotlarni yuklab bo'lmadi.";
    } finally {
      isAllLoading.value = false;
    }
  }

  const statusBuckets = computed(() => {
    let yangi = 0;
    let jarayonda = 0;
    let yopilgan = 0;

    for (const item of allItems.value) {
      const bucket = classifyProtocolStatus(item.protocol_date);
      if (bucket === 'yangi') yangi += 1;
      else if (bucket === 'jarayonda') jarayonda += 1;
      else yopilgan += 1;
    }

    return { yangi, jarayonda, yopilgan, jami: allItems.value.length };
  });

  const monthlyDynamics = computed(() => groupCountsByMonth(allItems.value.map((i) => i.protocol_date)));

  const totals = computed(() => {
    let totalAmount = 0;
    let vatAmount = 0;
    let totalWithVat = 0;
    for (const item of allItems.value) {
      totalAmount += toNumber(item.total_amount);
      vatAmount += toNumber(item.vat_amount);
      totalWithVat += toNumber(item.total_with_vat ?? item.total_amount);
    }
    return { totalAmount, vatAmount, totalWithVat };
  });

  return {
    items,
    count,
    page,
    pageSize,
    isLoading,
    error,
    totalPages,
    visiblePageNumbers,

    allItems,
    isAllLoading,
    allError,
    allLoaded,

    statusBuckets,
    monthlyDynamics,
    totals,

    fetchList,
    setPage,
    fetchAll
  };
});