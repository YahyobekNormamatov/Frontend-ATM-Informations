<template>
  <div class="stat-card">
    <div class="flex items-start justify-between mb-3">
      <div class="min-w-0">
        <p class="label-eyebrow">{{ title }}</p>
        <p class="num-solid text-3xl mt-1.5">{{ value }}</p>
      </div>
      <div class="stat-card__icon" :class="[iconBg, darkIconBg]">
        <component :is="icon" :size="20" :class="iconColor" />
      </div>
    </div>

    <div v-if="progress !== undefined" class="mt-2">
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="text-gray-500 dark:text-slate-400">{{ progressLabel || '' }}</span>
        <span class="font-bold tabular-nums" :class="progressTextColor">{{ progress }}%</span>
      </div>
      <div class="ai-progress-track w-full h-1.5">
        <div
          class="ai-progress-fill"
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
  if (!props.progress) return 'ai-progress-fill--primary';
  if (props.progress >= 80) return 'ai-progress-fill--success';
  if (props.progress >= 50) return 'ai-progress-fill--warning';
  return 'ai-progress-fill--danger';
});

const progressTextColor = computed(() => {
  if (!props.progress) return 'text-blue-600 dark:text-blue-300';
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

<style scoped>
.stat-card {
  position: relative;
  background-image: linear-gradient(140deg, var(--ai-panel-from) 0%, var(--ai-panel-to) 100%);
  border: 1px solid var(--ai-border);
  border-radius: 14px;
  padding: 1.15rem 1.25rem;
  backdrop-filter: blur(8px);
  box-shadow: var(--ai-shadow-sm);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
  isolation: isolate;
}
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(96, 165, 250, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.7s ease;
  pointer-events: none;
  z-index: -1;
}
.stat-card:hover {
  transform: translateY(-3px);
  border-color: var(--ai-border-strong);
  box-shadow: var(--ai-shadow-md);
}
.stat-card:hover::before {
  transform: translateX(100%);
}

.stat-card__icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(96, 165, 250, 0.25);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: transform 0.25s ease;
}
.stat-card:hover .stat-card__icon {
  transform: scale(1.08) rotate(-3deg);
}

</style>
