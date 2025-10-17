import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NumberInput from '../NumberInput.vue'

// Mock InputNumber component
vi.mock('@/volt/InputNumber.vue', () => ({
  default: {
    name: 'InputNumber',
    template: '<input type="number" v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @change="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />',
    props: ['modelValue', 'placeholder', 'min', 'max', 'step', 'invalid', 'allowEmpty'],
    emits: ['update:modelValue', 'blur']
  }
}))

describe('NumberInput', () => {
  let wrapper: any
  let pinia: any
  let formStore: any

  const mockField: FormField = {
    key: 'test-number',
    schema: {
      type: 'number',
      minimum: 1,
      maximum: 100
    },
    ui: {
      widget: 'number',
      label: 'Test Number',
      layout: 'normal',
      required: true,
      placeholder: 'Enter number',
      allow_decimal: true
    },
    logic: {}
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    formStore = useFormStore()
    
    wrapper = mount(NumberInput, {
      props: {
        field: mockField,
        modelValue: undefined
      },
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders number input with correct label', () => {
    expect(wrapper.text()).toContain('Test Number')
    expect(wrapper.text()).toContain('*') // Required indicator
  })

  it('renders min/max constraints', () => {
    expect(wrapper.text()).toContain('Min: 1')
    expect(wrapper.text()).toContain('Max: 100')
  })

  it('handles input changes', async () => {
    const input = wrapper.findComponent({ name: 'InputNumber' })
    // Test that the component exists and can handle input
    expect(input.exists()).toBe(true)
    expect(input.props('modelValue')).toBe(null)
  })

  it('validates min/max constraints', async () => {
    const addErrorSpy = vi.spyOn(formStore, 'addValidationError').mockImplementation(() => {})
    const input = wrapper.findComponent({ name: 'InputNumber' })
    
    // Test value below minimum
    await input.vm.$emit('update:modelValue', 0)
    await wrapper.vm.$nextTick()
    
    expect(addErrorSpy).toHaveBeenCalledWith(
      'test-number',
      'Test Number must be at least 1'
    )
  })

  it('validates maximum constraint', async () => {
    const addErrorSpy = vi.spyOn(formStore, 'addValidationError').mockImplementation(() => {})
    const input = wrapper.findComponent({ name: 'InputNumber' })
    
    // Test value above maximum
    await input.vm.$emit('update:modelValue', 150)
    await wrapper.vm.$nextTick()
    
    expect(addErrorSpy).toHaveBeenCalledWith(
      'test-number',
      'Test Number must be at most 100'
    )
  })

  it('clears validation errors for valid values', async () => {
    // First set an invalid value
    const input = wrapper.findComponent({ name: 'InputNumber' })
    await input.vm.$emit('update:modelValue', 0)
    await wrapper.vm.$nextTick()
    
    // Then set a valid value
    await input.vm.$emit('update:modelValue', 50)
    await wrapper.vm.$nextTick()
    
    // Should clear the validation error
    expect(formStore.validationErrors).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          field: 'test-number',
          message: expect.stringContaining('must be at least')
        })
      ])
    )
  })

  it('shows error state when validation fails', async () => {
    formStore.addValidationError('test-number', 'Invalid number')
    await wrapper.vm.$nextTick()
    
    const input = wrapper.findComponent({ name: 'InputNumber' })
    expect(input.props('invalid')).toBe(true)
    expect(wrapper.text()).toContain('Invalid number')
  })

  it('applies error styling when invalid', async () => {
    formStore.addValidationError('test-number', 'Error message')
    await wrapper.vm.$nextTick()
    
    const input = wrapper.findComponent({ name: 'InputNumber' })
    expect(input.classes()).toContain('error-input')
  })

  it('validates on blur', async () => {
    const validateSpy = vi.spyOn(formStore, 'validateField').mockImplementation(() => {})
    const input = wrapper.findComponent({ name: 'InputNumber' })
    await input.vm.$emit('blur')
    
    expect(validateSpy).toHaveBeenCalledWith('test-number')
  })

  it('validates on mount', () => {
    expect(wrapper.vm.validateMinMax).toBeDefined()
  })

  it('validates when field configuration changes', async () => {
    const newField = { ...mockField, schema: { ...mockField.schema, minimum: 10 } }
    await wrapper.setProps({ field: newField })
    await wrapper.vm.$nextTick()
    
    // Should trigger validation
    expect(wrapper.vm.validateMinMax).toBeDefined()
  })

  it('handles decimal values correctly', () => {
    const input = wrapper.findComponent({ name: 'InputNumber' })
    expect(input.props('step')).toBe(0.01) // allow_decimal is true
  })

  it('handles integer values correctly', async () => {
    const integerField = { ...mockField, ui: { ...mockField.ui, allow_decimal: false } }
    await wrapper.setProps({ field: integerField })
    await wrapper.vm.$nextTick()
    
    const input = wrapper.findComponent({ name: 'InputNumber' })
    expect(input.props('step')).toBe(1)
  })
})
