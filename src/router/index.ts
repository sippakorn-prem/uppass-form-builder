import BuilderView from '@/views/BuilderView.vue'
import HomeView from '@/views/HomeView.vue'
import RendererView from '@/views/RendererView.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Define your routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/builder',
    name: 'builder',
    component: BuilderView,
  },
  {
    path: '/renderer',
    name: 'renderer',
    component: RendererView,
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router