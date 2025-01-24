<script lang="ts">
import { tv } from 'tailwind-variants'
import type { NavigationMenuRootProps, NavigationMenuRootEmits, NavigationMenuItemProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/navigation-menu'
import type { AvatarProps, BadgeProps, LinkProps, SeparatorProps } from '#ui/types'
import type { DynamicSlots } from '#ui/types/utils'

const appConfig = _appConfig as AppConfig & { ui: { navigationMenu: Partial<typeof theme> } }

const navigationMenu = tv({ extend: tv(theme), ...(appConfig.ui?.navigationMenu || {}) })

export interface NavigationMenuItem extends LinkProps, Pick<NavigationMenuItemProps, 'value'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  badge?: string | number | BadgeProps
  slot?: string
  select? (e: MouseEvent): void
}

export interface NavigationMenuProps<T> extends Omit<NavigationMenuRootProps, 'asChild' | 'dir'> {
  items?: T[] | T[][]
  separator?: SeparatorProps
  class?: any
  ui?: Partial<typeof navigationMenu.slots>
}

export interface NavigationMenuEmits extends NavigationMenuRootEmits {}

type SlotProps<T> = (props: { item: T, index: number, active?: boolean }) => any

export type NavigationMenuSlots<T extends { slot?: string }> = {
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
  item: SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends NavigationMenuItem">
import { computed } from 'vue'
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UIcon, UAvatar, UBadge, ULink, ULinkBase } from '#components'
import { omit } from '#ui/utils'

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), { orientation: 'horizontal' })
const emits = defineEmits<NavigationMenuEmits>()
defineSlots<NavigationMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'delayDuration', 'skipDelayDuration', 'orientation'), emits)

const ui = computed(() => tv({ extend: navigationMenu, slots: props.ui })({ orientation: props.orientation }))

const lists = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <NavigationMenuRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <NavigationMenuList :class="ui.list()">
        <NavigationMenuItem v-for="(item, index) in list" :key="`list-${listIndex}-${index}`" :value="item.value || String(index)" :class="ui.item()">
          <ULink v-slot="{ active, ...slotProps }" v-bind="omit(item, ['label', 'value', 'icon', 'avatar', 'badge', 'slot', 'select'])" custom>
            <NavigationMenuLink as-child :active="active" @select="item.select">
              <ULinkBase v-bind="slotProps" :class="ui.link({ active, disabled: !!item.disabled })">
                <slot :name="item.slot || 'item'" :item="item" :index="index">
                  <slot name="leading" :item="item" :active="active" :index="index">
                    <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ active, disabled: !!item.disabled })" />
                    <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ active, disabled: !!item.disabled })" />
                  </slot>

                  <span v-if="item.label || $slots.label" :class="ui.linkLabel()">
                    <slot name="label" :item="item" :active="active" :index="index">
                      {{ item.label }}
                    </slot>
                  </span>

                  <span v-if="$slots.trailing || item.badge" :class="ui.linkTrailing()">
                    <slot name="trailing" :item="item" :active="active" :index="index">
                      <UBadge
                        v-if="item.badge"
                        color="white"
                        size="sm"
                        v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
                        :class="ui.linkTrailingBadge()"
                      />
                    </slot>
                  </span>
                </slot>
              </ULinkBase>
            </NavigationMenuLink>
          </ULink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <USeparator v-if="orientation === 'vertical' && listIndex < lists.length - 1" v-bind="separator" orientation="horizontal" :class="ui.separator()" />
    </template>
  </NavigationMenuRoot>
</template>
