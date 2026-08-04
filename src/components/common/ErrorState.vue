<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-red-100 dark:border-red-500/30 p-8 text-center">
    <AlertTriangle :size="28" class="text-red-400 dark:text-red-300 mx-auto mb-3" />
    <p class="text-sm font-medium text-gray-700 dark:text-slate-200">{{ message }}</p>
    <button
      v-if="onRetry"
      class="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
      @click="onRetry"
    >
      Qayta urinish
    </button>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    message?: string;
    onRetry?: () => void;
  }>(),
  {
    message: "Ma'lumotlarni yuklashda xatolik yuz berdi."
  }
);
</script>
