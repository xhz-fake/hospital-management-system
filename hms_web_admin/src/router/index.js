import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '工作台' }
        },
        {
          path: 'appointments',
          name: 'Appointments',
          component: () => import('@/views/Appointments.vue'),
          meta: { title: '预约管理' }
        },
        {
          path: 'patients',
          name: 'Patients',
          component: () => import('@/views/Patients.vue'),
          meta: { title: '患者管理' }
        },
        {
          path: 'schedule',
          name: 'Schedule',
          component: () => import('@/views/Schedule.vue'),
          meta: { title: '排班管理' }
        },
        {
          path: 'medical-records',
          name: 'MedicalRecords',
          component: () => import('@/views/MedicalRecords.vue'),
          meta: { title: '病历管理' }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router

