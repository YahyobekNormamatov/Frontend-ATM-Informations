export type MaintenanceStatusBucket = 'yangi' | 'jarayonda' | 'yopilgan';

export function classifyProtocolStatus(protocolDate: string | null | undefined): MaintenanceStatusBucket {
  if (!protocolDate) return 'yopilgan';
  const d = new Date(protocolDate);
  if (Number.isNaN(d.getTime())) return 'yopilgan';

  const now = new Date();
  const key = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;
  const currentKey = key(now);
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevKey = key(prevDate);
  const itemKey = key(d);

  if (itemKey === currentKey) return 'yangi';
  if (itemKey === prevKey) return 'jarayonda';
  return 'yopilgan';
}

export const STATUS_BUCKET_LABELS: Record<MaintenanceStatusBucket, string> = {
  yangi: 'Yangi',
  jarayonda: 'Jarayonda',
  yopilgan: 'Yopilgan'
};

export const STATUS_BUCKET_CLASSES: Record<MaintenanceStatusBucket, string> = {
  yangi: 'bg-blue-100 text-blue-700',
  jarayonda: 'bg-yellow-100 text-yellow-700',
  yopilgan: 'bg-green-100 text-green-700'
};