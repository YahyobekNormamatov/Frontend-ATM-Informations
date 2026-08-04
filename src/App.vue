<template>
  <div id="app">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import ToastContainer from '@/components/common/ToastContainer.vue';
</script>

<style>
</style>