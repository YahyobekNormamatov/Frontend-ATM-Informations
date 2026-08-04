<template>
  <div class="animate-pulse bg-gray-100 dark:bg-slate-800 rounded-lg" :class="className" :style="style"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  width?: string;
  height?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  className: ''
});

const style = computed(() => ({
  width: props.width,
  height: props.height
}));
</script>
