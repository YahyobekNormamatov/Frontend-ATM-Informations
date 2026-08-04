<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 transition-colors"
      :class="{ 'ring-2 ring-purple-500 border-transparent': isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown.down.prevent="openAndFocusFirst"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
      @keydown.escape="close"
    >
      <span
        class="truncate text-left flex-1"
        :class="selectedLabel ? '' : 'text-gray-400 dark:text-slate-500'"
      >
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDown
        class="w-4 h-4 text-gray-400 dark:text-slate-400 transition-transform flex-shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition name="app-select">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden"
        :class="dropUp ? 'bottom-full mb-1.5 mt-0' : 'top-full'"
        role="listbox"
      >
        <div v-if="searchable" class="p-2 border-b border-gray-100 dark:border-slate-700">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            @keydown.escape="close"
            @click.stop
          />
        </div>

        <ul
          class="max-h-64 overflow-y-auto py-1"
          @keydown.escape="close"
        >
          <li
            v-if="filteredOptions.length === 0"
            class="px-4 py-2 text-sm text-gray-400 dark:text-slate-500 text-center"
          >
            Topilmadi
          </li>
          <li
            v-for="option in filteredOptions"
            :key="String(option.value)"
            role="option"
            :aria-selected="option.value === modelValue"
            class="px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between gap-2"
            :class="option.value === modelValue
              ? 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-200 font-medium'
              : 'text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'"
            @click="select(option.value)"
          >
            <span class="truncate">{{ option.label }}</span>
            <Check
              v-if="option.value === modelValue"
              class="w-4 h-4 text-purple-600 dark:text-purple-300 flex-shrink-0"
            />
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { ChevronDown, Check } from 'lucide-vue-next';

export interface AppSelectOption {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: AppSelectOption[];
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
  }>(),
  {
    placeholder: 'Tanlang',
    searchable: false,
    searchPlaceholder: 'Qidirish...'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref('');
const dropUp = ref(false);

const selectedLabel = computed(() => {
  const found = props.options.find((o) => o.value === props.modelValue);
  return found?.label ?? '';
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) return props.options;
  const q = searchQuery.value.trim().toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

function toggle(): void {
  isOpen.value ? close() : open();
}

async function open(): Promise<void> {
  isOpen.value = true;
  searchQuery.value = '';
  await nextTick();
  updateDropDirection();
  if (props.searchable) {
    searchInputRef.value?.focus();
  }
}

function close(): void {
  isOpen.value = false;
}

async function openAndFocusFirst(): Promise<void> {
  if (!isOpen.value) await open();
}

function select(value: string): void {
  emit('update:modelValue', value);
  close();
}

function updateDropDirection(): void {
  const rootEl = rootRef.value;
  if (!rootEl) return;
  const rect = rootEl.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const desiredHeight = 288;
  dropUp.value = spaceBelow < desiredHeight && spaceAbove > spaceBelow;
}

function onDocumentClick(event: MouseEvent): void {
  if (!isOpen.value) return;
  const target = event.target as Node | null;
  if (rootRef.value && target && !rootRef.value.contains(target)) {
    close();
  }
}

function onScrollOrResize(): void {
  if (isOpen.value) updateDropDirection();
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', onDocumentClick);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
  } else {
    document.removeEventListener('mousedown', onDocumentClick);
    window.removeEventListener('scroll', onScrollOrResize, true);
    window.removeEventListener('resize', onScrollOrResize);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentClick);
  window.removeEventListener('scroll', onScrollOrResize, true);
  window.removeEventListener('resize', onScrollOrResize);
});
</script>

<style scoped>
.app-select-enter-active,
.app-select-leave-active {
  transition: opacity 0.12s ease, transform 0.14s ease;
}
.app-select-enter-from,
.app-select-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
