<template>
  <div class="form-builder min-h-screen bg-gray-50">
    <!-- Action Bar -->
    <div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-end items-center py-4">
          <div class="flex space-x-3">
            <button
              @click="togglePreview"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ formStore.isPreviewMode ? 'Edit Mode' : 'Preview' }}
            </button>
            <button
              @click="exportSchema"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export Schema
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Field Types and Properties Row -->
      <div v-if="!formStore.isPreviewMode" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Field Types -->
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Field Types</h3>
          <div class="space-y-2">
            <button
              v-for="fieldType in fieldTypes"
              :key="fieldType.type"
              @click="addField(fieldType.type)"
              class="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-200 flex items-center group"
            >
              <svg class="w-5 h-5 mr-3 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="fieldType.type === 'text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                <path v-else-if="fieldType.type === 'number'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                <path v-else-if="fieldType.type === 'select'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                <path v-else-if="fieldType.type === 'radio'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ fieldType.label }}
            </button>
          </div>
        </div>

        <!-- Field Properties Panel -->
        <div v-if="selectedField" class="bg-white rounded-lg shadow-sm border p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Field Properties</h3>
          
          <div class="space-y-4">
            <!-- Field Label -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                v-model="selectedField.label"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="updateField(selectedField.id, { label: selectedField.label })"
              />
            </div>
            
            <!-- Required -->
            <div class="flex items-center">
              <input
                v-model="selectedField.required"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                @change="updateField(selectedField.id, { required: selectedField.required })"
              />
              <label class="ml-2 text-sm text-gray-700">Required</label>
            </div>
            
            <!-- Placeholder -->
            <div v-if="selectedField.type === 'text' || selectedField.type === 'number'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                v-model="selectedField.config.ui!.placeholder"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="updateFieldConfig"
              />
            </div>
            
            <!-- Options for Select/Radio -->
            <div v-if="selectedField.type === 'select' || selectedField.type === 'radio'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Options</label>
              <div class="space-y-2">
                <div
                  v-for="(option, index) in selectedField.config.ui?.options || []"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="option.label"
                    type="text"
                    placeholder="Option label"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    @input="updateFieldConfig"
                  />
                  <input
                    v-model="option.value"
                    type="text"
                    placeholder="Value"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    @input="updateFieldConfig"
                  />
                  <button
                    @click="removeOption(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addOption"
                  class="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 transition-colors"
                >
                  + Add Option
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Canvas and Preview Row -->
      <div>
        <!-- Form Canvas -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Form Input</h3>
          </div>
          
          <!-- Preview Mode -->
          <div v-if="formStore.isPreviewMode" class="p-6">
            <FormRenderer :schema="generatedSchema" />
          </div>
          
          <!-- Builder Mode -->
          <div v-else class="p-6">
            <div v-if="localBuilderFields.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
              <p class="text-gray-500">Start building your form by adding fields from the palette</p>
            </div>
            
            <draggable
              v-else
              v-model="localBuilderFields"
              @end="onDragEnd"
              item-key="id"
              class="space-y-4"
            >
              <template #item="{ element: field }">
                <div
                  :key="field.id"
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200 cursor-move transform hover:scale-[1.02]"
                  :class="{
                    'ring-2 ring-blue-500 border-blue-500 shadow-lg': formStore.selectedFieldId === field.id
                  }"
                  @click="selectField(field.id)"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <component :is="getFieldIcon(field.type)" class="w-5 h-5 mr-2 text-gray-600" />
                      <span class="font-medium text-gray-900">{{ field.label }}</span>
                      <span v-if="field.required" class="ml-2 text-red-500 text-sm">*</span>
                    </div>
                    <button
                      @click.stop="removeField(field.id)"
                      class="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Field Preview -->
                  <div class="bg-gray-50 rounded p-3">
                    <component
                      :is="getFieldComponent(field.type)"
                      :field="getFieldConfig(field)"
                      :model-value="getFieldValue(field)"
                      @update:model-value="(value: any) => updateFieldValue(field.id, value)"
                    />
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { BuilderField, FormField } from '@/types/form'
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import FormRenderer from './FormRenderer.vue'
import NumberInput from './forms/NumberInput.vue'
import RadioInput from './forms/RadioInput.vue'
import SelectInput from './forms/SelectInput.vue'
import TextInput from './forms/TextInput.vue'

const formStore = useFormStore()

// Local reactive array for drag and drop
const localBuilderFields = ref<BuilderField[]>([])

// Sync with store on mount and when store changes
watch(() => formStore.builderFields, (newFields) => {
  localBuilderFields.value = [...newFields]
}, { immediate: true })

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: 'svg' },
  { type: 'number', label: 'Number Input', icon: 'svg' },
  { type: 'select', label: 'Select Dropdown', icon: 'svg' },
  { type: 'radio', label: 'Radio Buttons', icon: 'svg' }
]

const selectedField = computed(() => {
  if (!formStore.selectedFieldId) return null
  return localBuilderFields.value.find(f => f.id === formStore.selectedFieldId)
})

const generatedSchema = computed(() => {
  return formStore.generateSchema()
})

const addField = (type: string) => {
  formStore.addField(type as any)
  // Update local array after adding field
  localBuilderFields.value = [...formStore.builderFields]
}

const removeField = (id: string) => {
  formStore.removeField(id)
  // Update local array after removing field
  localBuilderFields.value = [...formStore.builderFields]
}

const selectField = (id: string) => {
  formStore.selectedFieldId = id
}

const updateField = (id: string, updates: Partial<BuilderField>) => {
  formStore.updateField(id, updates)
}

const updateFieldConfig = () => {
  if (selectedField.value) {
    formStore.updateField(selectedField.value.id, { config: selectedField.value.config })
  }
}

const updateFieldValue = (_id: string, _value: any) => {
  // This is just for preview - not stored
}

const getFieldIcon = (type: string) => {
  const icons = {
    text: 'svg',
    number: 'svg',
    select: 'svg',
    radio: 'svg'
  }
  return icons[type as keyof typeof icons] || 'svg'
}

const getFieldComponent = (type: string) => {
  const components = {
    text: TextInput,
    number: NumberInput,
    select: SelectInput,
    radio: RadioInput
  }
  return components[type as keyof typeof components] || TextInput
}

const getFieldConfig = (field: BuilderField): FormField => {
  return {
    key: field.config.key || field.id,
    schema: field.config.schema || { type: 'string', title: field.label },
    ui: {
      widget: field.type,
      label: field.label,
      layout: 'normal',
      required: field.required,
      ...field.config.ui
    },
    logic: field.config.logic || {}
  }
}

const getFieldValue = (field: BuilderField) => {
  return field.config.schema?.default || ''
}

const togglePreview = () => {
  formStore.isPreviewMode = !formStore.isPreviewMode
}

const exportSchema = () => {
  const schema = formStore.generateSchema()
  const dataStr = JSON.stringify(schema, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'form-schema.json'
  link.click()
  URL.revokeObjectURL(url)
}

const onDragEnd = () => {
  // Update the store with the new order
  formStore.builderFields = [...localBuilderFields.value]
}

const addOption = () => {
  if (selectedField.value) {
    if (!selectedField.value.config.ui) {
      selectedField.value.config.ui = {
        widget: selectedField.value.type,
        label: selectedField.value.label,
        layout: 'normal'
      }
    }
    if (!selectedField.value.config.ui.options) {
      selectedField.value.config.ui.options = []
    }
    selectedField.value.config.ui.options.push({ label: '', value: '' })
    updateFieldConfig()
  }
}

const removeOption = (index: number) => {
  if (selectedField.value?.config.ui?.options) {
    selectedField.value.config.ui.options.splice(index, 1)
    updateFieldConfig()
  }
}
</script>
