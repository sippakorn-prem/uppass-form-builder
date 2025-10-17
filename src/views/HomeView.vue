<template>
    <div class="p-8 space-y-8 bg-gradient-to-b from-gray-100 to-white min-h-screen flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-12">Form Builder</h1>
        
        <div class="flex gap-6">
            <router-link 
                to="/builder" 
                class="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg"
            >
                Go to Builder
            </router-link>
            
            <router-link 
                to="/renderer" 
                class="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg"
            >
                Go to Renderer
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { FormSchema } from '@/types/form'
import { encryptForStorage } from '@/utils/crypto'
import { onMounted } from 'vue'
import exampleSchemaJSON from '../../example.json?raw'
const exampleSchema: FormSchema = JSON.parse(exampleSchemaJSON)

const formStore = useFormStore()

// Auto-load example when no data in localStorage
onMounted(async () => {
  try {
    const saved = localStorage.getItem('savedSchema')
    if (!saved) {
      // No saved data, load example
      // Save to localStorage with encryption
      const payload = {
        id: `example_${Date.now()}`,
        name: 'Example Form',
        schema: exampleSchema,
        updatedAt: new Date().toISOString()
      }
      const encrypted = await encryptForStorage(payload)
      localStorage.setItem('savedSchema', encrypted)
      
      // Load into form store
      formStore.loadSchema(exampleSchema)
      
    }
  } catch (error) {
    console.error('Failed to auto-load example schema:', error)
  }
})
</script>