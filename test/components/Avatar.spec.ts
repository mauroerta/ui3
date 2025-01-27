import { describe, it, expect } from 'vitest'
import Avatar, { type AvatarProps } from '../../src/runtime/components/Avatar.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/avatar'

describe('Avatar', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with src', { props: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' } }],
    ['with alt', { props: { alt: 'Benjamin Canac' } }],
    ['with text', { props: { text: '+1' } }],
    ['with icon', { props: { icon: 'i-heroicons-photo' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', size } }]),
    ['with class', { props: { class: 'bg-white dark:bg-gray-900' } }],
    ['with ui', { props: { ui: { fallback: 'font-bold' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AvatarProps }) => {
    const html = await ComponentRender(nameOrHtml, options, Avatar)
    expect(html).toMatchSnapshot()
  })
})
