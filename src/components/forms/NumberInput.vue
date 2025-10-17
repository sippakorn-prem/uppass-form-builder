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
      class="w-full"
      @input="handleInput"
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
import { computed, ref, watch } from 'vue'

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
}

const handleBlur = () => {
  formStore.validateField(props.field.key)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || null
})
</script>
