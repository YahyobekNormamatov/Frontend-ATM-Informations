import { http } from '@/api/http';
import { ENDPOINTS } from '@/api/endpoints';
import { fetchAllPages } from '@/api/pagination';
import type {
  AiAnalysisResponse,
  AtmDetailResponse,
  AtmFiltersResponse,
  AtmListItem,
  AtmListQueryParams,
  AtmListResponse
} from '@/types/api';

function toQueryParams(params: AtmListQueryParams = {}): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {};
  if (params.search) query.search = params.search;
  if (params.status) query.status = params.status;
  if (params.region) query.region = params.region;
  if (params.card_type) query.card_type = params.card_type;
  if (params.model) query.model = params.model;
  if (typeof params.is_active === 'boolean') query.is_active = params.is_active;
  if (params.ordering) query.ordering = params.ordering;
  if (params.page) query.page = params.page;
  if (params.page_size) query.page_size = params.page_size;
  return query;
}

export const atmService = {
  async list(params: AtmListQueryParams = {}): Promise<AtmListResponse> {
    const { data } = await http.get<AtmListResponse>(ENDPOINTS.atms.list, {
      params: toQueryParams(params)
    });
    return data;
  },

  async detail(id: number): Promise<AtmDetailResponse> {
    const { data } = await http.get<AtmDetailResponse>(ENDPOINTS.atms.detail(id));
    return data;
  },

  async filters(): Promise<AtmFiltersResponse> {
    const { data } = await http.get<AtmFiltersResponse>(ENDPOINTS.atms.filters);
    return data;
  },

  async listAll(params: AtmListQueryParams = {}): Promise<AtmListItem[]> {
    return fetchAllPages<AtmListItem>(
      (page) => atmService.list({ ...params, page, page_size: params.page_size ?? 200 }),
      { maxPages: 20 }
    );
  },

  async aiAnalysis(id: number | string): Promise<AiAnalysisResponse> {
    const { data } = await http.post<AiAnalysisResponse>(
      ENDPOINTS.atms.aiAnalysis(id),
      undefined,
      { timeout: 90000 }
    );
    return data;
  }
};