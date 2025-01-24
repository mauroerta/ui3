<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/button'
import type { LinkProps } from '#ui/components/Link.vue'
import type { UseComponentIconsProps } from '#ui/composables/useComponentIcons'

const appConfig = _appConfig as AppConfig & { ui: { button: Partial<typeof theme> } }

const button = tv({ extend: tv(theme), ...(appConfig.ui?.button || {}) })

type ButtonVariants = VariantProps<typeof button>

export interface ButtonProps extends UseComponentIconsProps, LinkProps {
  label?: string
  color?: ButtonVariants['color']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  square?: boolean
  block?: boolean
  truncate?: boolean
  class?: any
  ui?: Partial<typeof button.slots>
}

export interface ButtonSlots {
  leading(): any
  default(): any
  trailing(): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { useComponentIcons } from '#imports'
import { UIcon, ULink } from '#components'

const props = defineProps<ButtonProps>()
const slots = defineSlots<ButtonSlots>()

const linkProps = useForwardProps(reactiveOmit(props, 'type', 'label', 'color', 'variant', 'size', 'icon', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'square', 'block', 'disabled', 'truncate', 'class', 'ui'))

// const { size, rounded } = useInjectButtonGroup({ ui, props })
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const ui = computed(() => tv({ extend: button, slots: props.ui })({
  color: props.color,
  variant: props.variant,
  size: props.size,
  loading: props.loading,
  truncate: props.truncate,
  block: props.block,
  square: props.square || (!slots.default && !props.label),
  leading: isLeading.value,
  trailing: isTrailing.value
}))
</script>

<template>
  <ULink :type="type" :disabled="disabled || loading" :class="ui.base({ class: props.class })" v-bind="linkProps" raw>
    <slot name="leading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon()" />
    </slot>

    <span v-if="label || $slots.default" :class="ui.label()">
      <slot>
        {{ label }}
      </slot>
    </span>

    <slot name="trailing">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="ui.trailingIcon()" />
    </slot>
  </ULink>
</template>
