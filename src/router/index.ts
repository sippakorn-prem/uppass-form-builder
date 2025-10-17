import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Define your routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router