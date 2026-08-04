<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
    <Sidebar />
    <div class="flex-1 ml-64 min-w-0">
      <Navbar />
      <main class="p-6">
        <router-view />
      </main>
      <FloatingBadge />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/common/Sidebar.vue';
import Navbar from '@/components/common/Navbar.vue';
import FloatingBadge from '@/components/common/FloatingBadge.vue';
</script>
