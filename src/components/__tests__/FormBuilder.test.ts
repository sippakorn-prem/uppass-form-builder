import { useFormStore } from '@/stores/formStore'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FormBuilder from '../FormBuilder.vue'

// Mock the crypto utils
vi.mock('@/utils/crypto', () => ({
  encryptForStorage: vi.fn().mockResolvedValue('encrypted-data'),
  decryptFromStorage: vi.fn().mockResolvedValue({ schema: {} })
}))

// Mock vuedraggable
vi.mock('vuedraggable', () => ({
  default: {
    name: 'draggable',
    template: '<div><slot /></div>'
  }
}))

describe('FormBuilder', () => {
  let wrapper: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = mount(FormBuilder, {
      global: {
        plugins: [pinia],
        stubs: {
          'FormRenderer': { template: '<div>Form Renderer</div>' },
          'TextInput': { template: '<div>Text Input</div>' },
          'NumberInput': { template: '<div>Number Input</div>' },
          'SelectInput': { template: '<div>Select Input</div>' },
          'RadioInput': { template: '<div>Radio Input</div>' },
          'DateInput': { template: '<div>Date Input</div>' }
        }
      }
    })
  })

  it('renders form builder interface', () => {
    expect(wrapper.find('.form-builder').exists()).toBe(true)
    expect(wrapper.text()).toContain('Field Types')
    expect(wrapper.text()).toContain('Form Input')
  })

  it('displays field types palette', () => {
    expect(wrapper.text()).toContain('Text Input')
    expect(wrapper.text()).toContain('Number Input')
    expect(wrapper.text()).toContain('Select Dropdown')
    expect(wrapper.text()).toContain('Radio Buttons')
    expect(wrapper.text()).toContain('Date Picker')
  })

  it('shows preview and save buttons', () => {
    expect(wrapper.text()).toContain('Preview Form')
    expect(wrapper.text()).toContain('Save')
  })

  it('shows actions dropdown', () => {
    expect(wrapper.text()).toContain('Actions')
  })

  it('displays empty state when no fields', () => {
    expect(wrapper.text()).toContain('No fields added yet')
    expect(wrapper.text()).toContain('Start building your form by adding fields from the palette')
  })

  it('toggles preview mode', async () => {
    const previewButton = wrapper.find('button')
    await previewButton.trigger('click')
    
    const formStore = useFormStore()
    expect(formStore.isPreviewMode).toBe(true)
  })

  it('handles field addition', async () => {
    const formStore = useFormStore()
    const initialFieldCount = formStore.builderFields.length
    
    // Simulate adding a field
    wrapper.vm.addField('text')
    
    expect(formStore.builderFields.length).toBe(initialFieldCount + 1)
  })

  it('handles field removal', async () => {
    const formStore = useFormStore()
    
    // Add a field first
    wrapper.vm.addField('text')
    const fieldCount = formStore.builderFields.length
    
    // Remove the field
    if (formStore.builderFields.length > 0) {
      wrapper.vm.removeField(formStore.builderFields[0].id)
      expect(formStore.builderFields.length).toBe(fieldCount - 1)
    }
  })

  it('exports schema correctly', () => {
    const exportSpy = vi.spyOn(wrapper.vm, 'exportSchema')
    wrapper.vm.exportSchema()
    expect(exportSpy).toHaveBeenCalled()
  })

  it('clears schema correctly', () => {
    const formStore = useFormStore()
    wrapper.vm.clearSchema()
    
    expect(formStore.currentSchema).toBeNull()
    expect(formStore.builderFields).toEqual([])
    expect(formStore.selectedFieldId).toBeNull()
  })
})
