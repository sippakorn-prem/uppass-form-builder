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
    
    <Select
      :id="field.key"
      v-model="localValue"
      :options="field.ui.options"
      :placeholder="field.ui.placeholder || 'Select an option'"
      :invalid="hasError"
      optionLabel="label"
      optionValue="value"
      class="w-full"
      @change="handleChange"
      @blur="handleBlur"
    />
    
    <div v-if="hasError" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import Select from '@/volt/Select.vue'
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
