import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DateInput from '../DateInput.vue'

// Mock DatePicker component
vi.mock('@/volt/DatePicker.vue', () => ({
  default: {
    name: 'DatePicker',
    template: '<input type="date" v-model="modelValue" @update:modelValue="$emit(\'update:modelValue\', $event)" @blur="$emit(\'blur\')" />',
    props: {
      modelValue: null,
      placeholder: String,
      invalid: Boolean,
      dateFormat: String,
      showIcon: Boolean
    },
    emits: ['update:modelValue', 'blur']
  }
}))

describe('DateInput', () => {
  let wrapper: any
  let pinia: any
  let formStore: any

  const mockField: FormField = {
    key: 'test-date',
    schema: {
      type: 'string'
    },
    ui: {
      widget: 'date',
      label: 'Test Date',
      layout: 'normal',
      required: true,
      placeholder: 'Select date'
    },
    logic: {}
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    formStore = useFormStore()
    
    wrapper = mount(DateInput, {
      props: {
        field: mockField,
        modelValue: null
      },
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders date input with correct label', () => {
    expect(wrapper.text()).toContain('Test Date')
    expect(wrapper.text()).toContain('*') // Required indicator
  })

  it('renders DatePicker component with correct props', () => {
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.exists()).toBe(true)
    expect(datePicker.props('placeholder')).toBe('Select date')
    expect(datePicker.props('dateFormat')).toBe('mm/dd/yy')
    expect(datePicker.props('showIcon')).toBe(true)
  })

  it('handles date selection changes', async () => {
    const testDate = new Date('2024-01-15')
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    await datePicker.vm.$emit('update:modelValue', testDate)
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([testDate])
  })

  it('shows error state when validation fails', async () => {
    formStore.addValidationError('test-date', 'Please select a date')
    await wrapper.vm.$nextTick()
    
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.props('invalid')).toBe(true)
    expect(wrapper.text()).toContain('Please select a date')
  })

  it('applies error styling when invalid', async () => {
    formStore.addValidationError('test-date', 'Error message')
    await wrapper.vm.$nextTick()
    
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.classes()).toContain('error-input')
  })

  it('validates field on blur', async () => {
    const validateSpy = vi.spyOn(formStore, 'validateField').mockImplementation(() => {})
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    await datePicker.vm.$emit('blur')
    
    expect(validateSpy).toHaveBeenCalledWith('test-date')
  })

  it('updates form store on change', async () => {
    const updateSpy = vi.spyOn(formStore, 'updateFieldValue').mockImplementation(() => {})
    const testDate = new Date('2024-01-15')
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    await datePicker.vm.$emit('update:modelValue', testDate)
    
    expect(updateSpy).toHaveBeenCalledWith('test-date', testDate)
  })

  it('watches for external value changes', async () => {
    const testDate = new Date('2024-01-15')
    await wrapper.setProps({ modelValue: testDate })
    await wrapper.vm.$nextTick()
    
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.props('modelValue')).toBe(testDate)
  })

  it('handles null values correctly', async () => {
    await wrapper.setProps({ modelValue: null })
    await wrapper.vm.$nextTick()
    
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.props('modelValue')).toBe(null)
  })

  it('uses default placeholder when none provided', async () => {
    const fieldWithoutPlaceholder = { ...mockField, ui: { ...mockField.ui, placeholder: undefined } }
    await wrapper.setProps({ field: fieldWithoutPlaceholder })
    await wrapper.vm.$nextTick()
    
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.props('placeholder')).toBe('Select date')
  })

  it('handles date format correctly', () => {
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.props('dateFormat')).toBe('mm/dd/yy')
  })

  it('shows icon by default', () => {
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.props('showIcon')).toBe(true)
  })

  it('applies error styling on hover when invalid', async () => {
    formStore.addValidationError('test-date', 'Error message')
    await wrapper.vm.$nextTick()
    
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.classes()).toContain('error-input')
  })

  it('applies error styling on focus when invalid', async () => {
    formStore.addValidationError('test-date', 'Error message')
    await wrapper.vm.$nextTick()
    
    const datePicker = wrapper.findComponent({ name: 'DatePicker' })
    expect(datePicker.classes()).toContain('error-input')
  })
})
