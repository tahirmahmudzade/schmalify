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
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }" class="modal-container">
      <template #header>
        <div class="flex items-center justify-start space-x-1">
          <Icon name="i-mdi-shopping-basket-plus-outline" style="color: turquoise" />
          <h1>Sell Now</h1>
        </div>
      </template>

      <div class="flex items-center justify-start space-x-1">
        <Icon name="i-heroicons-exclamation-circle" size="5.0em" style="color: orange" />
        <p>
          In order to get the best experience, it is recommended to sign in to your own account, or you can
          <span class="font-bold cursor-pointer text-blue-500 dark:text-blue-400 hover:underline" @click="onContinueAsGuest">
            continue as guest
          </span>
        </p>
      </div>

      <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>As a guest:</p>
        <ul class="list-disc pl-5">
          <li>You can create only one listing.</li>
          <li>Profile and listings cannot be updated.</li>
          <li>Access expires after 3 days.</li>
        </ul>
        <p class="mt-2">You can log in anytime by clicking "Sign in as user" on the menu bar.</p>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <UButton
            color="white"
            class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
            label="Sign Up"
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

<style scoped>
/* Ensure modal is centered on small screens */
@media (max-width: 640px) {
  .modal-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%; /* Ensure the modal is responsive */
    max-width: 400px; /* Set a maximum width */
  }
}
</style>
