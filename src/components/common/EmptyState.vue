<template>
  <div class="flex flex-col items-center justify-center text-center py-8 px-4">
    <Inbox :size="24" class="text-gray-300 dark:text-slate-600 mb-2" />
    <p class="text-sm text-gray-400 dark:text-slate-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: "Ma'lumot mavjud emas"
  }
);
</script>
