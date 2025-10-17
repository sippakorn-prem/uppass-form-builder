<template>
  <div id="app">
    <AppNavigation />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppNavigation from '@/components/AppNavigation.vue';
</script>
