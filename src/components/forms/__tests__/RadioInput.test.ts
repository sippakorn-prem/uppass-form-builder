import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RadioInput from '../RadioInput.vue'

describe('RadioInput', () => {
  let wrapper: any
  let pinia: any
  let formStore: any

  const mockField: FormField = {
    key: 'test-radio',
    schema: {
      type: 'string',
      enum: ['option1', 'option2', 'option3']
    },
    ui: {
      widget: 'radio',
      label: 'Test Radio',
      layout: 'normal',
      required: true,
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
    
    wrapper = mount(RadioInput, {
      props: {
        field: mockField,
        modelValue: ''
      },
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders radio input with correct label', () => {
    expect(wrapper.text()).toContain('Test Radio')
    expect(wrapper.text()).toContain('*') // Required indicator
  })

  it('renders all radio options', () => {
    expect(wrapper.text()).toContain('Option 1')
    expect(wrapper.text()).toContain('Option 2')
    expect(wrapper.text()).toContain('Option 3')
  })

  it('renders radio inputs with correct attributes', () => {
    const radioInputs = wrapper.findAll('input[type="radio"]')
    expect(radioInputs).toHaveLength(3)
    
    radioInputs.forEach((input: any, index: number) => {
      expect(input.attributes('name')).toBe('test-radio')
      expect(input.attributes('value')).toBe(mockField.ui.options[index].value)
    })
  })

  it('handles radio selection changes', async () => {
    const firstRadio = wrapper.find('input[value="option1"]')
    await firstRadio.setChecked()
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option1'])
  })

  it('shows error state when validation fails', async () => {
    formStore.addValidationError('test-radio', 'Please select an option')
    await wrapper.vm.$nextTick()
    
    const radioInputs = wrapper.findAll('input[type="radio"]')
    radioInputs.forEach((input: any) => {
      expect(input.classes()).toContain('error-radio')
    })
    expect(wrapper.text()).toContain('Please select an option')
  })

  it('applies error styling when invalid', async () => {
    formStore.addValidationError('test-radio', 'Error message')
    await wrapper.vm.$nextTick()
    
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).toContain('border-red-200')
    expect(labels[0].classes()).toContain('bg-red-50')
  })

  it('validates field on blur', async () => {
    const validateSpy = vi.spyOn(formStore, 'validateField').mockImplementation(() => {})
    const firstRadio = wrapper.find('input[value="option1"]')
    await firstRadio.trigger('blur')
    
    expect(validateSpy).toHaveBeenCalledWith('test-radio')
  })

  it('updates form store on change', async () => {
    const updateSpy = vi.spyOn(formStore, 'updateFieldValue').mockImplementation(() => {})
    const firstRadio = wrapper.find('input[value="option1"]')
    await firstRadio.setChecked()
    
    expect(updateSpy).toHaveBeenCalledWith('test-radio', 'option1')
  })

  it('watches for external value changes', async () => {
    await wrapper.setProps({ modelValue: 'option2' })
    await wrapper.vm.$nextTick()
    
    const secondRadio = wrapper.find('input[value="option2"]')
    expect(secondRadio.element.checked).toBe(true)
  })

  it('handles empty options array', async () => {
    const emptyField = { ...mockField, ui: { ...mockField.ui, options: [] } }
    await wrapper.setProps({ field: emptyField })
    await wrapper.vm.$nextTick()
    
    const radioInputs = wrapper.findAll('input[type="radio"]')
    expect(radioInputs).toHaveLength(0)
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
    
    const radioInputs = wrapper.findAll('input[type="radio"]')
    expect(radioInputs).toHaveLength(2)
    expect(radioInputs[0].attributes('value')).toBe('1')
    expect(radioInputs[1].attributes('value')).toBe('2')
  })

  it('applies hover effects to radio options', () => {
    const labels = wrapper.findAll('label')
    labels.forEach((label: any) => {
      expect(label.classes()).toContain('hover:bg-surface-50')
      expect(label.classes()).toContain('cursor-pointer')
    })
  })

  it('maintains proper accessibility with fieldset and legend', () => {
    const fieldset = wrapper.find('fieldset')
    const legend = wrapper.find('legend')
    
    expect(fieldset.exists()).toBe(true)
    expect(legend.exists()).toBe(true)
    expect(legend.text()).toContain('Test Radio')
  })
})
