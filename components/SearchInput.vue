<script setup lang="ts">
import type { InputSize, InputColor } from '#ui/types'
const {
  inputSize = 'sm',
  inputColor = 'blue',
  placeholder = 'Search for everything...',
  iconSize = '1.5em',
} = defineProps<{
  placeholder?: string
  inputSize?: InputSize
  inputColor?: InputColor
  iconSize?: string | number
}>()

const uiInput = reactive({
  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 bg-gray-200 dark:bg-gray-200 text-black dark:!text-black',
  rounded: 'rounded-2xl',
})
</script>

<template>
  <UInput :placeholder="placeholder" variant="outline" :color="inputColor" :size="inputSize" :ui="uiInput">
    <template #trailing>
      <Icon name="i-material-symbols-search" style="color: black" :size="iconSize" />
    </template>
  </UInput>
</template>
