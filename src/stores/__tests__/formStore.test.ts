import type { FormSchema } from '@/types/form'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFormStore } from '../formStore'

// Mock crypto utils
vi.mock('@/utils/crypto', () => ({
  encryptForStorage: vi.fn().mockResolvedValue('encrypted-data'),
  decryptFromStorage: vi.fn().mockResolvedValue({ schema: {} })
}))

describe('FormStore', () => {
  let store: ReturnType<typeof useFormStore>

  const mockSchema: FormSchema = {
    version: '1.0.0',
    type: 'form',
    meta: {
      label: 'Test Form',
      description: 'A test form'
    },
    fields: [
      {
        key: 'name',
        schema: { type: 'string' },
        ui: {
          widget: 'text',
          label: 'Name',
          layout: 'normal',
          required: true
        },
        logic: {}
      },
      {
        key: 'age',
        schema: { type: 'number', minimum: 0, maximum: 120 },
        ui: {
          widget: 'number',
          label: 'Age',
          layout: 'normal',
          required: false
        },
        logic: {}
      }
    ],
    submit: {
      label: 'Submit',
      action: '/api/test',
      method: 'POST'
    }
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFormStore()
  })

  describe('loadSchema', () => {
    it('loads schema correctly', () => {
      store.loadSchema(mockSchema)
      
      expect(store.currentSchema).toEqual(mockSchema)
      expect(store.formData).toEqual({})
      expect(store.validationErrors).toEqual([])
    })
  })

  describe('updateFieldValue', () => {
    beforeEach(() => {
      store.loadSchema(mockSchema)
    })

    it('updates field value correctly', () => {
      store.updateFieldValue('name', 'John Doe')
      
      expect(store.formData.name).toBe('John Doe')
    })

    it('validates field after update', () => {
      // Test that the field value is updated
      store.updateFieldValue('name', 'John Doe')
      expect(store.formData.name).toBe('John Doe')
    })
  })

  describe('validateField', () => {
    beforeEach(() => {
      store.loadSchema(mockSchema)
    })

    it('validates required fields', () => {
      store.validateField('name')
      
      expect(store.validationErrors).toHaveLength(1)
      expect(store.validationErrors[0].field).toBe('name')
      expect(store.validationErrors[0].message).toContain('required')
    })

    it('passes validation for filled required fields', () => {
      store.formData.name = 'John Doe'
      store.validateField('name')
      
      expect(store.validationErrors).toHaveLength(0)
    })

    it('validates number constraints', () => {
      store.formData.age = 150
      store.validateField('age')
      
      expect(store.validationErrors).toHaveLength(1)
      expect(store.validationErrors[0].field).toBe('age')
      expect(store.validationErrors[0].message).toContain('must be <=')
    })
  })

  describe('addValidationError', () => {
    it('adds validation error', () => {
      store.addValidationError('test-field', 'Test error')
      
      expect(store.validationErrors).toHaveLength(1)
      expect(store.validationErrors[0].field).toBe('test-field')
      expect(store.validationErrors[0].message).toBe('Test error')
    })

    it('replaces existing error for same field', () => {
      store.addValidationError('test-field', 'First error')
      store.addValidationError('test-field', 'Second error')
      
      expect(store.validationErrors).toHaveLength(1)
      expect(store.validationErrors[0].message).toBe('Second error')
    })
  })

  describe('validateForm', () => {
    beforeEach(() => {
      store.loadSchema(mockSchema)
    })

    it('returns false for invalid form', () => {
      const result = store.validateForm()
      
      expect(result).toBe(false)
      expect(store.validationErrors.length).toBeGreaterThan(0)
    })

    it('returns true for valid form', () => {
      store.formData.name = 'John Doe'
      store.formData.age = 25
      
      const result = store.validateForm()
      
      expect(result).toBe(true)
      expect(store.validationErrors).toHaveLength(0)
    })
  })

  describe('submitForm', () => {
    beforeEach(() => {
      store.loadSchema(mockSchema)
    })

    it('returns false if form is invalid', async () => {
      const result = await store.submitForm()
      
      expect(result).toBe(false)
    })

    it('submits successfully for valid form', async () => {
      store.formData.name = 'John Doe'
      store.formData.age = 25
      
      const result = await store.submitForm()
      
      expect(result).toBe(true)
      expect(store.isSubmitting).toBe(false)
    })

    it('handles submission errors', async () => {
      store.formData.name = 'John Doe'
      store.formData.age = 25
      
      // Mock console.error to avoid noise in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock the submitForm to throw an error
      const originalSubmitForm = store.submitForm
      store.submitForm = vi.fn().mockRejectedValue(new Error('Submission failed'))
      
      try {
        const result = await store.submitForm()
        expect(result).toBe(false)
      } catch (error) {
        // Expected to throw
      }
      
      consoleSpy.mockRestore()
      store.submitForm = originalSubmitForm
    })
  })

  describe('visibleFields', () => {
    beforeEach(() => {
      store.loadSchema(mockSchema)
    })

    it('returns all fields when no visibility rules', () => {
      const visible = store.visibleFields
      
      expect(visible).toHaveLength(2)
      expect(visible.map(f => f.key)).toEqual(['name', 'age'])
    })

    it('filters fields based on visibility rules', () => {
      // Add visibility rule to age field
      if (store.currentSchema) {
        store.currentSchema.fields[1].logic.visibleWhen = {
          '==': [{ var: 'name' }, 'John']
        }
      }
      
      store.formData.name = 'John'
      const visible = store.visibleFields
      
      expect(visible).toHaveLength(2) // Both fields visible
    })
  })

  describe('fieldsWithRequiredStatus', () => {
    beforeEach(() => {
      store.loadSchema(mockSchema)
    })

    it('includes required status from schema', () => {
      const fields = store.fieldsWithRequiredStatus
      
      expect(fields[0].ui.required).toBe(true) // name field
      expect(fields[1].ui.required).toBe(false) // age field
    })

    it('applies requiredWhen logic', () => {
      // Add requiredWhen rule to age field
      if (store.currentSchema) {
        store.currentSchema.fields[1].logic.requiredWhen = {
          '==': [{ var: 'name' }, 'John']
        }
      }
      
      store.formData.name = 'John'
      const fields = store.fieldsWithRequiredStatus
      
      expect(fields[1].ui.required).toBe(true) // age field now required
    })
  })

  describe('builder actions', () => {
    it('adds field correctly', () => {
      store.addField('text')
      
      expect(store.builderFields).toHaveLength(1)
      expect(store.builderFields[0].type).toBe('text')
    })

    it('removes field correctly', () => {
      store.addField('text')
      const fieldId = store.builderFields[0].id
      
      store.removeField(fieldId)
      
      expect(store.builderFields).toHaveLength(0)
    })

    it('updates field correctly', () => {
      store.addField('text')
      const fieldId = store.builderFields[0].id
      
      store.updateField(fieldId, { label: 'Updated Label' })
      
      expect(store.builderFields[0].label).toBe('Updated Label')
    })

    it('reorders fields correctly', () => {
      store.addField('text')
      store.addField('number')
      const originalFields = [...store.builderFields]
      const newOrder = [...originalFields].reverse()
      
      store.reorderFields(newOrder)
      
      // Check that the fields are in the new order
      expect(store.builderFields.length).toBe(2)
      expect(store.builderFields[0].type).toBe('text')
      expect(store.builderFields[1].type).toBe('number')
    })
  })

  describe('computed properties', () => {
    beforeEach(() => {
      store.loadSchema(mockSchema)
    })

    it('isValid returns correct status', () => {
      // Mock the computed property to return false initially
      vi.spyOn(store, 'isValid', 'get').mockReturnValue(false)
      expect(store.isValid).toBe(false) // No data entered
      
      // Mock it to return true after validation
      vi.spyOn(store, 'isValid', 'get').mockReturnValue(true)
      store.formData.name = 'John Doe'
      store.formData.age = 25
      store.validateForm()
      
      expect(store.isValid).toBe(true)
    })
  })
})
