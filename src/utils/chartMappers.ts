import type { DashboardRegionStat } from '@/types/api';

export interface DonutCardData {
  labels: string[];
  values: number[];
  colors: string[];
}

export interface LegendItem {
  label: string;
  value: number;
  color: string;
}

export function buildLegend(labels: string[], values: number[], colors: string[]): LegendItem[] {
  return labels.map((label, i) => ({ label, value: values[i] ?? 0, color: colors[i] ?? '#999999' }));
}

export function toDoughnutChartData(labels: string[], values: number[], colors: string[]) {
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };
}

export function regionsToTurnoverChartData(regions: DashboardRegionStat[]) {
  const labels = regions.map((r) => r.region);
  const income = regions.map((r) => (r.income ?? 0) / 1_000_000_000);
  const expense = regions.map((r) => (r.expense ?? 0) / 1_000_000_000);
  const trend = regions.map((_r, i) => Math.max(income[i] - expense[i], 0));

  return {
    labels,
    datasets: [
      {
        label: 'Kirim',
        data: income,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4,
        type: 'bar' as const
      },
      {
        label: 'Chiqim',
        data: expense,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 4,
        type: 'bar' as const
      },
      {
        label: 'Trend',
        data: trend,
        borderColor: '#7C4DFF',
        backgroundColor: 'transparent',
        pointBackgroundColor: '#7C4DFF',
        tension: 0.4,
        fill: false,
        type: 'line' as const,
        borderWidth: 2
      }
    ]
  };
}

const MONTH_LABELS = [
  'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'
];

export function monthKeyToLabel(key: string): string {
  const [year, month] = key.split('-');
  const idx = Number(month) - 1;
  const label = MONTH_LABELS[idx] ?? month;
  return `${label} ${year}`;
}

export function groupCountsByMonth(dates: string[]): { labels: string[]; counts: number[] } {
  const map = new Map<string, number>();
  for (const raw of dates) {
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const sortedKeys = Array.from(map.keys()).sort();
  return {
    labels: sortedKeys.map(monthKeyToLabel),
    counts: sortedKeys.map((k) => map.get(k) ?? 0)
  };
}