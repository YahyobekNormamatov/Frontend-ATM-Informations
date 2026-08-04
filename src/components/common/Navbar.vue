<template>
  <header
    class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200"
  >
    <div class="flex items-center gap-4">
      <h1 class="text-lg font-semibold text-gray-800 dark:text-slate-100">{{ pageTitle }}</h1>
    </div>
    <div class="flex items-center gap-3">
      <button
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
        :title="isRefreshing ? 'Yangilanmoqda...' : 'Sahifani yangilash'"
        :disabled="isRefreshing"
        @click="handleRefresh"
      >
        <RefreshCw :size="18" class="text-gray-500 dark:text-slate-400" :class="{ 'animate-spin': isRefreshing }" />
      </button>
      <button
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        :title="themeStore.isDark ? 'Light mode' : 'Dark mode'"
        @click="themeStore.toggle"
      >
        <component :is="themeStore.isDark ? Sun : Moon" :size="18" class="text-gray-500 dark:text-slate-400" />
      </button>
      <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative">
        <Bell :size="18" class="text-gray-500 dark:text-slate-400" />
        <span class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { RefreshCw, Bell, Sun, Moon } from 'lucide-vue-next';
import { useThemeStore } from '@/stores/themeStore';
import { triggerRefresh } from '@/composables/useRefreshBus';

const route = useRoute();
const themeStore = useThemeStore();
const isRefreshing = ref(false);

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard ATM',
    '/monitoring': 'ATM Monitoring',
    '/filial-aylanmasi': 'Filial aylanmasi',
    '/qurilmalar': 'Qurilmalar',
    '/arizalar': "Ta'mirlash protokollari",
    '/statistika/arizalar': 'Arizalar statistikasi',
    '/statistika/modellar': 'Modellar statistikasi'
  };
  return titles[route.path] || 'Dashboard';
});

async function handleRefresh(): Promise<void> {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  triggerRefresh();
  setTimeout(() => {
    isRefreshing.value = false;
  }, 600);
}
</script>
