<template>
  <div class="ai-select" ref="rootRef" :class="{ 'ai-select--open': isOpen }">
    <button
      type="button"
      class="ai-select__trigger"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="ai-select__value" :class="{ 'ai-select__value--placeholder': !selectedLabel || selectedLabel === placeholder }">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDown class="ai-select__arrow" :size="18" />
    </button>

    <Transition name="ai-select">
      <div v-if="isOpen" class="ai-select__panel">
        <div v-if="searchable" class="ai-select__search-wrap">
          <Search :size="15" class="ai-select__search-icon" />
          <input
            ref="searchRef"
            v-model="query"
            type="text"
            :placeholder="searchPlaceholder"
            class="ai-select__search"
            @keydown.esc.prevent="close"
          />
        </div>

        <div class="ai-select__options">
          <button
            v-for="opt in filteredOptions"
            :key="opt.value"
            type="button"
            class="ai-select__option"
            :class="{ 'is-selected': opt.value === modelValue }"
            @click="pick(opt.value)"
          >
            <span class="ai-select__option-label">{{ opt.label }}</span>
            <Check v-if="opt.value === modelValue" :size="16" class="ai-select__check" />
          </button>

          <div v-if="filteredOptions.length === 0" class="ai-select__empty">
            Topilmadi
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { Check, ChevronDown, Search } from 'lucide-vue-next';

interface Option {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: Option[];
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
  }>(),
  {
    placeholder: 'Tanlang...',
    searchable: false,
    searchPlaceholder: 'Qidirish...'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const rootRef = ref<HTMLDivElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const query = ref('');

const selectedLabel = computed(() => {
  const found = props.options.find((o) => o.value === props.modelValue);
  return found?.label ?? '';
});

const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

function toggle(): void {
  if (isOpen.value) close();
  else open();
}

async function open(): Promise<void> {
  isOpen.value = true;
  query.value = '';
  await nextTick();
  if (props.searchable) searchRef.value?.focus();
}

function close(): void {
  isOpen.value = false;
}

function pick(value: string): void {
  emit('update:modelValue', value);
  emit('change', value);
  close();
}

function handleClickOutside(event: MouseEvent): void {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(event.target as Node)) close();
}

function handleEsc(event: KeyboardEvent): void {
  if (event.key === 'Escape') close();
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleEsc);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('keydown', handleEsc);
});
</script>

<style scoped>
.ai-select {
  position: relative;
  width: 100%;
}

/* Trigger button */
.ai-select__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  background: var(--ai-input-bg);
  border: 1px solid var(--ai-border);
  color: var(--ai-text-1);
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  backdrop-filter: blur(6px);
}
.ai-select__trigger:hover {
  border-color: var(--ai-border-strong);
  background: var(--ai-input-bg-strong);
}
.ai-select--open .ai-select__trigger {
  border-color: var(--ai-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18),
              0 0 20px -6px rgba(59, 130, 246, 0.45);
}

.ai-select__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ai-select__value--placeholder {
  color: var(--ai-text-3);
}

.ai-select__arrow {
  color: var(--ai-accent-2);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}
.ai-select--open .ai-select__arrow {
  transform: rotate(180deg);
}

/* Panel */
.ai-select__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 60;
  background: rgba(11, 30, 66, 0.98);
  border: 1px solid var(--ai-border-strong);
  border-radius: 12px;
  box-shadow:
    0 20px 40px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(59, 130, 246, 0.1),
    0 0 32px -8px rgba(59, 130, 246, 0.35);
  backdrop-filter: blur(16px);
  overflow: hidden;
  max-height: 340px;
  display: flex;
  flex-direction: column;
}
html:not(.dark) .ai-select__panel {
  background: rgba(255, 255, 255, 0.98);
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow:
    0 20px 40px -12px rgba(15, 23, 42, 0.2),
    0 0 0 1px rgba(59, 130, 246, 0.15),
    0 0 24px -6px rgba(59, 130, 246, 0.25);
}

/* Search inside panel */
.ai-select__search-wrap {
  position: relative;
  padding: 0.65rem;
  border-bottom: 1px solid var(--ai-border);
}
.ai-select__search-icon {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ai-text-3);
  pointer-events: none;
}
.ai-select__search {
  width: 100%;
  padding: 0.5rem 0.7rem 0.5rem 2rem;
  border-radius: 8px;
  background: var(--ai-input-bg);
  border: 1px solid var(--ai-border);
  color: var(--ai-text-1);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.15s ease;
}
.ai-select__search:focus {
  border-color: var(--ai-accent);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
.ai-select__search::placeholder {
  color: var(--ai-text-3);
}

/* Options list */
.ai-select__options {
  overflow-y: auto;
  padding: 0.3rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.45) transparent;
}
.ai-select__options::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
}
.ai-select__options::-webkit-scrollbar-track {
  background: transparent !important;
  margin: 4px 0;
}
.ai-select__options::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4) !important;
  border-radius: 9999px !important;
  border: 1px solid transparent;
  background-clip: padding-box;
}
.ai-select__options::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.6) !important;
}
html:not(.dark) .ai-select__options {
  scrollbar-color: rgba(37, 99, 235, 0.35) transparent;
}
html:not(.dark) .ai-select__options::-webkit-scrollbar-thumb {
  background: rgba(37, 99, 235, 0.35) !important;
}
html:not(.dark) .ai-select__options::-webkit-scrollbar-thumb:hover {
  background: rgba(37, 99, 235, 0.55) !important;
}

.ai-select__option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--ai-text-2);
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.ai-select__option:hover {
  background: rgba(59, 130, 246, 0.15);
  color: var(--ai-text-1);
}
.ai-select__option.is-selected {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(129, 140, 248, 0.15) 100%);
  color: var(--ai-active-text);
  font-weight: 600;
}

.ai-select__option-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-select__check {
  color: var(--ai-accent);
  flex-shrink: 0;
}

.ai-select__empty {
  padding: 1.5rem 0.75rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--ai-text-3);
}

/* Enter/leave transition */
.ai-select-enter-active,
.ai-select-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.ai-select-enter-from,
.ai-select-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
