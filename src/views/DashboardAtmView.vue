<template>
  <div class="space-y-6">
    <div v-if="dashboardStore.isLoading && !dashboardStore.data" class="space-y-6">
      <Skeleton height="10rem" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton v-for="i in 4" :key="i" height="14rem" />
      </div>
    </div>

    <ErrorState
      v-else-if="dashboardStore.error && !dashboardStore.data"
      :message="dashboardStore.error"
      :on-retry="() => dashboardStore.fetchDashboard()"/>

    <template v-else>
      <div class="hero-panel bg-white dark:bg-slate-900 rounded-2xl p-6 text-gray-800 dark:text-slate-100 ring-1 ring-gray-200 dark:ring-slate-800/60">
        <div class="hero-panel__bg" aria-hidden="true">
          <div class="hero-panel__grid"></div>
          <div class="hero-panel__orb hero-panel__orb--1"></div>
          <div class="hero-panel__orb hero-panel__orb--2"></div>
          <div class="hero-panel__orb hero-panel__orb--3"></div>
          <div class="hero-panel__scan"></div>
        </div>
        <div class="hero-panel__content">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-medium text-gray-400">Umumiy pul oqimi va ATM holati</h2>
              <span class="text-xs text-gray-500">Joriy davr</span>
            </div>
            <div class="flex items-center gap-8 flex-wrap">
              <div>
                <p class="label-eyebrow">Jami aylanma</p>
                <p class="text-3xl font-bold text-yellow-500 dark:text-yellow-400 mt-1 tabular-nums" style="letter-spacing:-0.02em; filter: drop-shadow(0 2px 8px rgba(234, 179, 8, 0.3));">
                  {{ formatSumShort(totalTurnover) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">Kirim + Chiqim UZS</p>
              </div>
              <div class="flex gap-6 text-sm flex-wrap">
                <div class="flex items-center gap-2">
                  <span class="text-green-400 text-lg">↑</span>
                  <div>
                    <p class="text-xs text-gray-500">Kirim</p>
                    <p class="text-gray-800 dark:text-gray-100 font-semibold">{{ formatSumShort(finance?.income) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-red-400 text-lg">↓</span>
                  <div>
                    <p class="text-xs text-gray-500">Chiqim</p>
                    <p class="text-gray-800 dark:text-gray-100 font-semibold">{{ formatSumShort(finance?.expense) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-purple-400 text-lg">≈</span>
                  <div>
                    <p class="text-xs text-gray-500">Foyda / zarar</p>
                    <p class="font-semibold" :class="(finance?.profit ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'">
                      {{ formatSumShort(finance?.profit) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-l border-gray-200 dark:border-slate-700 pl-6">
            <p class="label-eyebrow">Tarmoq sozligi</p>

            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-4xl font-bold tabular-nums" style="letter-spacing:-0.03em;" :class="healthColor.text">
                {{ formatPercent(dashboardStore.workingPercentage) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-slate-400">ishlayapti</span>
            </div>

            <div class="mt-2">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" :class="healthColor.dot"></span>
                <span class="text-xs font-medium" :class="healthColor.text">{{ healthLabel }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1 leading-snug">{{ healthHint }}</p>
            </div>

            <div class="mt-3 w-full h-1.5 ai-progress-track">
              <div
                class="ai-progress-fill"
                :class="healthColor.bar"
                :style="{ width: `${dashboardStore.workingPercentage}%` }"
              ></div>
            </div>

            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-green-400"></span>
                <span class="text-gray-400">Soz</span>
                <span class="text-green-400 font-bold tabular-nums">{{ summary?.soz ?? '—' }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-red-400"></span>
                <span class="text-gray-400">Nosoz</span>
                <span class="text-red-400 font-bold tabular-nums">{{ summary?.nosoz ?? '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div class="mini-stat">
            <p class="label-eyebrow">JAMI ATM</p>
            <p class="num-solid text-xl mt-1">{{ summary?.total_atms ?? '—' }}</p>
          </div>
          <div class="mini-stat">
            <p class="label-eyebrow text-green-600 dark:text-green-400">SOZ</p>
            <p class="num-solid text-xl mt-1">{{ summary?.soz ?? '—' }}</p>
          </div>
          <div class="mini-stat">
            <p class="label-eyebrow text-red-600 dark:text-red-400">NOSOZ</p>
            <p class="num-solid text-xl mt-1">{{ summary?.nosoz ?? '—' }}</p>
          </div>
          <div class="mini-stat">
            <p class="label-eyebrow text-purple-600 dark:text-purple-400">UZCARD</p>
            <p class="num-solid text-xl mt-1">{{ summary?.uzcard ?? '—' }}</p>
          </div>
          <div class="mini-stat">
            <p class="label-eyebrow text-teal-600 dark:text-teal-400">HUMO</p>
            <p class="num-solid text-xl mt-1">{{ summary?.humo ?? '—' }}</p>
          </div>
          <div class="mini-stat">
            <p class="label-eyebrow">Soz ulushi</p>
            <p class="num-solid text-xl mt-1">{{ formatPercent(dashboardStore.workingPercentage) }}</p>
          </div>
        </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="JAMI ATM"
          :value="summary?.total_atms ?? '—'"
          :icon="Landmark"
          iconBg="bg-purple-50"
          iconColor="text-purple-600 dark:text-purple-300"
        />
        <StatCard
          title="SOZ"
          :value="summary?.soz ?? '—'"
          :icon="Wifi"
          iconBg="bg-green-50"
          iconColor="text-green-600 dark:text-green-300"
          :progress="dashboardStore.workingPercentage"
          progressLabel="Ishlab turibdi"
        />
        <StatCard
          title="NOSOZ"
          :value="summary?.nosoz ?? '-'"
          :icon="WifiOff"
          iconBg="bg-red-50"
          iconColor="text-red-600 dark:text-red-300"
          :progress="dashboardStore.faultyPercentage"
          progressLabel="jami"
        />
        <StatCard
          title="TA'MIRLASH SARFI"
          :value="formatSumShort(maintenance?.repair_cost)"
          :icon="Wrench"
          iconBg="bg-yellow-50"
          iconColor="text-yellow-600 dark:text-yellow-300"
          :subtitle="`${maintenance?.repair_count ?? 0} ta protokol`"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DonutChartCard
          title="ALOQA DARAJASI"
          :data="{
            labels: ['Soz', 'Nosoz'],
            values: [summary?.soz ?? 0, summary?.nosoz ?? 0],
            colors: ['#10B981', '#EF4444']
          }"
          :legend="[
            { label: 'Soz', value: summary?.soz ?? 0, color: '#10B981' },
            { label: 'Nosoz', value: summary?.nosoz ?? 0, color: '#EF4444' }
          ]"
          legend-suffix=""
          :center-text="{ value: formatPercent(dashboardStore.workingPercentage), label: 'Soz ulushi' }"
        />

        <DonutChartCard
          title="KARTA TARQATISH"
          :data="cardMixData"
          :legend="cardMixLegend"
          :unavailable="!hasCardData"
          empty-message="Karta turi ma'lumoti mavjud emas"
          :center-text="{ value: (summary?.uzcard ?? 0) + (summary?.humo ?? 0), label: 'Jami ATM' }"/>

        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5 lg:col-span-2 flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">Viloyatlar (soz / jami)</h3>
            <span class="text-xs text-gray-400 dark:text-slate-500"></span>
          </div>
          <div v-if="topRegions.length === 0" class="py-6">
            <EmptyState message="Viloyatlar bo'yicha ma'lumot mavjud emas" />
          </div>
          <div
            v-else
            class="space-y-3 overflow-y-auto pr-2 max-h-[240px] custom-scroll"
          >
            <div v-for="region in topRegions" :key="region.region" class="space-y-1">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-700 dark:text-slate-300 font-medium">{{ region.region }}</span>
                <span class="text-gray-500 dark:text-slate-400">
                  <span class="text-green-600 dark:text-green-400 font-semibold">{{ region.soz }}</span>
                  <span class="mx-1 text-gray-300 dark:text-slate-600">/</span>
                  <span>{{ region.total }}</span>
                  <span class="ml-2 text-xs" :class="regionUptimeColor(region)">
                    ({{ formatPercent(regionUptime(region)) }})
                  </span>
                </span>
              </div>
              <div class="ai-progress-track ai-progress-track--sm">
                <div
                  class="ai-progress-fill"
                  :class="regionUptimeBar(region)"
                  :style="{ width: `${regionUptime(region)}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-slate-200">ATM tarmog'i holati</h3>
          <span class="text-sm font-bold text-gray-800 dark:text-slate-100">Jami {{ summary?.total_atms ?? '—' }}</span>
        </div>
        <div class="flex items-center gap-6 flex-wrap">
          <div>
            <p class="text-3xl font-bold text-gray-800 dark:text-slate-100">{{ formatPercent(dashboardStore.workingPercentage) }}</p>
            <p class="text-sm text-gray-500 dark:text-slate-400">Soz holatda</p>
          </div>
          <div class="flex-1 min-w-[200px]">
            <div class="h-2 ai-progress-track relative">
              <div
                class="split-fill split-fill--success"
                :style="{ width: `${dashboardStore.workingPercentage}%` }"
              ></div>
              <div
                class="split-fill split-fill--danger"
                :style="{
                  left: `${Math.max(0, dashboardStore.workingPercentage - 1.5)}%`,
                  width: `${dashboardStore.faultyPercentage + 1.5}%`
                }"
              ></div>
            </div>
            <div class="flex flex-wrap gap-4 mt-3 text-xs">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <span class="text-gray-600 dark:text-slate-300">Soz {{ formatPercent(dashboardStore.workingPercentage) }}</span>
                <span class="text-gray-400 dark:text-slate-500">({{ summary?.soz ?? 0 }})</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                <span class="text-gray-600 dark:text-slate-300">Nosoz {{ formatPercent(dashboardStore.faultyPercentage) }}</span>
                <span class="text-gray-400 dark:text-slate-500">({{ summary?.nosoz ?? 0 }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import StatCard from '@/components/dashboard/StatCard.vue';
import DonutChartCard from '@/components/dashboard/DonutChartCard.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { Landmark, Wifi, WifiOff, Wrench } from 'lucide-vue-next';
import { formatPercent, formatSumShort, safePercentage } from '@/utils/format';
import { onRefresh } from '@/composables/useRefreshBus';
import type { DashboardRegionStat } from '@/types/api';

const dashboardStore = useDashboardStore();

const summary = computed(() => dashboardStore.summary);
const finance = computed(() => dashboardStore.finance);
const maintenance = computed(() => dashboardStore.maintenance);
const topRegions = computed(() => dashboardStore.topRegions);

const totalTurnover = computed(() => {
  if (!finance.value) return null;
  return finance.value.income + finance.value.expense;
});

const healthLabel = computed(() => {
  const p = dashboardStore.workingPercentage;
  if (p >= 90) return "A'lo holatda";
  if (p >= 80) return 'Yaxshi';
  if (p >= 70) return "O'rtacha";
  if (p >= 50) return 'Diqqat talab qiladi';
  return 'Xavotirli holat';
});

const healthHint = computed(() => {
  const p = dashboardStore.workingPercentage;
  if (p >= 80) return "tarmoq barqaror ishlamoqda";
  if (p >= 70) return 'nazorat ostida ushlash tavsiya etiladi';
  if (p >= 50) return "aralashuv talab qilinadi";
  return "shoshilinch chora ko'ring";
});

const healthColor = computed(() => {
  const p = dashboardStore.workingPercentage;
  if (p >= 85) return {
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-400',
    bar: 'ai-progress-fill--success'
  };
  if (p >= 70) return {
    text: 'text-yellow-600 dark:text-yellow-400',
    dot: 'bg-yellow-400',
    bar: 'ai-progress-fill--warning'
  };
  return {
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-400',
    bar: 'ai-progress-fill--danger'
  };
});

const hasCardData = computed(() => (summary.value?.uzcard ?? 0) + (summary.value?.humo ?? 0) > 0);
const cardMixData = computed(() => {
  const uzcard = summary.value?.uzcard ?? 0;
  const humo = summary.value?.humo ?? 0;
  return {
    labels: ['UZCARD', 'HUMO'],
    values: [uzcard, humo],
    colors: ['#7C4DFF', '#00BFA5']
  };
});

const cardMixLegend = computed(() => {
  const total = (summary.value?.uzcard ?? 0) + (summary.value?.humo ?? 0);
  const asPct = (v: number) => (total ? Math.round((v / total) * 100) : 0);
  return [
    { label: 'UZCARD', value: asPct(summary.value?.uzcard ?? 0), color: '#7C4DFF' },
    { label: 'HUMO', value: asPct(summary.value?.humo ?? 0), color: '#00BFA5' }
  ];
});

function regionUptime(r: DashboardRegionStat): number {
  return safePercentage(r.soz ?? 0, r.total);
}
function regionUptimeColor(r: DashboardRegionStat): string {
  const u = regionUptime(r);
  if (u >= 80) return 'text-green-600 dark:text-green-400';
  if (u >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}
function regionUptimeBar(r: DashboardRegionStat): string {
  const u = regionUptime(r);
  if (u >= 80) return 'ai-progress-fill--success';
  if (u >= 50) return 'ai-progress-fill--warning';
  return 'ai-progress-fill--danger';
}

onMounted(() => {
  dashboardStore.fetchDashboard();
});

onRefresh(() => dashboardStore.fetchDashboard());
</script>

<style scoped>
/* Hero panel — AI Analytics style animated background */
.hero-panel {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.hero-panel__content {
  position: relative;
  z-index: 2;
}
.hero-panel__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Tech grid pattern */
.hero-panel__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%);
  animation: hero-grid-pan 30s linear infinite;
}
html:not(.dark) .hero-panel__grid {
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
}

/* Animated glow orbs */
.hero-panel__orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  mix-blend-mode: screen;
  opacity: 0.55;
}
html:not(.dark) .hero-panel__orb {
  mix-blend-mode: multiply;
  opacity: 0.3;
}

.hero-panel__orb--1 {
  width: 420px;
  height: 420px;
  top: -30%;
  left: 15%;
  background: radial-gradient(circle, #2563eb 0%, transparent 65%);
  animation: hero-orb-drift-1 20s ease-in-out infinite;
}
html:not(.dark) .hero-panel__orb--1 {
  background: radial-gradient(circle, #93c5fd 0%, transparent 65%);
}

.hero-panel__orb--2 {
  width: 360px;
  height: 360px;
  bottom: -20%;
  right: 20%;
  background: radial-gradient(circle, #7c3aed 0%, transparent 65%);
  animation: hero-orb-drift-2 26s ease-in-out infinite;
}
html:not(.dark) .hero-panel__orb--2 {
  background: radial-gradient(circle, #ddd6fe 0%, transparent 65%);
}

.hero-panel__orb--3 {
  width: 300px;
  height: 300px;
  top: 40%;
  right: -10%;
  background: radial-gradient(circle, #0ea5e9 0%, transparent 65%);
  animation: hero-orb-drift-3 22s ease-in-out infinite 3s;
}
html:not(.dark) .hero-panel__orb--3 {
  background: radial-gradient(circle, #a5f3fc 0%, transparent 65%);
}

/* Slow horizontal scan line */
.hero-panel__scan {
  position: absolute;
  left: -20%;
  right: -20%;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(96, 165, 250, 0.55) 50%,
    transparent 100%
  );
  animation: hero-scan 8s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes hero-grid-pan {
  from { background-position: 0 0, 0 0; }
  to   { background-position: 48px 48px, 48px 48px; }
}

@keyframes hero-orb-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(60px, 30px) scale(1.08); }
}
@keyframes hero-orb-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-50px, -25px) scale(1.1); }
}
@keyframes hero-orb-drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-40px, 30px) scale(1.05); }
}

@keyframes hero-scan {
  0%   { transform: translateY(-140px); opacity: 0; }
  20%  { opacity: 0.6; }
  50%  { transform: translateY(0); opacity: 0.9; }
  80%  { opacity: 0.6; }
  100% { transform: translateY(140px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-panel__grid,
  .hero-panel__orb,
  .hero-panel__scan {
    animation: none;
  }
}

/* Mini stat inside hero widget */
.mini-stat {
  padding: 0.35rem 0.65rem 0.5rem;
  border-radius: 10px;
  transition: background 0.25s ease, transform 0.2s ease;
}
.mini-stat:hover {
  background: rgba(59, 130, 246, 0.08);
  transform: translateY(-1px);
}

/* Network health split bar — two rounded segments */
.split-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 9999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.split-fill::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 55%);
  border-radius: inherit;
}

.split-fill--success {
  left: 0;
  background: linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%);
  box-shadow:
    0 0 14px rgba(16, 185, 129, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.split-fill--danger {
  background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
  box-shadow:
    0 0 14px rgba(239, 68, 68, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 2;
}

.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.4) transparent;
}
.custom-scroll::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent !important;
  margin: 4px 0;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4) !important;
  border-radius: 9999px !important;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.65) !important;
}
:global(html:not(.dark)) .custom-scroll {
  scrollbar-color: rgba(37, 99, 235, 0.35) transparent;
}
:global(html:not(.dark)) .custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.35) !important;
}
:global(html:not(.dark)) .custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(37, 99, 235, 0.55) !important;
}
</style>