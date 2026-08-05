import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { dashboardService } from '@/services/dashboardService';
import { extractErrorMessage } from '@/api/http';
import type { DashboardResponse } from '@/types/api';
import { safePercentage } from '@/utils/format';

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const summary = computed(() => data.value?.summary ?? null);
  const finance = computed(() => data.value?.finance ?? null);
  const maintenance = computed(() => data.value?.maintenance ?? null);
  const topRegions = computed(() => data.value?.top_regions ?? []);
  const regionFinance = computed(() => data.value?.region_finance ?? []);
  const monthlyChart = computed(() => data.value?.monthly_chart ?? []);
  const topModels = computed(() => data.value?.top_models ?? []);
  const repairTrend = computed(() => data.value?.repair_trend ?? []);

  const workingPercentage = computed(() => {
    if (!summary.value) return 0;
    return safePercentage(summary.value.soz, summary.value.total_atms);
  });

  const faultyPercentage = computed(() => {
    if (!summary.value) return 0;
    return safePercentage(summary.value.nosoz, summary.value.total_atms);
  });

  const networkRiskScore = computed(() => Math.round(100 - faultyPercentage.value));

  const networkRiskLevel = computed<'PAST' | "O'RTA" | 'YUQORI'>(() => {
    const score = networkRiskScore.value;
    if (score >= 90) return 'YUQORI';
    if (score >= 70) return "O'RTA";
    return 'PAST';
  });

  async function fetchDashboard(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      data.value = await dashboardService.get();
    } catch (err) {
      error.value = extractErrorMessage(err) || "Dashboard ma'lumotlarini yuklab bo'lmadi.";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    data,
    isLoading,
    error,
    summary,
    finance,
    maintenance,
    topRegions,
    regionFinance,
    monthlyChart,
    topModels,
    repairTrend,
    workingPercentage,
    faultyPercentage,
    networkRiskScore,
    networkRiskLevel,
    fetchDashboard
  };
});