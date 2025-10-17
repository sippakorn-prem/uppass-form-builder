<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-8">
      <Transition name="fade-in">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <!-- Form Renderer only -->
          <FormRenderer v-if="formStore.currentSchema" />
          <div v-else class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg">No form schema loaded</p>
            <p class="text-sm mt-2">Use the Builder to load or create a schema.</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormRenderer from '@/components/FormRenderer.vue';
import { useFormStore } from '@/stores/formStore';
import { onMounted } from 'vue';

const formStore = useFormStore()

// Simplified - no auto-loading
onMounted(() => {
  // No localStorage loading for simplicity
})
</script>

<style scoped>
.fade-in-enter-from, .fade-in-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.fade-in-enter-active, .fade-in-leave-active {
  transition: all 300ms ease;
}
</style>
