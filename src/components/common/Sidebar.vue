<template>
  <aside
    class="w-64 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 transition-colors duration-200"
  >
    <div class="px-4 py-3">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Qidirish..."
          class="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <kbd class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">⌘K</kbd>
      </div>
    </div>
    
    <nav class="flex-1 overflow-y-auto px-3 py-2">
      <div v-for="section in navSections" :key="section.title" class="mb-4">
        <p class="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
          {{ section.title }}
        </p>
        <router-link
          v-for="item in section.items"
          :key="item.path"
          :to="item.path"
          class="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
          :class="
            route.path === item.path
              ? 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold'
              : 'text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-300'
          "
        >
          <span
            v-if="route.path === item.path"
            class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 rounded-r-full bg-purple-600 dark:bg-purple-400"
            aria-hidden="true"
          ></span>
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </router-link>
      </div>
    </nav>

  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  LayoutDashboard,
  Activity,
  Banknote,
  FileText,
  PieChart,
  Cpu,
  Search
} from 'lucide-vue-next';
import AiAnalyticsIcon from '@/components/icons/AiAnalyticsIcon.vue';

const route = useRoute();

const navSections = [
  {
    title: 'Bank Nazorati',
    items: [
      { path: '/', label: 'Dashboard ATM', icon: LayoutDashboard },
      { path: '/monitoring', label: 'ATM Monitoring', icon: Activity },
      { path: '/filial-aylanmasi', label: 'Filial aylanmasi', icon: Banknote }
    ]
  },
  {
    title: 'Protokollar',
    items: [
      { path: '/arizalar', label: "Ta'mirlash protokollari", icon: FileText }
    ]
  },

  
  {
    title: 'Statistika',
    items: [
      { path: '/statistika/arizalar', label: 'Arizalar statistikasi', icon: PieChart },
      { path: '/statistika/modellar', label: 'Modellar statistikasi', icon: Cpu }
    ]
  },
  {
    title: 'AI Analytics',
    items: [
      { path: '/ai-analytics', label: 'AI Analytics', icon: AiAnalyticsIcon }
    ]
  }
];
</script>
