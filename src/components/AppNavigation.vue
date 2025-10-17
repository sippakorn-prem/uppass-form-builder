<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Form Builder
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex space-x-1">
          <router-link
            to="/"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'bg-blue-100 text-blue-700': $route.path === '/',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-100': $route.path !== '/'
            }"
          >
            Home
          </router-link>
          <router-link
            to="/builder"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'bg-blue-100 text-blue-700': $route.path === '/builder',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-100': $route.path !== '/builder'
            }"
          >
            Builder
          </router-link>
          <router-link
            to="/renderer"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'bg-blue-100 text-blue-700': $route.path === '/renderer',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-100': $route.path !== '/renderer'
            }"
          >
            Renderer
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Navigation component for the application
</script>
