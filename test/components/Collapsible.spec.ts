import { describe, it, expect } from 'vitest'
import Collapsible, { type CollapsibleProps, type CollapsibleSlots } from '../../src/runtime/components/Collapsible.vue'
import ComponentRender from '../component-render'

describe('Collapsible', () => {
  const props = { open: true }

  it.each([
    // Props
    ['with open', { props }],
    ['with class', { props: { ...props, class: 'space-y-2' } }],
    ['with ui', { props: { ...props, ui: { content: 'bg-gray-50 dark:bg-gray-800' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CollapsibleProps, slots?: Partial<CollapsibleSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Collapsible)
    expect(html).toMatchSnapshot()
  })
})
