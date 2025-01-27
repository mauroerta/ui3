import { describe, it, expect } from 'vitest'
import CommandPalette, { type CommandPaletteProps } from '../../src/runtime/components/CommandPalette.vue'
import ComponentRender from '../component-render'

describe('CommandPalette', () => {
  const groups = [{
    id: 'actions',
    items: [{
      label: 'Add new file',
      suffix: 'Create a new file in the current directory or workspace.',
      icon: 'i-heroicons-document-plus',
      kbds: ['meta', 'N']
    }, {
      label: 'Add new folder',
      suffix: 'Create a new folder in the current directory or workspace.',
      icon: 'i-heroicons-folder-plus',
      kbds: ['meta', 'F']
    }, {
      label: 'Add hashtag',
      suffix: 'Add a hashtag to the current item.',
      icon: 'i-heroicons-hashtag',
      kbds: ['meta', 'H']
    }, {
      label: 'Add label',
      suffix: 'Add a label to the current item.',
      icon: 'i-heroicons-tag',
      kbds: ['meta', 'L'],
      slot: 'custom'
    }]
  }, {
    id: 'labels',
    label: 'Labels',
    items: [{
      label: 'bug',
      chip: {
        color: 'red'
      }
    }, {
      label: 'feature',
      chip: {
        color: 'green'
      }
    }, {
      label: 'enhancement',
      chip: {
        color: 'blue'
      }
    }]
  }, {
    id: 'users',
    label: 'Users',
    items: [{
      label: 'benjamincanac',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/739984?v=4'
      }
    }]
  }]

  const props = { groups }

  it.each([
    // Props
    ['with groups', { props }],
    ['with modelValue', { props: { ...props, modelValue: groups[2].items[0] } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search...' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with icon', { props: { ...props, icon: 'i-heroicons-command-line' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-heroicons-check-badge', modelValue: groups[2].items[0] } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'divide-gray-300 dark:divide-gray-700' } }],
    ['with ui', { props: { ...props, ui: { input: '[&>input]:h-10' } } }],
    // Slots
    ['with empty slot', { props, slots: { empty: () => 'Empty slot' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with label slot', { props, slots: { label: () => 'Label slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }],
    ['with close slot', { props: { ...props, close: true }, slots: { close: () => 'Close slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CommandPaletteProps<typeof groups[number], typeof groups[number]['items'][number]>, slots?: Partial<any> }) => {
    const html = await ComponentRender(nameOrHtml, options, CommandPalette)
    expect(html).toMatchSnapshot()
  })
})
