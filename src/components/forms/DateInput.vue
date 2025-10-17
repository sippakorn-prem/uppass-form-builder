<template>
  <div class="form-field">
    <label 
      :for="field.key" 
      class="block text-sm font-medium text-surface-700 mb-2"
      :class="{ 'text-red-600': hasError }"
    >
      {{ field.ui.label }}
      <span v-if="field.ui.required" class="text-red-500 ml-1">*</span>
    </label>
    
    <DatePicker
      :id="field.key"
      v-model="localValue"
      :placeholder="field.ui.placeholder || 'Select date'"
      :invalid="hasError"
      :class="[
        'w-full',
        hasError ? 'error-input' : ''
      ]"
      :style="hasError ? {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 1px #ef4444'
      } : {}"
      @update:modelValue="handleInput"
      @blur="handleBlur"
      dateFormat="mm/dd/yy"
      showIcon
    />
    
    <div v-if="hasError" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
// @ts-ignore
import DatePicker from '@/volt/DatePicker.vue'
import { computed, ref, watch } from 'vue'

interface Props {
  field: FormField
  modelValue?: Date | null
}

interface Emits {
  (e: 'update:modelValue', value: Date | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formStore = useFormStore()
const localValue = ref<Date | null>(props.modelValue || null)


const hasError = computed(() => {
  return formStore.validationErrors.some(error => error.field === props.field.key)
})

const errorMessage = computed(() => {
  const error = formStore.validationErrors.find(error => error.field === props.field.key)
  return error?.message || ''
})

const handleInput = (value: Date | null) => {
  localValue.value = value
  emit('update:modelValue', value)
  formStore.updateFieldValue(props.field.key, value)
}

const handleBlur = () => {
  formStore.validateField(props.field.key)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || null
})
</script>

<style scoped>
.error-input {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}

.error-input:hover {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}

.error-input:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
  outline: none !important;
}
</style>
