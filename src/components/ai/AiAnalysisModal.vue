<template>
  <Teleport to="body">
    <Transition name="ai-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="close"
      >
        <div
          class="w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-slate-800 flex flex-col overflow-hidden"
        >
          <div class="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                <Sparkles class="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div class="min-w-0">
                <h2 :id="titleId" class="text-base font-semibold text-gray-800 dark:text-slate-100">
                  AI tahlili
                </h2>
                <p class="text-sm text-gray-500 dark:text-slate-400 truncate" :title="atmName ?? ''">
                  {{ atmName || 'ATM' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Yopish"
              @click="close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <div
              v-if="atmStore.isAiAnalysisLoading"
              class="flex flex-col items-center justify-center py-14 text-center"
            >
              <div class="ai-loader" aria-label="Yuklanmoqda">
                <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="ai-orb-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#c084fc" />
                      <stop offset="60%" stop-color="#8b5cf6" />
                      <stop offset="100%" stop-color="#6d28d9" />
                    </radialGradient>
                    <linearGradient id="ai-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#a855f7" />
                      <stop offset="50%" stop-color="#ec4899" />
                      <stop offset="100%" stop-color="#a855f7" />
                    </linearGradient>
                  </defs>

                  <circle cx="60" cy="60" r="42" fill="none" stroke="url(#ai-ring-grad)" stroke-width="2" stroke-linecap="round" stroke-dasharray="80 300" class="ai-orbit-outer" />
                  <circle cx="60" cy="60" r="32" fill="none" stroke="url(#ai-ring-grad)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="40 200" class="ai-orbit-inner" />

                  <circle cx="60" cy="60" r="14" fill="url(#ai-orb-grad)" class="ai-orb-core" />
                  <circle cx="60" cy="60" r="22" fill="url(#ai-orb-grad)" opacity="0.25" class="ai-orb-halo" />
                  <circle cx="60" cy="18" r="3.5" fill="#ec4899" class="ai-particle ai-particle-1" />
                  <circle cx="102" cy="60" r="2.5" fill="#a855f7" class="ai-particle ai-particle-2" />
                  <circle cx="60" cy="102" r="3" fill="#c084fc" class="ai-particle ai-particle-3" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-gray-800 dark:text-slate-100 mt-2">
                Sun'iy intellekt tahlil qilmoqda
                <span class="ai-dots">
                  <span></span><span></span><span></span>
                </span>
              </p>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-1.5 max-w-xs">
                Ma'lumotlar tahlil qilinmoqda, bu bir necha daqiqa davom etishi mumkin
              </p>
            </div>
            <div
              v-else-if="atmStore.aiAnalysisError"
              class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/15 flex items-center justify-center mb-3">
                <AlertCircle class="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p class="text-sm font-medium text-gray-800 dark:text-slate-100">
                Tahlilni olib bo'lmadi
              </p>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-md">
                {{ atmStore.aiAnalysisError }}
              </p>
              <button
                type="button"
                class="mt-4 px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                @click="retry"
              >
                Qayta urinish
              </button>
            </div>

            <article
              v-else-if="analysisText"
              class="prose-ai"
              v-html="renderedAnalysis"
            ></article>

            <div v-else class="py-12 text-center text-sm text-gray-500 dark:text-slate-400">
              Tahlil mavjud emas.
            </div>
          </div>

          <div
            v-if="analysisText && !atmStore.isAiAnalysisLoading"
            class="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40"
          >
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/15 hover:bg-purple-100 dark:hover:bg-purple-500/25 rounded-lg transition-colors"
              @click="retry"
            >
              Qayta tahlil qilish
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { Sparkles, X, AlertCircle } from 'lucide-vue-next';
import { useAtmStore } from '@/stores/atmStore';

let modalCounter = 0;

const props = defineProps<{
  open: boolean;
  atmId: number | null;
  atmName?: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const atmStore = useAtmStore();
const titleId = `ai-modal-title-${++modalCounter}`;

const analysisText = computed<string | null>(() => {
  if (props.atmId == null) return null;
  return atmStore.aiAnalysisCache.get(props.atmId) ?? null;
});

const renderedAnalysis = computed(() => renderAnalysis(analysisText.value ?? ''));

function close(): void {
  emit('update:open', false);
}

function retry(): void {
  if (props.atmId == null) return;
  atmStore.fetchAiAnalysis(props.atmId, true);
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) {
    event.preventDefault();
    close();
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeydown);
      if (props.atmId != null && !atmStore.aiAnalysisCache.has(props.atmId)) {
        atmStore.fetchAiAnalysis(props.atmId);
      }
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeydown);
    }
  }
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
});

function renderAnalysis(text: string): string {
  if (!text) return '';

  const escapeHtml = (s: string): string =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const inline = (s: string): string =>
    s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const escaped = escapeHtml(text);
  const sections = escaped.split(/\n\n-{3,}\n\n/);

  const renderedSections = sections.map((section) => {
    const lines = section.split('\n');
    const html: string[] = [];
    let inList = false;

    const closeList = () => {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
    };

    for (const raw of lines) {
      const line = raw.replace(/\s+$/g, '');
      const trimmed = line.trim();
      if (!trimmed) {
        closeList();
        continue;
      }

      if (/^-\s+/.test(trimmed)) {
        if (!inList) {
          html.push('<ul>');
          inList = true;
        }
        html.push(`<li>${inline(trimmed.replace(/^-\s+/, ''))}</li>`);
        continue;
      }

      closeList();
      const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numbered) {
        html.push(`<h3><span class="ai-num">${numbered[1]}.</span> ${inline(numbered[2])}</h3>`);
      } else {
        html.push(`<p>${inline(trimmed)}</p>`);
      }
    }

    closeList();
    return html.join('');
  });

  return renderedSections.join('<hr />');
}
</script>

<style>
.ai-modal-enter-active,
.ai-modal-leave-active {
  transition: opacity 0.18s ease;
}
.ai-modal-enter-active > div,
.ai-modal-leave-active > div {
  transition: transform 0.22s ease, opacity 0.18s ease;
}
.ai-modal-enter-from,
.ai-modal-leave-to {
  opacity: 0;
}
.ai-modal-enter-from > div,
.ai-modal-leave-to > div {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}

.prose-ai {
  color: rgb(31 41 55);
  font-size: 0.925rem;
  line-height: 1.7;
}
.dark .prose-ai {
  color: rgb(226 232 240);
}
.prose-ai h3 {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(17 24 39);
  margin: 1.25rem 0 0.5rem;
  letter-spacing: -0.01em;
}
.dark .prose-ai h3 {
  color: rgb(248 250 252);
}
.prose-ai h3:first-child {
  margin-top: 0;
}
.prose-ai .ai-num {
  color: rgb(147 51 234);
  margin-right: 0.35rem;
  font-weight: 700;
}
.dark .prose-ai .ai-num {
  color: rgb(196 154 255);
}
.prose-ai p {
  margin: 0.55rem 0;
  color: rgb(51 65 85);
}
.dark .prose-ai p {
  color: rgb(226 232 240);
}
.prose-ai strong {
  color: rgb(17 24 39);
  font-weight: 700;
}
.dark .prose-ai strong {
  color: rgb(248 250 252);
}
.prose-ai ul {
  margin: 0.6rem 0;
  padding-left: 1.25rem;
  list-style: none;
}
.prose-ai li {
  position: relative;
  padding-left: 0.9rem;
  margin: 0.35rem 0;
  color: rgb(51 65 85);
}
.dark .prose-ai li {
  color: rgb(226 232 240);
}
.prose-ai li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65rem;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
  background-color: rgb(147 51 234);
}
.dark .prose-ai li::before {
  background-color: rgb(196 154 255);
}
.prose-ai hr {
  border: none;
  border-top: 1px dashed rgb(203 213 225);
  margin: 1.5rem 0;
}
.dark .prose-ai hr {
  border-top-color: rgb(71 85 105);
}

.ai-loader {
  filter: drop-shadow(0 4px 24px rgba(139, 92, 246, 0.35));
}
.ai-orb-core {
  transform-origin: 60px 60px;
  animation: ai-pulse 1.8s ease-in-out infinite;
}
.ai-orb-halo {
  transform-origin: 60px 60px;
  animation: ai-halo 2.4s ease-in-out infinite;
}
.ai-orbit-outer {
  transform-origin: 60px 60px;
  animation: ai-spin 3s linear infinite;
}
.ai-orbit-inner {
  transform-origin: 60px 60px;
  animation: ai-spin-rev 2.2s linear infinite;
}
.ai-particle {
  transform-origin: 60px 60px;
}
.ai-particle-1 {
  animation: ai-orbit-1 3s linear infinite;
}
.ai-particle-2 {
  animation: ai-orbit-2 2.4s linear infinite;
}
.ai-particle-3 {
  animation: ai-orbit-3 3.6s linear infinite;
}
@keyframes ai-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.9; }
}
@keyframes ai-halo {
  0%, 100% { transform: scale(1); opacity: 0.25; }
  50% { transform: scale(1.35); opacity: 0.05; }
}
@keyframes ai-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes ai-spin-rev {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes ai-orbit-1 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes ai-orbit-2 {
  from { transform: rotate(120deg); }
  to { transform: rotate(480deg); }
}
@keyframes ai-orbit-3 {
  from { transform: rotate(240deg); }
  to { transform: rotate(600deg); }
}

.ai-dots {
  display: inline-flex;
  gap: 3px;
  margin-left: 4px;
  vertical-align: middle;
}
.ai-dots span {
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background-color: rgb(147 51 234);
  animation: ai-dot 1.2s ease-in-out infinite;
}
.dark .ai-dots span {
  background-color: rgb(196 154 255);
}
.ai-dots span:nth-child(2) { animation-delay: 0.15s; }
.ai-dots span:nth-child(3) { animation-delay: 0.3s; }
@keyframes ai-dot {
  0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}
</style>
