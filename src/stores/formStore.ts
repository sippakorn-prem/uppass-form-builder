import type { BuilderField, FormData, FormSchema, ValidationError } from '@/types/form'
import Ajv from 'ajv'
import jsonLogic from 'json-logic-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useFormStore = defineStore('form', () => {
  // State
  const currentSchema = ref<FormSchema | null>(null)
  const formData = ref<FormData>({})
  const validationErrors = ref<ValidationError[]>([])
  const isSubmitting = ref(false)

  // Builder state
  const builderFields = ref<BuilderField[]>([])
  const selectedFieldId = ref<string | null>(null)
  const isPreviewMode = ref(false)

  // Getters
  const isValid = computed(() => validationErrors.value.length === 0)
  const visibleFields = computed(() => {
    if (!currentSchema.value) return []
    
    return currentSchema.value.fields.filter(field => {
      if (!field.logic.visibleWhen) return true
      
      try {
        return jsonLogic.apply(field.logic.visibleWhen, formData.value)
      } catch (error) {
        console.warn('Error evaluating visibility logic:', error)
        return true
      }
    })
  })

  // Actions
  const loadSchema = (schema: FormSchema) => {
    currentSchema.value = schema
    formData.value = {}
    validationErrors.value = []
  }

  const updateFieldValue = (key: string, value: any) => {
    formData.value[key] = value
    validateField(key)
  }

  const validateField = (key: string) => {
    if (!currentSchema.value) return

    const field = currentSchema.value.fields.find(f => f.key === key)
    if (!field) return

    const errors: ValidationError[] = []
    const value = formData.value[key]

    // Required validation
    if (field.ui.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: key,
        message: `${field.ui.label} is required`
      })
    }

    // Schema validation
    if (value !== undefined && value !== null && value !== '') {
      const ajv = new Ajv()
      const validate = ajv.compile(field.schema)
      const valid = validate(value)
      
      if (!valid && validate.errors) {
        validate.errors.forEach(error => {
          errors.push({
            field: key,
            message: error.message || 'Invalid value'
          })
        })
      }
    }

    // Remove existing errors for this field
    validationErrors.value = validationErrors.value.filter(e => e.field !== key)
    // Add new errors
    validationErrors.value.push(...errors)
  }

  const validateForm = () => {
    if (!currentSchema.value) return false

    validationErrors.value = []
    
    currentSchema.value.fields.forEach(field => {
      validateField(field.key)
    })

    return isValid.value
  }

  const submitForm = async () => {
    if (!validateForm()) return false

    isSubmitting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error('Form submission error:', error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // Builder actions
  const addField = (type: BuilderField['type']) => {
    const newField: BuilderField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      config: {
        key: `field_${Date.now()}`,
        schema: {
          type: type === 'number' ? 'number' : type === 'select' || type === 'radio' ? 'string' : 'string',
          title: `New ${type} field`
        },
        ui: {
          widget: type,
          label: `New ${type} field`,
          layout: 'normal'
        },
        logic: {}
      }
    }
    
    builderFields.value.push(newField)
    selectedFieldId.value = newField.id
  }

  const removeField = (id: string) => {
    const index = builderFields.value.findIndex(f => f.id === id)
    if (index > -1) {
      builderFields.value.splice(index, 1)
      if (selectedFieldId.value === id) {
        selectedFieldId.value = null
      }
    }
  }

  const updateField = (id: string, updates: Partial<BuilderField>) => {
    const field = builderFields.value.find(f => f.id === id)
    if (field) {
      Object.assign(field, updates)
    }
  }

  const reorderFields = (fromIndex: number, toIndex: number) => {
    const field = builderFields.value.splice(fromIndex, 1)[0]
    if (field) {
      builderFields.value.splice(toIndex, 0, field)
    }
  }

  const generateSchema = (): FormSchema => {
    const fields = builderFields.value.map(field => ({
      key: field.config.key || field.id,
      schema: field.config.schema || {
        type: field.type === 'number' ? 'number' : 'string',
        title: field.label
      },
      ui: {
        widget: field.type,
        label: field.label,
        layout: 'normal' as const,
        required: field.required,
        ...field.config.ui
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
      fields,
      submit: {
        label: 'Submit',
        action: '/api/form/submit',
        method: 'POST'
      }
    }
  }

  const loadBuilderFields = (schema: FormSchema) => {
    builderFields.value = schema.fields.map((field, index) => ({
      id: `field_${index}`,
      type: field.ui.widget,
      label: field.ui.label,
      required: field.ui.required || false,
      config: field
    }))
  }

  return {
    // State
    currentSchema,
    formData,
    validationErrors,
    isSubmitting,
    builderFields,
    selectedFieldId,
    isPreviewMode,
    
    // Getters
    isValid,
    visibleFields,
    
    // Actions
    loadSchema,
    updateFieldValue,
    validateField,
    validateForm,
    submitForm,
    addField,
    removeField,
    updateField,
    reorderFields,
    generateSchema,
    loadBuilderFields
  }
})
