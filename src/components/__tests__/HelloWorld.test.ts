import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders hello world message', () => {
    const wrapper = mount(HelloWorld)
    
    expect(wrapper.text()).toContain('HelloWorld')
  })

  it('has correct structure', () => {
    const wrapper = mount(HelloWorld)
    
    const p = wrapper.find('p')
    expect(p.exists()).toBe(true)
    expect(p.text()).toBe('HelloWorld')
  })

  it('is a simple component', () => {
    const wrapper = mount(HelloWorld)
    
    expect(wrapper.html()).toBe('<p>HelloWorld</p>')
  })
})
