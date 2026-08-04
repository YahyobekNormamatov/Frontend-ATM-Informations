import { reactive } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeout: number;
}

let counter = 0;

export const toastState = reactive<{ items: Toast[] }>({
  items: []
});

function push(type: ToastType, message: string, timeout = 5000): void {
  const id = ++counter;
  toastState.items.push({ id, type, message, timeout });

  if (timeout > 0) {
    setTimeout(() => dismiss(id), timeout);
  }
}

export function dismiss(id: number): void {
  const idx = toastState.items.findIndex((t) => t.id === id);
  if (idx !== -1) {
    toastState.items.splice(idx, 1);
  }
}

export const notify = {
  success: (message: string, timeout?: number) => push('success', message, timeout),
  error: (message: string, timeout?: number) => push('error', message, timeout),
  warning: (message: string, timeout?: number) => push('warning', message, timeout),
  info: (message: string, timeout?: number) => push('info', message, timeout)
};