<script lang="ts">
import { tv } from 'tailwind-variants'
import type { CollapsibleRootProps, CollapsibleRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/collapsible'

const appConfig = _appConfig as AppConfig & { ui: { collapsible: Partial<typeof theme> } }

const collapsible = tv({ extend: tv(theme), ...(appConfig.ui?.collapsible || {}) })

export interface CollapsibleProps extends Omit<CollapsibleRootProps, 'asChild'> {
  class?: any
  ui?: Partial<typeof collapsible.slots>
}

export interface CollapsibleEmits extends CollapsibleRootEmits {}

export interface CollapsibleSlots {
  default(): any
  content(): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = defineProps<CollapsibleProps>()
const emits = defineEmits<CollapsibleEmits>()
defineSlots<CollapsibleSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultOpen', 'open', 'disabled'), emits)

const ui = computed(() => tv({ extend: collapsible, slots: props.ui })())
</script>

<template>
  <CollapsibleRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <CollapsibleTrigger v-if="$slots.default" as-child>
      <slot />
    </CollapsibleTrigger>

    <CollapsibleContent :class="ui.content()">
      <slot name="content" />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
