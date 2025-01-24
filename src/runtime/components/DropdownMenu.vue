<script lang="ts">
import { tv } from 'tailwind-variants'
import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuArrowProps, DropdownMenuTriggerProps, DropdownMenuItemProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/dropdown-menu'
import type { AvatarProps, KbdProps, LinkProps } from '#ui/types'
import type { DynamicSlots } from '#ui/types/utils'

const appConfig = _appConfig as AppConfig & { ui: { dropdownMenu: Partial<typeof theme> } }

const dropdownMenu = tv({ extend: tv(theme), ...(appConfig.ui?.dropdownMenu || {}) })

export interface DropdownMenuItem extends Omit<LinkProps, 'type'>, Pick<DropdownMenuItemProps, 'disabled'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  content?: Omit<DropdownMenuContentProps, 'asChild' | 'forceMount'>
  kbds?: KbdProps['value'][] | KbdProps[]
  /**
   * The item type.
   * @defaultValue `'item'`
   */
  type?: 'label' | 'separator' | 'item'
  slot?: string
  open?: boolean
  defaultOpen?: boolean
  children?: DropdownMenuItem[] | DropdownMenuItem[][]
  select? (e: Event): void
}

export interface DropdownMenuProps<T> extends Omit<DropdownMenuRootProps, 'dir'>, Pick<DropdownMenuTriggerProps, 'disabled'> {
  items?: T[] | T[][]
  content?: Omit<DropdownMenuContentProps, 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<DropdownMenuArrowProps, 'asChild'>
  portal?: boolean
  class?: any
  ui?: Partial<typeof dropdownMenu.slots>
}

export interface DropdownMenuEmits extends DropdownMenuRootEmits {}

type SlotProps<T> = (props: { item: T, active?: boolean, index: number }) => any

export type DropdownMenuSlots<T extends { slot?: string }> = {
  default(): any
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
  item: SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends DropdownMenuItem">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UDropdownMenuContent } from '#components'
import { omit } from '#ui/utils'

const props = withDefaults(defineProps<DropdownMenuProps<T>>(), {
  portal: true,
  modal: false
})
const emits = defineEmits<DropdownMenuEmits>()
const slots = defineSlots<DropdownMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'modal'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as DropdownMenuContentProps)
const arrowProps = toRef(() => props.arrow as DropdownMenuArrowProps)
const proxySlots = omit(slots, ['default']) as Record<string, DropdownMenuSlots<T>[string]>

const ui = computed(() => tv({ extend: dropdownMenu, slots: props.ui })())
</script>

<template>
  <DropdownMenuRoot v-bind="rootProps">
    <DropdownMenuTrigger v-if="$slots.default" as-child :disabled="disabled">
      <slot />
    </DropdownMenuTrigger>

    <UDropdownMenuContent :class="ui.content({ class: props.class })" :ui="ui" v-bind="contentProps" :items="items" :portal="portal">
      <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>

      <DropdownMenuArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
    </UDropdownMenuContent>
  </DropdownMenuRoot>
</template>
