<template>
  <div class="relative min-h-screen">
    <!-- Global ambient background (glows + grid) -->
    <div class="app-ambient" aria-hidden="true">
      <div class="app-ambient__grid" />
    </div>

    <div class="relative z-10 flex min-h-screen">
      <Sidebar />
      <div class="flex-1 ml-64 min-w-0">
        <Navbar />
        <main class="p-6">
          <router-view />
        </main>
        <FloatingBadge />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/common/Sidebar.vue';
import Navbar from '@/components/common/Navbar.vue';
import FloatingBadge from '@/components/common/FloatingBadge.vue';
</script>
