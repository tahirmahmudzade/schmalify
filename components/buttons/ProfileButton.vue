<template>
  <UButton
    variant="solid"
    color="black"
    size="xs"
    :ui="{
      color: {
        black: {
          solid: `text-gray-900 dark:text-gray-900 bg-gray-100 
          dark:bg-gray-100 hover:bg-gray-900 dark:hover:bg-black
          hover:text-gray-100 dark:hover:text-gray-100`,
        },
      },
    }"
    aria-label="Open profile menu"
    title="Profile"
  >
    <template #leading>
      <Icon name="i-healthicons-ui-user-profile" size="1.3em" />
    </template>
  </UButton>
</template>
