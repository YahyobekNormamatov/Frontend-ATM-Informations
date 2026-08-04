import { http } from '@/api/http';
import { ENDPOINTS } from '@/api/endpoints';
import type { DashboardResponse } from '@/types/api';

export const dashboardService = {
  async get(): Promise<DashboardResponse> {
    const { data } = await http.get<DashboardResponse>(ENDPOINTS.dashboard.root);
    return data;
  }
};