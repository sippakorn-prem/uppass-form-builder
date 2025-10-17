import { useFormStore } from '@/stores/formStore'
import type { FormSchema } from '@/types/form'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FormRenderer from '../FormRenderer.vue'

// Mock form components
vi.mock('../forms/TextInput.vue', () => ({
  default: { template: '<div>Text Input</div>' }
}))

vi.mock('../forms/NumberInput.vue', () => ({
  default: { template: '<div>Number Input</div>' }
}))

vi.mock('../forms/SelectInput.vue', () => ({
  default: { template: '<div>Select Input</div>' }
}))

vi.mock('../forms/RadioInput.vue', () => ({
  default: { template: '<div>Radio Input</div>' }
}))

vi.mock('../forms/DateInput.vue', () => ({
  default: { template: '<div>Date Input</div>' }
}))

describe('FormRenderer', () => {
  let wrapper: any
  let pinia: any
  let formStore: any

  const mockSchema: FormSchema = {
    title: 'Test Form',
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
      }
    ],
    submit: {
      label: 'Submit',
      action: '/api/test',
      method: 'POST'
    }
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    formStore = useFormStore()
    
    wrapper = mount(FormRenderer, {
      global: {
        plugins: [pinia]
      }
    })
  })

  it('renders no schema message when no schema is loaded', () => {
    expect(wrapper.text()).toContain('No form schema loaded')
    expect(wrapper.text()).toContain('Please load a form schema to render the form')
  })

  it('renders form when schema is provided', async () => {
    formStore.loadSchema(mockSchema)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Test Form')
    expect(wrapper.text()).toContain('A test form')
  })

  it('renders form fields correctly', async () => {
    formStore.loadSchema(mockSchema)
    await wrapper.vm.$nextTick()
    
    // Check that form fields are rendered (mocked components show as "Text Input", etc.)
    expect(wrapper.text()).toContain('Text Input')
  })

  it('shows submit button with correct text', async () => {
    formStore.loadSchema(mockSchema)
    await wrapper.vm.$nextTick()
    
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toContain('Submit')
  })

  it('handles form submission', async () => {
    formStore.loadSchema(mockSchema)
    const submitSpy = vi.spyOn(formStore, 'submitForm').mockResolvedValue(true)
    await wrapper.vm.$nextTick()
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    
    // Check if submit was called
    expect(submitSpy).toHaveBeenCalled()
  })

  it('shows success dialog after submission', async () => {
    formStore.loadSchema(mockSchema)
    vi.spyOn(formStore, 'submitForm').mockResolvedValue(true)
    
    await wrapper.vm.$nextTick()
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Form Submitted Successfully!')
  })

  it('displays submit method and action in success dialog', async () => {
    formStore.loadSchema(mockSchema)
    vi.spyOn(formStore, 'submitForm').mockResolvedValue(true)
    
    await wrapper.vm.$nextTick()
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('[POST] /api/test')
  })

  it('handles loading state during submission', async () => {
    formStore.loadSchema(mockSchema)
    vi.spyOn(formStore, 'submitForm').mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(true), 100))
    )
    
    await wrapper.vm.$nextTick()
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    
    expect(wrapper.text()).toContain('Processing...')
  })

  it('validates form before submission', async () => {
    formStore.loadSchema(mockSchema)
    formStore.formData = {} // Empty form data should fail validation
    vi.spyOn(formStore, 'isValid', 'get').mockReturnValue(false)
    
    await wrapper.vm.$nextTick()
    
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
})
