<template>
  <div class="form-renderer max-w-2xl mx-auto p-6">
    <div v-if="!formStore.currentSchema" class="text-center text-gray-500">
      <p class="text-lg">No form schema loaded</p>
      <p class="text-sm mt-2">Please load a form schema to render the form</p>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Form Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          {{ formStore.currentSchema.meta.label }}
        </h1>
        <p class="text-gray-600">
          {{ formStore.currentSchema.meta.description }}
        </p>
      </div>
      
      <!-- Form Fields -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div 
          v-for="field in formStore.visibleFields" 
          :key="field.key"
          class="transition-all duration-300 ease-in-out opacity-100 transform translate-y-0"
        >
          <!-- Text Input -->
          <TextInput
            v-if="field.ui.widget === 'text'"
            :field="field"
            :model-value="formStore.formData[field.key]"
            @update:model-value="(value) => formStore.updateFieldValue(field.key, value)"
          />
          
          <!-- Number Input -->
          <NumberInput
            v-else-if="field.ui.widget === 'number'"
            :field="field"
            :model-value="formStore.formData[field.key]"
            @update:model-value="(value) => formStore.updateFieldValue(field.key, value)"
          />
          
          <!-- Select Input -->
          <SelectInput
            v-else-if="field.ui.widget === 'select'"
            :field="field"
            :model-value="formStore.formData[field.key]"
            @update:model-value="(value) => formStore.updateFieldValue(field.key, value)"
          />
          
          <!-- Radio Input -->
          <RadioInput
            v-else-if="field.ui.widget === 'radio'"
            :field="field"
            :model-value="formStore.formData[field.key]"
            @update:model-value="(value) => formStore.updateFieldValue(field.key, value)"
          />
        </div>
        
        <!-- Submit Button -->
        <div class="pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="!formStore.isValid || formStore.isSubmitting"
            class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="formStore.isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
            <span v-else>
              {{ formStore.currentSchema.submit.label }}
            </span>
          </button>
        </div>
      </form>
      
      <!-- Success Message -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md mx-4">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Form Submitted Successfully!</h3>
            <p class="text-sm text-gray-500 mb-4">Your form has been submitted successfully.</p>
            <button
              @click="showSuccess = false"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { FormSchema } from '@/types/form'
import { onMounted, ref } from 'vue'
import NumberInput from './forms/NumberInput.vue'
import RadioInput from './forms/RadioInput.vue'
import SelectInput from './forms/SelectInput.vue'
import TextInput from './forms/TextInput.vue'

interface Props {
  schema?: FormSchema
}

const props = defineProps<Props>()
const formStore = useFormStore()
const showSuccess = ref(false)

const handleSubmit = async () => {
  const success = await formStore.submitForm()
  if (success) {
    showSuccess.value = true
  }
}

onMounted(() => {
  if (props.schema) {
    formStore.loadSchema(props.schema)
  }
})
</script>
