import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'turon_theme_mode';

function readInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function detectSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyDomClass(effective: 'light' | 'dark'): void {
  const root = document.documentElement;
  if (effective === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = effective;
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(readInitialMode());
  const systemPreference = ref<'light' | 'dark'>(detectSystemPreference());

  const resolvedMode = computed<'light' | 'dark'>(() =>
    mode.value === 'system' ? systemPreference.value : mode.value
  );

  const isDark = computed(() => resolvedMode.value === 'dark');

  function setMode(next: ThemeMode): void {
    mode.value = next;
    localStorage.setItem(STORAGE_KEY, next);
  }

  function toggle(): void {
    setMode(isDark.value ? 'light' : 'dark');
  }

  function init(): void {
    applyDomClass(resolvedMode.value);

    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (event: MediaQueryListEvent) => {
        systemPreference.value = event.matches ? 'dark' : 'light';
      };
      if ('addEventListener' in media) media.addEventListener('change', handler);
      else (media as MediaQueryList).addListener(handler);
    }
  }

  watch(resolvedMode, (next) => applyDomClass(next));

  return {
    mode,
    systemPreference,
    resolvedMode,
    isDark,
    setMode,
    toggle,
    init
  };
});