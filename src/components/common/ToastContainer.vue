<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="toast in toastState.items"
        :key="toast.id"
        class="pointer-events-auto rounded-xl shadow-md border p-4 flex items-start gap-3 bg-white dark:bg-slate-900"
        :class="borderClass(toast.type)"
      >
        <component :is="iconFor(toast.type)" :size="18" class="mt-0.5 flex-shrink-0" :class="iconClass(toast.type)" />
        <p class="text-sm text-gray-700 dark:text-slate-200 flex-1">{{ toast.message }}</p>
        <button
          class="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
          @click="dismiss(toast.id)"
        >
          <X :size="16" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-vue-next';
import { toastState, dismiss, type ToastType } from '@/utils/notify';

const iconFor = (type: ToastType) => {
  const map = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };
  return map[type];
};

const iconClass = (type: ToastType) => {
  const map: Record<ToastType, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };
  return map[type];
};

const borderClass = (type: ToastType) => {
  const map: Record<ToastType, string> = {
    success: 'border-green-100 dark:border-green-500/30',
    error: 'border-red-100 dark:border-red-500/30',
    warning: 'border-yellow-100 dark:border-yellow-500/30',
    info: 'border-blue-100 dark:border-blue-500/30'
  };
  return map[type];
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
