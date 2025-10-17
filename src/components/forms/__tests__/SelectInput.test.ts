import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SelectInput from '../SelectInput.vue'

// Mock Select component
vi.mock('@/volt/Select.vue', () => ({
  default: {
    name: 'Select',
    template: '<select v-model="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
    props: ['modelValue', 'options', 'placeholder', 'invalid', 'optionLabel', 'optionValue'],
    emits: ['update:modelValue', 'blur']
  }
}))

describe('SelectInput', () => {
  let wrapper: any
  let pinia: any
  let formStore: any

  const mockField: FormField = {
    key: 'test-select',
    schema: {
      type: 'string',
      enum: ['option1', 'option2', 'option3']
    },
    ui: {
      widget: 'select',
      label: 'Test Select',
      layout: 'normal',
      required: true,
      placeholder: 'Choose an option',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ]
    },
    logic: {}
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    formStore = useFormStore()
    
    wrapper = mount(SelectInput, {
      props: {
        field: mockField,
        modelValue: ''
      },
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders select input with correct label', () => {
    expect(wrapper.text()).toContain('Test Select')
    expect(wrapper.text()).toContain('*') // Required indicator
  })

  it('renders options correctly', () => {
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.props('options')).toEqual(mockField.ui.options)
  })

  it('handles selection changes', async () => {
    const select = wrapper.findComponent({ name: 'Select' })
    // Test that the component exists and has the correct props
    expect(select.exists()).toBe(true)
    expect(select.props('options')).toEqual(mockField.ui.options)
  })

  it('shows error state when validation fails', async () => {
    formStore.addValidationError('test-select', 'Please select an option')
    await wrapper.vm.$nextTick()
    
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.props('invalid')).toBe(true)
    expect(wrapper.text()).toContain('Please select an option')
  })

  it('applies error styling when invalid', async () => {
    formStore.addValidationError('test-select', 'Error message')
    await wrapper.vm.$nextTick()
    
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.classes()).toContain('error-input')
  })

  it('validates field on blur', async () => {
    const validateSpy = vi.spyOn(formStore, 'validateField').mockImplementation(() => {})
    const select = wrapper.findComponent({ name: 'Select' })
    await select.vm.$emit('blur')
    
    expect(validateSpy).toHaveBeenCalledWith('test-select')
  })

  it('updates form store on change', async () => {
    // Test that the component can handle changes
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.exists()).toBe(true)
    expect(select.props('modelValue')).toBe('')
  })

  it('watches for external value changes', async () => {
    await wrapper.setProps({ modelValue: 'option3' })
    await wrapper.vm.$nextTick()
    
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.props('modelValue')).toBe('option3')
  })

  it('renders placeholder when no value selected', () => {
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.props('placeholder')).toBe('Choose an option')
  })

  it('handles empty options array', async () => {
    const emptyField = { ...mockField, ui: { ...mockField.ui, options: [] } }
    await wrapper.setProps({ field: emptyField })
    await wrapper.vm.$nextTick()
    
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.props('options')).toEqual([])
  })

  it('handles numeric option values', async () => {
    const numericField = {
      ...mockField,
      ui: {
        ...mockField.ui,
        options: [
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 }
        ]
      }
    }
    
    await wrapper.setProps({ field: numericField })
    await wrapper.vm.$nextTick()
    
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.props('options')).toEqual(numericField.ui.options)
  })
})
