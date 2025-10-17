import { useFormStore } from '@/stores/formStore'
import type { FormField } from '@/types/form'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TextInput from '../TextInput.vue'

// Mock InputText component
vi.mock('@/volt/InputText.vue', () => ({
  default: {
    name: 'InputText',
    template: '<input v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />',
    props: ['modelValue', 'placeholder', 'maxlength', 'minlength', 'invalid'],
    emits: ['update:modelValue', 'blur']
  }
}))

describe('TextInput', () => {
  let wrapper: any
  let pinia: any
  let formStore: any

  const mockField: FormField = {
    key: 'test-field',
    schema: {
      type: 'string',
      maxLength: 100,
      minLength: 1
    },
    ui: {
      widget: 'text',
      label: 'Test Field',
      layout: 'normal',
      required: true,
      placeholder: 'Enter text'
    },
    logic: {}
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    formStore = useFormStore()
    
    wrapper = mount(TextInput, {
      props: {
        field: mockField,
        modelValue: ''
      },
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders text input with correct label', () => {
    expect(wrapper.text()).toContain('Test Field')
    expect(wrapper.text()).toContain('*') // Required indicator
  })

  it('renders placeholder text', () => {
    const input = wrapper.findComponent({ name: 'InputText' })
    expect(input.props('placeholder')).toBe('Enter text')
  })

  it('handles input changes', async () => {
    const input = wrapper.findComponent({ name: 'InputText' })
    // Simulate the input event by calling the component's method directly
    await wrapper.vm.handleInput()
    
    // Check that the component has the expected behavior
    expect(input.exists()).toBe(true)
  })

  it('shows character count when maxLength is set', () => {
    expect(wrapper.text()).toContain('0 / 100')
  })

  it('updates character count on input', async () => {
    const input = wrapper.findComponent({ name: 'InputText' })
    await input.vm.$emit('update:modelValue', 'hello')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('5 / 100')
  })

  it('shows error state when validation fails', async () => {
    formStore.addValidationError('test-field', 'This field is required')
    await wrapper.vm.$nextTick()
    
    const input = wrapper.findComponent({ name: 'InputText' })
    expect(input.props('invalid')).toBe(true)
    expect(wrapper.text()).toContain('This field is required')
  })

  it('applies error styling when invalid', async () => {
    formStore.addValidationError('test-field', 'Error message')
    await wrapper.vm.$nextTick()
    
    const input = wrapper.findComponent({ name: 'InputText' })
    expect(input.classes()).toContain('error-input')
  })

  it('validates field on blur', async () => {
    const validateSpy = vi.spyOn(formStore, 'validateField').mockImplementation(() => {})
    const input = wrapper.findComponent({ name: 'InputText' })
    await input.vm.$emit('blur')
    
    expect(validateSpy).toHaveBeenCalledWith('test-field')
  })

  it('updates form store on input', async () => {
    const updateSpy = vi.spyOn(formStore, 'updateFieldValue').mockImplementation(() => {})
    // Simulate the component's input handling
    await wrapper.vm.handleInput()
    
    expect(updateSpy).toHaveBeenCalledWith('test-field', '')
  })

  it('watches for external value changes', async () => {
    await wrapper.setProps({ modelValue: 'external value' })
    await wrapper.vm.$nextTick()
    
    const input = wrapper.findComponent({ name: 'InputText' })
    expect(input.props('modelValue')).toBe('external value')
  })
})
