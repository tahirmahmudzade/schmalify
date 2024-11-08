<script setup lang="ts">
import type { DropdownItem } from '#ui/types'

const { setLocale } = useI18n()

const availableLocales: DropdownItem[][] = [
  [
    { icon: 'i-openmoji-flag-united-kingdom', label: 'English', click: () => setLocale('en') },
    { icon: 'i-openmoji-flag-germany', label: 'Deutsch', click: () => setLocale('de') },
  ],
]
</script>

<template>
  <UDropdown :items="availableLocales" aria-label="Language selection dropdown"
    ><UButton
      icon="i-material-symbols-language"
      color="blue"
      variant="ghost"
      aria-label="Change language"
      title="Change language"
    />
  </UDropdown>
</template>
