<template>
  <component
    :is="tag"
    :to="!disabled && to ? to : undefined"
    :type="tag === 'button' ? 'button' : undefined"
    class="cat-card"
    :class="{ 'cat-card--disabled': disabled, 'cat-card--dense': dense }"
    :aria-disabled="disabled"
    @click="onClick"
  >
    <span
      v-if="badge"
      class="cat-card__badge"
      :class="`cat-card__badge--${badgeVariant}`"
    >
      {{ badge }}
    </span>

    <span class="cat-card__icon-wrap">
      <component :is="icon" class="cat-card__icon" />
    </span>

    <span class="cat-card__body">
      <span class="cat-card__title">{{ title }}</span>
      <span class="cat-card__desc">{{ description }}</span>
    </span>

    <span class="cat-card__pulse" aria-hidden="true" />
  </component>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type BadgeVariant = 'live' | 'soon' | 'beta';

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    icon: Component;
    to?: RouteLocationRaw;
    disabled?: boolean;
    badge?: string;
    badgeVariant?: BadgeVariant;
    dense?: boolean;
  }>(),
  {
    disabled: false,
    badgeVariant: 'live',
    dense: false
  }
);

const emit = defineEmits<{
  (e: 'select'): void;
}>();

const tag = computed(() => {
  if (props.disabled) return 'div';
  if (props.to) return 'router-link';
  return 'button';
});

function onClick(): void {
  if (props.disabled) return;
  emit('select');
}
</script>

<style scoped>
.cat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1.1rem;
  border-radius: 14px;
  background: var(--cat-bg,
    linear-gradient(140deg, rgba(255, 255, 255, 0.8) 0%, rgba(239, 246, 255, 0.85) 100%));
  border: 1px solid var(--cat-border, rgba(59, 130, 246, 0.25));
  color: var(--cat-text, #1e293b);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  backdrop-filter: blur(10px);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: var(--cat-shadow, 0 8px 24px -12px rgba(59, 130, 246, 0.25));
}
.cat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 25%, var(--cat-shimmer, rgba(59, 130, 246, 0.14)) 50%, transparent 75%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: -1;
}
.cat-card:hover:not(.cat-card--disabled) {
  transform: translateY(-2px);
  border-color: var(--cat-border-hover, rgba(37, 99, 235, 0.55));
  box-shadow: var(--cat-shadow-hover, 0 14px 32px -12px rgba(37, 99, 235, 0.35));
}
.cat-card:hover:not(.cat-card--disabled)::before {
  transform: translateX(100%);
}

.cat-card--dense {
  padding: 0.7rem 0.9rem;
  gap: 0.7rem;
}

.cat-card--disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.cat-card__badge {
  position: absolute;
  top: 0.5rem;
  right: 0.6rem;
  font-size: 0.62rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.cat-card__badge--live {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.4);
}
.cat-card__badge--soon {
  background: rgba(251, 191, 36, 0.15);
  color: #b45309;
  border: 1px solid rgba(251, 191, 36, 0.4);
}
.cat-card__badge--beta {
  background: rgba(139, 92, 246, 0.15);
  color: #6d28d9;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

.cat-card__icon-wrap {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--cat-icon-bg,
    linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%));
  border: 1px solid var(--cat-icon-border, rgba(59, 130, 246, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cat-icon-color, #2563eb);
  transition: color 0.25s ease, background 0.25s ease;
}
.cat-card:hover:not(.cat-card--disabled) .cat-card__icon-wrap {
  color: var(--cat-icon-color-hover, #ffffff);
  background: var(--cat-icon-bg-hover,
    linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.75) 100%));
}
.cat-card__icon {
  width: 20px;
  height: 20px;
}

.cat-card__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.cat-card__title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cat-title, #0f172a);
  line-height: 1.2;
  letter-spacing: -0.005em;
}
.cat-card__desc {
  font-size: 0.7rem;
  color: var(--cat-desc, #64748b);
  line-height: 1.35;
}

.cat-card__pulse {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #2563eb;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.7);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.cat-card:hover:not(.cat-card--disabled) .cat-card__pulse {
  opacity: 1;
  animation: cat-pulse 1.4s ease-in-out infinite;
}
.cat-card--disabled .cat-card__pulse { display: none; }

@keyframes cat-pulse {
  0%, 100% { transform: translateY(-50%) scale(1); opacity: 1; }
  50% { transform: translateY(-50%) scale(1.6); opacity: 0.4; }
}
</style>
