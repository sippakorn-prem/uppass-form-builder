<template>
  <div class="form-field">
    <fieldset>
      <legend 
        class="block text-sm font-medium text-surface-700 mb-3"
        :class="{ 'text-red-600': hasError }"
      >
        {{ field.ui.label }}
        <span v-if="field.ui.required" class="text-red-500 ml-1">*</span>
      </legend>
      
      <div class="space-y-2">
        <label 
          v-for="option in field.ui.options" 
          :key="option.value"
          :class="[
            'flex items-center cursor-pointer hover:bg-surface-50 p-3 rounded-md transition-all duration-200 border border-transparent hover:border-surface-200',
            hasError ? 'border-red-200 bg-red-50' : ''
          ]"
        >
          <input
            :id="`${field.key}_${option.value}`"
            v-model="localValue"
            type="radio"
            :name="field.key"
            :value="option.value"
            :class="[
              'h-4 w-4 text-primary focus:ring-primary border-surface-300 focus:ring-2 focus:ring-offset-2',
              hasError ? 'error-radio' : ''
            ]"
            @change="handleChange"
            @blur="handleBlur"
          />
          <span class="ml-3 text-sm text-surface-700 font-medium">{{ option.label }}</span>
        </label>
      </div>
      
      <div v-if="hasError" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import { computed, ref, watch } from 'vue'

interface Props {
  field: FormField
  modelValue?: string | number
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formStore = useFormStore()
const localValue = ref(props.modelValue || '')

const hasError = computed(() => {
  return formStore.validationErrors.some(error => error.field === props.field.key)
})

const errorMessage = computed(() => {
  const error = formStore.validationErrors.find(error => error.field === props.field.key)
  return error?.message || ''
})

const handleChange = () => {
  emit('update:modelValue', localValue.value)
  formStore.updateFieldValue(props.field.key, localValue.value)
}

const handleBlur = () => {
  formStore.validateField(props.field.key)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || ''
})
</script>

<style scoped>
.error-radio {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}

.error-radio:hover {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}

.error-radio:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
  outline: none !important;
}
</style>
