<template>
  <div class="ai-portal" :class="{ 'ai-portal--dark': themeStore.isDark }">
    <AiHeroBackground :is-dark="themeStore.isDark" />

    <div class="ai-portal__content">
      <header class="ai-portal__header">
        <div class="ai-portal__title-wrap">
          <span class="ai-portal__eyebrow">Turon Bank</span>
          <h1 class="ai-portal__title">
            AI <span class="ai-portal__title-accent">Bankomat</span>
          </h1>
          <p class="ai-portal__subtitle">
            Bankomat tizimining sun'iy intellekt portali
          </p>
        </div>
      </header>

      <section class="ai-portal__hero">
        <div class="ai-portal__side ai-portal__side--left">
          <AiCategoryCard
            v-for="c in leftCards"
            :key="c.title"
            v-bind="c"
          />
        </div>

        <div class="ai-portal__emblem-wrap">
          <AiHeroEmblem />
          <div class="ai-portal__hero-badge">AI xizmatlar</div>
        </div>

        <div class="ai-portal__side ai-portal__side--right">
          <AiCategoryCard
            v-for="c in rightCards"
            :key="c.title"
            v-bind="c"
          />
        </div>
      </section>

      <section class="ai-portal__section">
        <div class="ai-portal__section-header">
          <span class="ai-portal__section-title">Filiallar bo'yicha</span>
        </div>

        <div class="ai-portal__branches">
          <div
            v-for="b in branchStats"
            :key="b.name"
            class="branch-tile"
          >
            <div class="branch-tile__name">{{ b.name }}</div>
            <div class="branch-tile__value">{{ b.value }}</div>
            <div class="branch-tile__label">{{ b.label }}</div>
            <div class="branch-tile__bar">
              <div class="branch-tile__bar-fill" :style="{ width: b.percent + '%' }" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  AlertTriangle,
  Building2,
  LineChart,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Wallet,
  Wrench
} from 'lucide-vue-next';
import AiHeroBackground from '@/components/ai/AiHeroBackground.vue';
import AiHeroEmblem from '@/components/ai/AiHeroEmblem.vue';
import AiCategoryCard from '@/components/ai/AiCategoryCard.vue';
import { useAtmStore } from '@/stores/atmStore';
import { useThemeStore } from '@/stores/themeStore';

const atmStore = useAtmStore();
const themeStore = useThemeStore();

const leftCards = [
  {
    title: 'AI Bankomat',
    description: 'Bankomat faoliyati bo\'yicha AI tahlil va tavsiyalar',
    icon: Sparkles,
    to: { name: 'AtmAiList' },
    badge: 'LIVE',
    badgeVariant: 'live' as const
  },
  {
    title: 'AI Xavf Baholash',
    description: 'Xavf darajasini AI orqali baholash tizimi',
    icon: ShieldAlert,
    disabled: true,
    badge: 'SOON',
    badgeVariant: 'soon' as const
  },
  {
    title: 'AI Anomaliyalar',
    description: 'Anomaliyalarni real vaqtda aniqlash',
    icon: AlertTriangle,
    disabled: true,
    badge: 'SOON',
    badgeVariant: 'soon' as const
  },
  {
    title: 'AI Servis Xarajatlari',
    description: 'Servis xarajatlarini optimallashtirish tavsiyalari',
    icon: Wallet,
    disabled: true,
    badge: 'SOON',
    badgeVariant: 'soon' as const
  }
];

const rightCards = [
  {
    title: 'AI Prognoz',
    description: 'Keyingi oy uchun moliyaviy prognoz',
    icon: TrendingUp,
    disabled: true,
    badge: 'SOON',
    badgeVariant: 'soon' as const
  },
  {
    title: 'AI Filiallar',
    description: 'Filiallar aylanmasi bo\'yicha AI tahlil',
    icon: Building2,
    disabled: true,
    badge: 'SOON',
    badgeVariant: 'soon' as const
  },
  {
    title: 'AI Trend Tahlili',
    description: 'Daromad va xarajat trendlarini AI aniqlaydi',
    icon: LineChart,
    disabled: true,
    badge: 'SOON',
    badgeVariant: 'soon' as const
  },
  {
    title: 'AI Texnik Holat',
    description: 'ATM texnik holatini bashorat qilish',
    icon: Wrench,
    disabled: true,
    badge: 'SOON',
    badgeVariant: 'soon' as const
  }
];

onMounted(() => {
  atmStore.fetchAllAtms();
});

const branchStats = computed(() => {
  const items = atmStore.allAtms ?? [];
  const byRegion = new Map<string, number>();
  for (const a of items) {
    if (!a.region) continue;
    byRegion.set(a.region, (byRegion.get(a.region) ?? 0) + 1);
  }
  const list = Array.from(byRegion, ([name, count]) => ({ name, count }));
  const max = list.reduce((m, i) => Math.max(m, i.count), 1);
  return list
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((i) => ({
      name: i.name,
      value: i.count.toLocaleString('uz-UZ'),
      label: 'ta bankomat',
      percent: Math.round((i.count / max) * 100)
    }));
});
</script>

<style scoped>
/* --------------------------------------------------------------------
   Light theme (default) — CSS variables cascade into child components
-------------------------------------------------------------------- */
.ai-portal {
  position: relative;
  min-height: calc(100vh - 8rem);
  margin: -1.5rem;
  padding: 2rem 1.5rem 3rem;
  border-radius: 16px;
  overflow: hidden;
  color: #1e293b;
  transition: color 0.4s ease;

  /* Emblem tokens — cascade into AiHeroEmblem */
  --emblem-wing-c1: #60a5fa;
  --emblem-wing-c2: #2563eb;
  --emblem-wing-c3: #7c3aed;
  --emblem-particle: #2563eb;
  --emblem-ring-outer: rgba(37, 99, 235, 0.25);
  --emblem-ring: rgba(37, 99, 235, 0.45);
  --emblem-ring-inner: rgba(37, 99, 235, 0.65);
  --emblem-ring-glow: rgba(37, 99, 235, 0.35);
  --emblem-ring-glow-strong: rgba(37, 99, 235, 0.55);
  --emblem-logo-bg: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.85) 100%);
  --emblem-logo-border: rgba(37, 99, 235, 0.55);
  --emblem-logo-glow: rgba(37, 99, 235, 0.4);
  --emblem-logo-color: #1e40af;
  --emblem-logo-shadow: rgba(37, 99, 235, 0.55);
  --emblem-logo-shadow-strong: rgba(37, 99, 235, 0.9);
  --emblem-halo: rgba(59, 130, 246, 0.22);

  /* Category card tokens */
  --cat-bg: linear-gradient(140deg, rgba(255, 255, 255, 0.85) 0%, rgba(239, 246, 255, 0.9) 100%);
  --cat-border: rgba(59, 130, 246, 0.25);
  --cat-border-hover: rgba(37, 99, 235, 0.55);
  --cat-shadow: 0 8px 24px -12px rgba(59, 130, 246, 0.25);
  --cat-shadow-hover: 0 14px 32px -12px rgba(37, 99, 235, 0.35);
  --cat-shimmer: rgba(59, 130, 246, 0.14);
  --cat-title: #0f172a;
  --cat-desc: #64748b;
  --cat-icon-bg: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%);
  --cat-icon-border: rgba(59, 130, 246, 0.3);
  --cat-icon-color: #2563eb;
  --cat-icon-bg-hover: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.75) 100%);
  --cat-icon-color-hover: #ffffff;
}

/* --------------------------------------------------------------------
   Dark theme override
-------------------------------------------------------------------- */
.ai-portal--dark {
  color: #e2e8f0;

  --emblem-wing-c1: #0ea5e9;
  --emblem-wing-c2: #38bdf8;
  --emblem-wing-c3: #818cf8;
  --emblem-particle: #7dd3fc;
  --emblem-ring-outer: rgba(59, 130, 246, 0.18);
  --emblem-ring: rgba(96, 165, 250, 0.35);
  --emblem-ring-inner: rgba(147, 197, 253, 0.55);
  --emblem-ring-glow: rgba(59, 130, 246, 0.45);
  --emblem-ring-glow-strong: rgba(96, 165, 250, 0.7);
  --emblem-logo-bg: radial-gradient(circle, rgba(30, 58, 138, 0.55) 0%, rgba(2, 6, 23, 0.6) 100%);
  --emblem-logo-border: rgba(96, 165, 250, 0.5);
  --emblem-logo-glow: rgba(59, 130, 246, 0.55);
  --emblem-logo-color: #93c5fd;
  --emblem-logo-shadow: rgba(96, 165, 250, 0.7);
  --emblem-logo-shadow-strong: rgba(147, 197, 253, 1);
  --emblem-halo: rgba(59, 130, 246, 0.45);

  --cat-bg: linear-gradient(140deg, rgba(15, 40, 90, 0.55) 0%, rgba(3, 12, 34, 0.75) 100%);
  --cat-border: rgba(96, 165, 250, 0.22);
  --cat-border-hover: rgba(147, 197, 253, 0.55);
  --cat-shadow: 0 8px 30px -12px rgba(0, 0, 0, 0.6);
  --cat-shadow-hover: 0 14px 40px -12px rgba(59, 130, 246, 0.45);
  --cat-shimmer: rgba(96, 165, 250, 0.18);
  --cat-title: #f1f5f9;
  --cat-desc: rgba(203, 213, 225, 0.75);
  --cat-icon-bg: linear-gradient(135deg, rgba(59, 130, 246, 0.35) 0%, rgba(37, 99, 235, 0.15) 100%);
  --cat-icon-border: rgba(96, 165, 250, 0.35);
  --cat-icon-color: #bfdbfe;
  --cat-icon-bg-hover: linear-gradient(135deg, rgba(59, 130, 246, 0.55) 0%, rgba(37, 99, 235, 0.35) 100%);
  --cat-icon-color-hover: #ffffff;
}

.ai-portal__content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.ai-portal__header {
  text-align: center;
  padding-top: 1rem;
}
.ai-portal__title-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Eyebrow chip — light default */
.ai-portal__eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #1e40af;
  padding: 0.3rem 0.9rem;
  border: 1px solid rgba(37, 99, 235, 0.35);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  transition: color 0.4s ease, background 0.4s ease, border-color 0.4s ease;
}
.ai-portal--dark .ai-portal__eyebrow {
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.35);
  background: rgba(30, 58, 138, 0.25);
}

.ai-portal__title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #0f172a;
  text-shadow: 0 2px 20px rgba(37, 99, 235, 0.15);
  transition: color 0.4s ease, text-shadow 0.4s ease;
}
.ai-portal--dark .ai-portal__title {
  color: #f8fafc;
  text-shadow: 0 4px 24px rgba(30, 58, 138, 0.6);
}

.ai-portal__title-accent {
  background: linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #db2777 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 12px rgba(37, 99, 235, 0.35));
}
.ai-portal--dark .ai-portal__title-accent {
  background: linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 12px rgba(96, 165, 250, 0.5));
}

.ai-portal__subtitle {
  font-size: 0.95rem;
  color: #64748b;
  max-width: 520px;
  line-height: 1.5;
  transition: color 0.4s ease;
}
.ai-portal--dark .ai-portal__subtitle {
  color: rgba(203, 213, 225, 0.8);
}

/* Hero — 3 columns */
.ai-portal__hero {
  display: grid;
  grid-template-columns: 1fr minmax(280px, 720px) 1fr;
  gap: 1.5rem;
  align-items: center;
}
.ai-portal__side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.ai-portal__emblem-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Hero badge — vibrant gradient (works for both themes) */
.ai-portal__hero-badge {
  position: relative;
  z-index: 1;
  margin-top: -1.5rem;
  padding: 0.55rem 1.6rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #f8fafc;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  border: 1px solid rgba(147, 197, 253, 0.45);
  box-shadow:
    0 10px 30px -8px rgba(59, 130, 246, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
.ai-portal--dark .ai-portal__hero-badge {
  background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%);
  box-shadow:
    0 10px 30px -8px rgba(59, 130, 246, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

/* Section title */
.ai-portal__section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.ai-portal__section-header {
  display: flex;
  justify-content: center;
}
.ai-portal__section-title {
  padding: 0.55rem 1.6rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #f8fafc;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  border: 1px solid rgba(147, 197, 253, 0.4);
  box-shadow: 0 6px 18px -6px rgba(59, 130, 246, 0.4);
}
.ai-portal--dark .ai-portal__section-title {
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(76, 29, 149, 0.7) 100%);
  border: 1px solid rgba(147, 197, 253, 0.35);
  backdrop-filter: blur(6px);
}

/* Branches */
.ai-portal__branches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.branch-tile {
  padding: 1.1rem 1rem;
  border-radius: 14px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.85) 0%, rgba(239, 246, 255, 0.9) 100%);
  border: 1px solid rgba(59, 130, 246, 0.22);
  color: #1e293b;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: border-color 0.25s ease, transform 0.25s ease, background 0.4s ease, color 0.4s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 18px -12px rgba(59, 130, 246, 0.3);
}
.branch-tile:hover {
  border-color: rgba(37, 99, 235, 0.55);
  transform: translateY(-2px);
}
.ai-portal--dark .branch-tile {
  background: linear-gradient(160deg, rgba(15, 40, 90, 0.5) 0%, rgba(3, 12, 34, 0.7) 100%);
  border-color: rgba(96, 165, 250, 0.22);
  color: #e2e8f0;
  box-shadow: 0 6px 18px -12px rgba(0, 0, 0, 0.5);
}
.ai-portal--dark .branch-tile:hover {
  border-color: rgba(147, 197, 253, 0.5);
}

.branch-tile__name {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}
.ai-portal--dark .branch-tile__name {
  color: rgba(203, 213, 225, 0.7);
}

.branch-tile__value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1;
}
.ai-portal--dark .branch-tile__value {
  color: #f8fafc;
}

.branch-tile__label {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-bottom: 0.3rem;
}
.ai-portal--dark .branch-tile__label {
  color: rgba(203, 213, 225, 0.6);
}

.branch-tile__bar {
  height: 4px;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.15);
  overflow: hidden;
}
.branch-tile__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  border-radius: 9999px;
  transition: width 0.6s ease;
}
.ai-portal--dark .branch-tile__bar-fill {
  background: linear-gradient(90deg, #38bdf8, #818cf8);
}

/* Responsive */
@media (max-width: 1024px) {
  .ai-portal__hero {
    grid-template-columns: 1fr;
  }
  .ai-portal__side {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .ai-portal__side > * {
    flex: 1 1 260px;
  }
  .ai-portal__emblem-wrap {
    order: -1;
  }
}
</style>
