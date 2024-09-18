<script setup lang="ts">
const emit = defineEmits(['signUp', 'cancel', 'guest'])

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
  <UModal>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-start space-x-1">
          <Icon name="i-ep-sell" style="color: turquoise" />
          <h1>Sell Now</h1>
        </div>
      </template>

      <div class="flex items-center justify-start space-x-1">
        <Icon
          name="i-heroicons-exclamation-circle"
          size="5.0em"
          style="color: orange"
        />
        <p>
          In order to get the best experience, it is recommended to sign up to
          your own account, or you can
          <span
            class="font-bold cursor-pointer text-blue-500 dark:text-blue-400 hover:underline"
            @click="onContinueAsGuest"
          >
            continue as guest
          </span>
          (guest access is limited to 1 week).
        </p>
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <UButton
            color="white"
            class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
            label="Sign Up"
            :ui="{
              rounded: 'rounded-lg',

              color: {
                white: {
                  solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600',
                },
              },
            }"
            @click="onSignUp"
          >
            <template #leading>
              <Icon
                name="i-ri-login-circle-line"
                style="color: #22c55e"
                size="1.3em"
              />
            </template>
          </UButton>
          <ButtonsCancelButton :click="onCancel" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
