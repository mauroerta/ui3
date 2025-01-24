<script lang="ts">
import { tv } from 'tailwind-variants'
import type { ContextMenuContentProps as RadixContextMenuContentProps, ContextMenuContentEmits as RadixContextMenuContentEmits } from 'radix-vue'
import theme from '#build/ui/context-menu'
import type { ContextMenuItem, ContextMenuSlots } from '#ui/types'

const contextMenu = tv(theme)()

interface ContextMenuContentProps<T> extends Omit<RadixContextMenuContentProps, 'asChild' | 'forceMount'> {
  items?: T[] | T[][]
  portal?: boolean
  sub?: boolean
  class?: any
  ui: typeof contextMenu
}

interface ContextMenuContentEmits extends RadixContextMenuContentEmits {}

type ContextMenuContentSlots<T extends { slot?: string }> = ContextMenuSlots<T>
</script>

<script setup lang="ts" generic="T extends ContextMenuItem">
import { computed } from 'vue'
import { ContextMenu } from 'radix-vue/namespaced'
import { useForwardPropsEmits } from 'radix-vue'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { ULink } from '#components'
import { omit } from '#ui/utils'

const props = defineProps<ContextMenuContentProps<T>>()
const emits = defineEmits<ContextMenuContentEmits>()
const slots = defineSlots<ContextMenuContentSlots<T>>()

const appConfig = useAppConfig()
const contentProps = useForwardPropsEmits(reactiveOmit(props, 'sub', 'items', 'portal', 'class', 'ui'), emits)
const proxySlots = omit(slots, ['default']) as Record<string, ContextMenuContentSlots<T>[string]>

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate()

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="item.slot || 'item'" :item="item" :index="index">
      <slot name="leading" :item="item" :active="active" :index="index">
        <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ active })" />
        <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ active })" />
      </slot>

      <span v-if="item.label || $slots.label" :class="ui.linkLabel()">
        <slot name="label" :item="item" :active="active" :index="index">
          {{ item.label }}
        </slot>
      </span>

      <span v-if="$slots.trailing || item.children?.length || item.kbds?.length" :class="ui.linkTrailing()">
        <slot name="trailing" :item="item" :active="active" :index="index">
          <UIcon v-if="item.children?.length" :name="appConfig.ui.icons.chevronRight" :class="ui.linkTrailingIcon()" />
          <span v-else-if="item.kbds?.length" :class="ui.linkTrailingKbds()">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" size="md" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>
      </span>
    </slot>
  </DefineItemTemplate>

  <ContextMenu.Portal :disabled="!portal">
    <component :is="sub ? ContextMenu.SubContent : ContextMenu.Content" :class="props.class" v-bind="contentProps">
      <ContextMenu.Group v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group()">
        <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
          <ContextMenu.Label v-if="item.type === 'label'" :class="ui.label()">
            <ReuseItemTemplate :item="item" :index="index" />
          </ContextMenu.Label>
          <ContextMenu.Separator v-else-if="item.type === 'separator'" :class="ui.separator()" />
          <ContextMenu.Sub v-else-if="item?.children?.length">
            <ContextMenu.SubTrigger
              as="button"
              type="button"
              :disabled="item.disabled"
              :open="item.open"
              :default-open="item.defaultOpen"
              :text-value="item.label"
              :class="ui.link()"
            >
              <ReuseItemTemplate :item="item" :index="index" />
            </ContextMenu.SubTrigger>

            <UContextMenuContent
              sub
              :class="props.class"
              :ui="ui"
              :portal="portal"
              :items="item.children"
              :align-offset="-4"
              v-bind="item.content"
            >
              <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
                <slot :name="name" v-bind="slotData" />
              </template>
            </UContextMenuContent>
          </ContextMenu.Sub>
          <ContextMenu.Item v-else as-child :disabled="item.disabled" :text-value="item.label" @select="item.select">
            <ULink v-slot="{ active, ...slotProps }" v-bind="omit((item as ContextMenuItem), ['label', 'icon', 'avatar', 'content', 'kbds', 'slot', 'open', 'defaultOpen', 'select', 'children', 'type'])" custom>
              <ULinkBase v-bind="slotProps" :class="ui.link({ active })">
                <ReuseItemTemplate :item="item" :active="active" :index="index" />
              </ULinkBase>
            </ULink>
          </ContextMenu.Item>
        </template>
      </ContextMenu.Group>

      <slot />
    </component>
  </ContextMenu.Portal>
</template>
