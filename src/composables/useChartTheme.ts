import { computed } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

export function useChartTheme() {
  const theme = useThemeStore();

  const gridColor = computed(() => (theme.isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.06)'));
  const axisTickColor = computed(() => (theme.isDark ? '#94a3b8' : '#64748b'));
  const axisTitleColor = computed(() => (theme.isDark ? '#cbd5e1' : '#334155'));
  const legendColor = computed(() => (theme.isDark ? '#e2e8f0' : '#334155'));

  const tooltip = computed(() => ({
    backgroundColor: theme.isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
    titleColor: theme.isDark ? '#f1f5f9' : '#0f172a',
    bodyColor: theme.isDark ? '#cbd5e1' : '#475569',
    borderColor: theme.isDark ? 'rgba(148, 163, 184, 0.25)' : '#e2e8f0',
    borderWidth: 1,
    cornerRadius: 8,
    padding: 12
  }));

  const chartBorderColor = computed(() => (theme.isDark ? '#0f172a' : '#ffffff'));

  return {
    isDark: computed(() => theme.isDark),
    gridColor,
    axisTickColor,
    axisTitleColor,
    legendColor,
    tooltip,
    chartBorderColor
  };
}