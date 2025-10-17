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
    
    <InputNumber
      :id="field.key"
      v-model="localValue"
      :placeholder="field.ui.placeholder"
      :min="field.schema.minimum"
      :max="field.schema.maximum"
      :step="field.ui.allow_decimal ? 0.01 : 1"
      :invalid="hasError"
      :allowEmpty="false"
      :class="[
        'w-full',
        hasError ? 'error-input' : ''
      ]"
      :style="hasError ? {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 1px #ef4444'
      } : {}"
      @input="handleInput"
      @change="handleInput"
      @blur="handleBlur"
    />
    
    <div v-if="hasError" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </div>
    
    <div v-if="field.schema.minimum !== undefined || field.schema.maximum !== undefined" class="mt-1 text-xs text-gray-500">
      <span v-if="field.schema.minimum !== undefined">Min: {{ field.schema.minimum }}</span>
      <span v-if="field.schema.minimum !== undefined && field.schema.maximum !== undefined">, </span>
      <span v-if="field.schema.maximum !== undefined">Max: {{ field.schema.maximum }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import InputNumber from '@/volt/InputNumber.vue'
import { computed, onMounted, ref, watch } from 'vue'

interface Props {
  field: FormField
  modelValue?: number
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formStore = useFormStore()
const localValue = ref<number | null>(props.modelValue || null)

const hasError = computed(() => {
  return formStore.validationErrors.some(error => error.field === props.field.key)
})

const errorMessage = computed(() => {
  const error = formStore.validationErrors.find(error => error.field === props.field.key)
  return error?.message || ''
})

const handleInput = () => {
  const numValue = localValue.value
  emit('update:modelValue', numValue as number)
  formStore.updateFieldValue(props.field.key, numValue)
  
  // Validate min/max immediately on input change
  validateMinMax()
}

const validateMinMax = () => {
  if (localValue.value !== null && localValue.value !== undefined) {
    const value = localValue.value
    
    // Check minimum
    if (props.field.schema.minimum !== undefined && value < props.field.schema.minimum) {
      formStore.addValidationError(props.field.key, `${props.field.ui.label} must be at least ${props.field.schema.minimum}`)
      return
    }
    
    // Check maximum
    if (props.field.schema.maximum !== undefined && value > props.field.schema.maximum) {
      formStore.addValidationError(props.field.key, `${props.field.ui.label} must be at most ${props.field.schema.maximum}`)
      return
    }
    
    // Clear min/max errors if value is valid
    formStore.validationErrors = formStore.validationErrors.filter(error => 
      !(error.field === props.field.key && 
        (error.message.includes('must be at least') || error.message.includes('must be at most')))
    )
  }
}

const handleBlur = () => {
  validateMinMax()
  formStore.validateField(props.field.key)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || null
  // Validate when value changes from outside
  validateMinMax()
})

// Watch localValue changes for immediate validation
watch(localValue, () => {
  validateMinMax()
}, { immediate: true })

onMounted(() => {
  validateMinMax()
})

watch(() => props.field, () => {
  validateMinMax()
}, { deep: true })
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
