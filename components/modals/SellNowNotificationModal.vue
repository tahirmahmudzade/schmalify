<script setup lang="ts">
const emit = defineEmits(['signUp', 'cancel', 'guest'])

const { t } = useI18n()

function onCancel() {
  emit('cancel')
}

function onSignUp() {
  emit('signUp')
}

function onContinueAsGuest() {
  emit('guest')
}
</script>

<template>
  <UModal :ui="{ container: 'flex min-h-full items-center justify-center text-center' }">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-start space-x-1">
          <Icon name="i-mdi-shopping-basket-plus-outline" style="color: turquoise" />
          <h1>{{ t('Sell Now') }}</h1>
        </div>
      </template>

      <div class="flex items-center justify-start space-x-1">
        <Icon name="i-heroicons-exclamation-circle" size="5.0em" style="color: orange" />
        <p>
          {{ t('In order to get the best experience, it is recommended to sign in to your own account, or you can') }}
          <span class="font-bold cursor-pointer text-blue-500 dark:text-blue-400 hover:underline" @click="onContinueAsGuest">
            {{ t('continue as guest') }}
          </span>
        </p>
      </div>

      <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>{{ t('As a guest:') }}</p>
        <ul class="list-disc pl-5">
          <li>{{ t('You can create only one listing.') }}</li>
          <li>{{ t('Profile and listings cannot be updated.') }}</li>
          <li>{{ t('Access expires after 3 days.') }}</li>
          <li>{{ t('If you log out once, you cannot log back in.') }}</li>
        </ul>
        <p class="mt-2">{{ t('You can log in anytime by clicking "Sign in as user" on the menu bar.') }}</p>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <UButton
            color="white"
            class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
            :label="t('Sign Up')"
            :ui="{ rounded: 'rounded-lg', color: { white: { solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600' } } }"
            @click="onSignUp"
          >
            <template #leading>
              <Icon name="i-ri-login-circle-line" style="color: #22c55e" size="1.3em" />
            </template>
          </UButton>
          <ButtonsCancelButton :click="onCancel" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
