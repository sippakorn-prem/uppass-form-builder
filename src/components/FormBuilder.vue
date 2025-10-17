<template>
  <div class="form-builder min-h-screen bg-gray-50">
    <!-- Action Bar -->
    <div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-end items-center py-4">
          <div class="flex items-center space-x-3">
            <!-- Primary Actions -->
            <button
              @click="togglePreview"
              class="px-4 py-2 bg-white text-gray-900 border-2 border-gray-900 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-md"
            >
              {{ formStore.isPreviewMode ? 'Edit Mode' : 'Preview Form' }}
            </button>
            
            <button
              @click="saveSchema"
              :disabled="isLoading"
              class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Saving...' : 'Save' }}
            </button>

            <!-- Actions Dropdown -->
            <div class="relative" ref="dropdownContainer">
              <button
                @click="toggleActionsDropdown"
                class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center"
              >
                Actions
                <svg class="ml-2 h-4 w-4" :class="{ 'rotate-180': showActionsDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showActionsDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <div class="py-1">
                  <!-- Export Section -->
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Export
                  </div>
                  <button
                    @click="exportSchema"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <svg class="mr-3 h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download JSON
                  </button>

                  <!-- Load Section -->
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                    Load
                  </div>
                  <button
                    @click="loadSavedSchemas"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <svg class="mr-3 h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                    From Browser
                  </button>
                  <label
                    for="builder-file-input"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
                  >
                    <svg class="mr-3 h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    From File
                  </label>
                  <input
                    id="builder-file-input"
                    ref="fileInput"
                    type="file"
                    accept=".json"
                    class="hidden"
                    @change="handleFileUpload"
                  />

                  <!-- Danger Section -->
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                    Danger
                  </div>
                  <button
                    @click="clearSchema"
                    class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                  >
                    <svg class="mr-3 h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Field Types and Properties Row -->
      <div v-if="!formStore.isPreviewMode" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Field Types -->
        <Transition name="fade-in">
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
                <path v-else-if="fieldType.type === 'date'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {{ fieldType.label }}
            </button>
          </div>
        </div>
        </Transition>

        <!-- Field Properties Panel -->
        <Transition name="fade-in">
        <div v-if="selectedField" class="bg-white rounded-lg shadow-sm border p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Field Properties</h3>
          
          <div class="space-y-4">
            <!-- Field Label -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                :value="selectedField?.label || ''"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="updateFieldLabel(($event.target as HTMLInputElement).value)"
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
            <div v-if="selectedField.type === 'text' || selectedField.type === 'number' || selectedField.type === 'date'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                v-model="selectedField.config.ui!.placeholder"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="updateFieldConfig"
              />
            </div>
            
            <!-- Min/Max for Number fields -->
            <div v-if="selectedField.type === 'number'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                <input
                  v-model.number="selectedField.config.schema!.minimum"
                  type="number"
                  step="any"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="updateFieldConfig"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                <input
                  v-model.number="selectedField.config.schema!.maximum"
                  type="number"
                  step="any"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="updateFieldConfig"
                />
              </div>
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
        </Transition>
      </div>

      <!-- Form Canvas and Preview Row -->
      <div>
        <!-- Form Canvas -->
        <Transition name="fade-in">
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
        </Transition>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccess" class="fixed top-4 right-4 z-50">
      <div class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{{ successMessage }}</span>
        <button @click="showSuccess = false" class="ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'
import type { BuilderField, FormField, FormSchema } from '@/types/form'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import draggable from 'vuedraggable'
import FormRenderer from './FormRenderer.vue'
import DateInput from './forms/DateInput.vue'
import NumberInput from './forms/NumberInput.vue'
import RadioInput from './forms/RadioInput.vue'
import SelectInput from './forms/SelectInput.vue'
import TextInput from './forms/TextInput.vue'

const formStore = useFormStore()
const fileInput = ref<HTMLInputElement>()
const isLoading = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const showActionsDropdown = ref(false)
const dropdownContainer = ref<HTMLElement>()

// (intentionally blank - previous SecureStorage helper removed)

// Local reactive array for drag and drop
const localBuilderFields = ref<BuilderField[]>([])

// Helper function to create deep copies of fields
const createDeepCopy = (field: BuilderField): BuilderField => {
  return {
    ...field,
    config: {
      ...field.config,
      schema: field.config.schema ? { ...field.config.schema } : undefined,
      ui: field.config.ui ? { ...field.config.ui } : undefined,
      logic: field.config.logic ? { ...field.config.logic } : undefined
    }
  }
}

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: 'svg' },
  { type: 'number', label: 'Number Input', icon: 'svg' },
  { type: 'select', label: 'Select Dropdown', icon: 'svg' },
  { type: 'radio', label: 'Radio Buttons', icon: 'svg' },
  { type: 'date', label: 'Date Picker', icon: 'svg' }
]

const selectedField = computed(() => {
  if (!formStore.selectedFieldId) return null
  return localBuilderFields.value.find(f => f.id === formStore.selectedFieldId)
})

const generatedSchema = computed(() => {
  const schema = generateSchemaFromFields(localBuilderFields.value)
  return schema
})

const addField = (type: string) => {
  formStore.addField(type as any)
  // Get the newly added field from the store and add to local array with deep copy
  const newField = formStore.builderFields[formStore.builderFields.length - 1]
  if (newField) {
    localBuilderFields.value.push(createDeepCopy(newField))
  }
}

const removeField = (id: string) => {
  formStore.removeField(id)
  // Remove the field from local array instead of resetting
  const localIndex = localBuilderFields.value.findIndex(f => f.id === id)
  if (localIndex !== -1) {
    localBuilderFields.value.splice(localIndex, 1)
  }
}

const selectField = (id: string) => {
  formStore.selectedFieldId = id
}

const updateField = (id: string, updates: Partial<BuilderField>) => {
  // Update local array first (this is our source of truth)
  const localIndex = localBuilderFields.value.findIndex(f => f.id === id)
  if (localIndex !== -1 && localBuilderFields.value[localIndex]) {
    // Create a new object to ensure reactivity
    const updatedField = { ...localBuilderFields.value[localIndex], ...updates }
    localBuilderFields.value[localIndex] = updatedField
    
    // Also update the store to keep it in sync (but local array is source of truth)
    formStore.updateField(id, updates)
  }
}

const updateFieldLabel = (newLabel: string) => {
  if (selectedField.value) {
    updateField(selectedField.value.id, { label: newLabel })
  }
}

const updateFieldConfig = () => {
  if (selectedField.value) {
    // Update local array first (this is our source of truth)
    const localIndex = localBuilderFields.value.findIndex(f => f.id === selectedField.value!.id)
    if (localIndex !== -1 && localBuilderFields.value[localIndex]) {
      // Create a new object to ensure reactivity
      const updatedField = { ...localBuilderFields.value[localIndex], config: selectedField.value.config }
      localBuilderFields.value[localIndex] = updatedField
      
      // Also update the store to keep it in sync
      formStore.updateField(selectedField.value.id, { config: selectedField.value.config })
    }
  }
}

const updateFieldValue = (_id: string, _value: any) => {
  // This is just for preview - not stored
}

const generateSchemaFromFields = (fields: BuilderField[]): FormSchema => {
  const formFields = fields.map(field => ({
    key: field.config.key || field.id,
    schema: field.config.schema || {
      type: field.type === 'number' ? 'number' : 'string'
    },
    ui: {
      // spread user config first, then override with live values
      ...field.config.ui,
      widget: field.type,
      label: field.label,
      layout: 'normal' as const,
      required: field.required
    },
    logic: field.config.logic || {}
  }))

  return {
    title: 'Generated Form',
    version: '1.0.0',
    type: 'form',
    meta: {
      label: 'Generated Form',
      description: 'Form generated by the builder'
    },
    fields: formFields,
    submit: {
      label: 'Submit',
      action: '/api/form/submit',
      method: 'POST'
    }
  }
}

// Map a FormSchema back into builder fields
const mapSchemaToBuilderFields = (schema: FormSchema): BuilderField[] => {
  if (!schema.fields || !Array.isArray(schema.fields)) return []
  return schema.fields.map((f: any) => {
    const type = (f.ui?.widget || f.schema?.type || 'text') as 'text' | 'number' | 'select' | 'radio' | 'date'
    const id = f.key || `${type}_${Math.random().toString(36).slice(2, 10)}`
    return {
      id,
      type,
      label: f.ui?.label || id,
      required: Boolean(f.ui?.required),
      config: {
        key: f.key || id,
        schema: f.schema || {},
        ui: {
          widget: type,
          label: f.ui?.label || id,
          layout: f.ui?.layout || 'normal',
          placeholder: f.ui?.placeholder,
          required: f.ui?.required,
          options: f.ui?.options,
          allow_decimal: f.ui?.allow_decimal
        },
        logic: f.logic || {}
      }
    }
  })
}

const getFieldIcon = (type: string) => {
  const icons = {
    text: 'svg',
    number: 'svg',
    select: 'svg',
    radio: 'svg',
    date: 'svg'
  }
  return icons[type as keyof typeof icons] || 'svg'
}

const getFieldComponent = (type: string) => {
  const components = {
    text: TextInput,
    number: NumberInput,
    select: SelectInput,
    radio: RadioInput,
    date: DateInput
  }
  return components[type as keyof typeof components] || TextInput
}

const getFieldConfig = (field: BuilderField): FormField => {
  return {
    key: field.config.key || field.id,
    schema: field.config.schema || { type: 'string' },
    ui: {
      // spread first, then force the latest values
      ...field.config.ui,
      widget: field.type,
      label: field.label,
      layout: 'normal',
      required: field.required
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

const toggleActionsDropdown = () => {
  showActionsDropdown.value = !showActionsDropdown.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
    showActionsDropdown.value = false
  }
}

const saveSchema = async () => {
  try {
    isLoading.value = true
    const payload = {
      id: `form_${Date.now()}`,
      name: 'Generated Form',
      schema: generateSchemaFromFields(localBuilderFields.value),
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem('savedSchema', JSON.stringify(payload))
    successMessage.value = 'Saved to browser storage'
    showSuccess.value = true
  } catch (error) {
    console.error('Error saving schema:', error)
    successMessage.value = 'Failed to save form. Please try again.'
    showSuccess.value = true
  } finally {
    setTimeout(() => (showSuccess.value = false), 1600)
    isLoading.value = false
  }
}

const exportSchema = () => {
  const schema = generateSchemaFromFields(localBuilderFields.value)
  const dataStr = JSON.stringify(schema, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'form-schema.json'
  link.click()
  URL.revokeObjectURL(url)
  showActionsDropdown.value = false
}

const onDragEnd = () => {
  // Update the store with the new order
  formStore.builderFields = [...localBuilderFields.value]
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const schema = JSON.parse(e.target?.result as string) as FormSchema
      const mapped = mapSchemaToBuilderFields(schema)
      formStore.builderFields = mapped
      localBuilderFields.value = mapped.map(createDeepCopy)
      formStore.loadSchema(schema)
      successMessage.value = 'Loaded from file'
      showSuccess.value = true
      showActionsDropdown.value = false
      if (fileInput.value) fileInput.value.value = ''
    } catch (err) {
      console.error('Invalid JSON file', err)
      successMessage.value = 'Invalid JSON file'
      showSuccess.value = true
    }
  }
  reader.readAsText(file)
}

const clearSchema = () => {
  formStore.currentSchema = null
  formStore.formData = {}
  formStore.validationErrors = []
  formStore.builderFields = []
  localBuilderFields.value = []
  formStore.selectedFieldId = null
  showActionsDropdown.value = false
  localStorage.removeItem('savedSchema')
}

const loadSavedSchemas = () => {
  try {
    const raw = localStorage.getItem('savedSchema')
    if (!raw) {
      successMessage.value = 'Nothing saved in browser'
      showSuccess.value = true
      return
    }
    const saved = JSON.parse(raw) as { schema: FormSchema }
    const mapped = mapSchemaToBuilderFields(saved.schema)
    formStore.builderFields = mapped
    localBuilderFields.value = mapped.map(createDeepCopy)
    formStore.loadSchema(saved.schema)
    successMessage.value = 'Loaded from browser'
    showSuccess.value = true
    showActionsDropdown.value = false
  } catch (e) {
    console.error('Failed to load saved schema', e)
    successMessage.value = 'Failed to load from browser'
    showSuccess.value = true
  }
}


// Initialize on mount
onMounted(() => {
  // Initialize local array from store with deep copies
  localBuilderFields.value = formStore.builderFields.map(createDeepCopy)
  
  // Add event listeners for dropdown
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

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

<style scoped>
/* Generic fade-in used for cards */
.fade-in-enter-from, .fade-in-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.fade-in-enter-active, .fade-in-leave-active {
  transition: all 300ms ease;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

/* Enhanced field animations */
.field-enter-active,
.field-leave-active {
  transition: all 0.3s ease;
}

.field-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.field-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Drag preview styling */
.sortable-ghost {
  opacity: 0.5;
  background: #f3f4f6;
  border: 2px dashed #9ca3af;
}

.sortable-chosen {
  transform: scale(1.02);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
