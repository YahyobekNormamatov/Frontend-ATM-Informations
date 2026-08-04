<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 hover:shadow-md transition-all duration-200">
    <div class="flex items-start justify-between mb-3">
      <div>
        <p class="text-sm text-gray-500 dark:text-slate-400 font-medium">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-1">{{ value }}</p>
      </div>
      <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="[iconBg, darkIconBg]">
        <component :is="icon" :size="20" :class="iconColor" />
      </div>
    </div>

    <div v-if="progress !== undefined" class="mt-2">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
        <span>{{ progressLabel || '' }}</span>
        <span class="font-medium" :class="progressTextColor">{{ progress }}%</span>
      </div>
      <div class="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="progressBarColor"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <div v-if="subtitle" class="mt-2 text-xs" :class="subtitleColor">
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: Component;
  iconBg?: string;
  iconColor?: string;
  progress?: number;
  progressLabel?: string;
  subtitle?: string;
  subtitleColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconBg: 'bg-purple-50',
  iconColor: 'text-purple-600',
  subtitleColor: 'text-gray-500 dark:text-slate-400'
});

const progressBarColor = computed(() => {
  if (!props.progress) return 'bg-purple-600';
  if (props.progress >= 80) return 'bg-green-500';
  if (props.progress >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
});

const progressTextColor = computed(() => {
  if (!props.progress) return 'text-purple-600 dark:text-purple-300';
  if (props.progress >= 80) return 'text-green-600 dark:text-green-300';
  if (props.progress >= 50) return 'text-yellow-600 dark:text-yellow-300';
  return 'text-red-600 dark:text-red-300';
});

const DARK_ICON_BG: Record<string, string> = {
  'bg-purple-50': 'dark:bg-purple-500/15',
  'bg-green-50': 'dark:bg-green-500/15',
  'bg-orange-50': 'dark:bg-orange-500/15',
  'bg-red-50': 'dark:bg-red-500/15',
  'bg-blue-50': 'dark:bg-blue-500/15',
  'bg-yellow-50': 'dark:bg-yellow-500/15',
  'bg-teal-50': 'dark:bg-teal-500/15',
  'bg-gray-100': 'dark:bg-slate-800'
};

const darkIconBg = computed(() => DARK_ICON_BG[props.iconBg] ?? 'dark:bg-slate-800');
</script>