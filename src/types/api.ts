export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface AtmListItem {
  id: number;
  name: string;
  region: string;
  terminal_id: string;
  merchant_id: string;
  serial_number: string;
  status: string;
  card_type: string;
  model: string;
  address: string;
}

export type AtmListResponse = PaginatedResponse<AtmListItem>;

export interface AtmDetailGeneral {
  region: string;
  name: string;
  address: string;
  card_type: string;
  model: string;
}
export interface AtmDetailTechnical {
  merchant_id: string;
  terminal_id: string;
  status: string;
  serial_number: string;
  inventory_number: string;
  account_23510: string;
  account_45265: string;
}

export interface AtmMonthlyStatistic {
  year: number;
  month: number;
  income: number;
  expense: number;
  repair_cost: number;
  quantity: number;
}

export interface AtmServiceContractPayment {
  year: number;
  month: number;
  payment_type: string;
  amount: number;
}

export interface AtmServiceContract {
  btech_monthly_fee: number;
  glob_monthly_fee: number;
  payments: AtmServiceContractPayment[];
}

export interface AtmYearlyStatistic {
  year: number;
  card_type: string;
  income: number;
  expense: number;
  repair_cost: number;
  quantity: number;
}

export interface AtmDetailResponse {
  general: AtmDetailGeneral;
  technical: AtmDetailTechnical;
  service_contract?: AtmServiceContract;
  monthly_statistics: AtmMonthlyStatistic[];
  yearly_statistics?: AtmYearlyStatistic[];
}

export type AiAnalysisStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AiAnalysisCreateResponse {
  job_id: number;
  status: AiAnalysisStatus;
  result?: string;
  cached?: boolean;
}

export interface AiAnalysisJob {
  id: number;
  atm: number;
  status: AiAnalysisStatus;
  result: string;
  error: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  duration_seconds: number | null;
}

export interface FilterOption {
  value: string;
  label: string;
}

export type AtmFiltersResponse = Record<string, FilterOption[]>;

export interface AtmListQueryParams {
  search?: string;
  status?: string;
  region?: string;
  card_type?: string;
  model?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface DashboardSummary {
  total_atms: number;
  active: number;
  inactive: number;
  soz: number;
  nosoz: number;
  uzcard: number;
  humo: number;
}

export interface DashboardFinance {
  income: number;
  expense: number;
  profit: number;
}

export interface DashboardMaintenance {
  repair_count: number;
  repair_cost: number;
}

export interface DashboardRegionStat {
  region: string;
  total: number;
  active: number;
  inactive: number;
  soz: number;
  nosoz: number;
  uzcard?: number;
  humo?: number;
}

export interface DashboardRegionFinance {
  region: string;
  income: number;
  expense: number;
  profit: number;
}

export interface DashboardRecentMaintenance {
  id: number;
  protocol_number: string | null;
  protocol_date: string;
  part_name: string;
  quantity: number;
  total_amount: number;
  atm: {
    terminal_id: string | null;
    serial_number: string | null;
    region: string | null;
  };
}

export interface DashboardMonthlyItem {
  year: number;
  month: number;
  income: number;
  expense: number;
  profit: number;
}

export interface DashboardTopModel {
  model: string;
  total: number;
  soz: number;
  nosoz: number;
}

export interface DashboardRepairTrendItem {
  year: number;
  month: number;
  repair_count: number;
  repair_cost: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  finance: DashboardFinance;
  maintenance: DashboardMaintenance;
  top_regions: DashboardRegionStat[];
  region_finance?: DashboardRegionFinance[];
  recent_maintenance?: DashboardRecentMaintenance[];
  monthly_chart?: DashboardMonthlyItem[];
  top_models?: DashboardTopModel[];
  repair_trend?: DashboardRepairTrendItem[];
}

export interface MaintenanceListItem {
  id: number;
  row_number: number;
  protocol_number: string | null;
  protocol_date: string;
  atm_id: number | null;
  terminal_id: string | null;
  atm_name: string | null;
  region: string | null;
  model: string | null;
  card_type: string | null;
  status: string | null;
  equipment_module: string;
  serial_number: string;
  filial_name: string;
  mfo_bank: string;
  part_name: string;
  measurement_unit: string;
  quantity: string;
  price_per_unit: string;
  total_amount: string;
  vat_rate: string;
  vat_amount?: string;
  total_with_vat?: string;
  document?: number | null;
  protocol?: number | null;
}

export type MaintenanceListResponse = PaginatedResponse<MaintenanceListItem>;

export interface MaintenanceDetailResponse {
  id: number;
  row_number: number;
  protocol_date: string;
  equipment_module: string;
  serial_number: string;
  filial_name: string;
  mfo_bank: string;
  part_name: string;
  measurement_unit: string;
  quantity: string;
  price_per_unit: string;
  total_amount: string;
  vat_rate: string;
  vat_amount: string;
  total_with_vat: string;
  document: number | null;
  protocol: number | null;
  technical: unknown | null;
}

export interface MaintenanceListQueryParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

export interface DoughnutDataset {
  data: number[];
  backgroundColor: string[];
  borderWidth?: number;
  borderColor?: string;
}

export interface DoughnutChartData {
  labels: string[];
  datasets: DoughnutDataset[];
}

export interface BarLineDataset {
  label: string;
  data: number[];
  type?: 'bar' | 'line';
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  tension?: number;
  fill?: boolean;
  pointBackgroundColor?: string;
  pointRadius?: number;
  pointHoverRadius?: number;
  yAxisID?: string;
}

export interface BarLineChartData {
  labels: string[];
  datasets: BarLineDataset[];
}