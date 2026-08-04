import { http } from '@/api/http';
import { ENDPOINTS } from '@/api/endpoints';
import { fetchAllPages } from '@/api/pagination';
import type {
  MaintenanceDetailResponse,
  MaintenanceListItem,
  MaintenanceListQueryParams,
  MaintenanceListResponse
} from '@/types/api';

function toQueryParams(
  params: MaintenanceListQueryParams = {}
): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (params.page) query.page = params.page;
  if (params.page_size) query.page_size = params.page_size;
  if (params.ordering) query.ordering = params.ordering;
  if (params.search) query.search = params.search;
  return query;
}

export const maintenanceService = {
  async list(params: MaintenanceListQueryParams = {}): Promise<MaintenanceListResponse> {
    const { data } = await http.get<MaintenanceListResponse>(ENDPOINTS.maintenance.list, {
      params: toQueryParams(params)
    });
    return data;
  },

  async detail(id: number): Promise<MaintenanceDetailResponse> {
    const { data } = await http.get<MaintenanceDetailResponse>(ENDPOINTS.maintenance.detail(id));
    return data;
  },

  async listAll(params: MaintenanceListQueryParams = {}): Promise<MaintenanceListItem[]> {
    return fetchAllPages<MaintenanceListItem>(
      (page) => maintenanceService.list({ ...params, page, page_size: params.page_size ?? 100 }),
      { maxPages: 20 }
    );
  }
};