export type StatusVariant = 'success' | 'danger' | 'warning' | 'neutral';

export function statusToVariant(status: string | null | undefined): StatusVariant {
  if (!status) return 'neutral';
  const normalized = status.toUpperCase();
  if (normalized === 'SOZ') return 'success';
  if (normalized === 'NOSOZ') return 'danger';
  return 'neutral';
}

export const STATUS_BADGE_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300'
};

export const STATUS_DOT_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  neutral: 'bg-gray-400 dark:bg-slate-500'
};

export function statusToLabel(status: string | null | undefined): string {
  if (!status) return "Noma'lum";
  const normalized = status.toUpperCase();
  if (normalized === 'SOZ') return 'Soz';
  if (normalized === 'NOSOZ') return 'Nosoz';
  return status;
}