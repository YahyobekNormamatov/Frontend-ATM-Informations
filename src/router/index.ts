import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'DashboardAtm',
          component: () => import('@/views/DashboardAtmView.vue')
        },
        {
          path: '/monitoring',
          name: 'AtmMonitoring',
          component: () => import('@/views/AtmMonitoringView.vue')
        },
        {
          path: '/filial-aylanmasi',
          name: 'FilialAylanmasi',
          component: () => import('@/views/FilialAylanmasiView.vue')
        },
        {
          path: '/qurilmalar',
          name: 'Qurilmalar',
          component: () => import('@/views/QurilmalarView.vue')
        },
        {
          path: '/arizalar',
          name: 'Arizalar',
          component: () => import('@/views/ArizalarView.vue')
        },
        {
          path: '/statistika/arizalar',
          name: 'ArizalarStatistika',
          component: () => import('@/views/ArizalarStatistikaView.vue')
        },
        {
          path: '/statistika/modellar',
          name: 'ModellarStatistika',
          component: () => import('@/views/ModellarStatistikaView.vue')
        },
        {
          path: '/ai-analytics',
          name: 'AiAnalytics',
          component: () => import('@/views/AiAnalyticsView.vue')
        }
      ]
    }
  ]
});

export default router;
