<script setup lang="ts">
import theme from '#build/ui/button'

const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <UButton class="font-bold">
        Button
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton disabled>
        Disabled
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton loading>
        Loading
      </UButton>

      <UButton loading leading-icon="i-heroicons-rocket-launch">
        Loading
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton loading trailing>
        Loading
      </UButton>

      <UButton loading trailing-icon="i-heroicons-paper-airplane">
        Loading
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton truncate class="w-16">
        Truncate
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton v-for="variant in variants" :key="variant" icon="i-heroicons-rocket-launch" label="Button" :variant="(variant as any)" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="white" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="white" variant="ghost" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" variant="ghost" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" variant="link" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="black" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="black" variant="link" />
    </div>
    <div class="flex items-center gap-2 ml-[-129px]">
      <UButton v-for="size in sizes" :key="size" label="Button" :size="(size as any)" />
    </div>
    <div class="flex items-center gap-2 ml-[-171px]">
      <UButton v-for="size in sizes" :key="size" icon="i-heroicons-rocket-launch" label="Button" :size="(size as any)" />
    </div>
    <div class="flex items-center gap-2 ml-[-159px]">
      <UButton
        v-for="size in sizes"
        :key="size"
        icon="i-heroicons-rocket-launch"
        label="Square"
        square
        :size="(size as any)"
      />
    </div>
    <div class="flex items-center gap-2 ml-[-67px]">
      <UButton v-for="size in sizes" :key="size" icon="i-heroicons-rocket-launch" :size="(size as any)" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" trailing-icon="i-heroicons-chevron-down-20-solid" label="Block" block />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-cloud-arrow-down" label="Button" class="group" :ui="{ leadingIcon: 'group-hover:animate-pulse' }" />
    </div>
  </div>
</template>
