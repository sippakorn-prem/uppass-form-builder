<template>
  <nav class="bg-gray-50 shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-black hover:text-gray-700 transition-colors">
            Form Builder
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex space-x-1">
          <router-link
            to="/"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'bg-gray-200 text-black': $route.path === '/',
              'text-black hover:text-gray-700 hover:bg-gray-100': $route.path !== '/'
            }"
          >
            Home
          </router-link>
          <router-link
            to="/builder"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'bg-gray-200 text-black': $route.path === '/builder',
              'text-black hover:text-gray-700 hover:bg-gray-100': $route.path !== '/builder'
            }"
          >
            Builder
          </router-link>
          <router-link
            to="/renderer"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{
              'bg-gray-200 text-black': $route.path === '/renderer',
              'text-black hover:text-gray-700 hover:bg-gray-100': $route.path !== '/renderer'
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
