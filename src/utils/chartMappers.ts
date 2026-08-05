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