import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import AppNavigation from '../AppNavigation.vue'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/builder', component: { template: '<div>Builder</div>' } },
    { path: '/renderer', component: { template: '<div>Renderer</div>' } }
  ]
})

describe('AppNavigation', () => {
  it('renders navigation links correctly', () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.text()).toContain('Form Builder')
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Builder')
    expect(wrapper.text()).toContain('Renderer')
  })

  it('has correct navigation structure', () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router]
      }
    })

    const links = wrapper.findAll('a')
    expect(links).toHaveLength(4) // Logo + 3 nav links

    // Check router-link components
    const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' })
    expect(routerLinks).toHaveLength(4)
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('nav').classes()).toContain('bg-gray-50')
    expect(wrapper.find('nav').classes()).toContain('shadow-sm')
    expect(wrapper.find('nav').classes()).toContain('border-b')
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(AppNavigation, {
      global: {
        plugins: [router]
      }
    })

    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
  })
})
