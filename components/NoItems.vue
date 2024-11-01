<script setup lang="ts">
const {
  title = 'No items listed here yet, click sell now to create your listing',
  subtitle = '',
  showRecommendations = false,
} = defineProps<{
  title?: string
  subtitle?: string
  showRecommendations?: boolean
}>()

const { t } = useI18n()
const { loggedIn, user } = useUserSession()

function handleSellNowClick() {
  !loggedIn.value && !user.value ? useSellNowNotificationModal() : useCreateLettingModal()
}
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-10 text-gray-900 dark:text-white">
    <h2 class="text-xl md:text-2xl font-semibold">{{ t(title) }}</h2>
    <p v-if="subtitle" class="text-base md:text-lg text-gray-700 dark:text-gray-400">{{ t(subtitle) }}</p>
    <ButtonsSellNowButton
      v-if="showRecommendations"
      class="mt-5"
      button-size="md"
      :is-label-hidden="false"
      :click="handleSellNowClick"
    />
  </div>
</template>
