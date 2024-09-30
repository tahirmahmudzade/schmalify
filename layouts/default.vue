<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
const { loggedIn, user } = useUserSession()

const uiHeader = reactive({
  container: 'flex items-center justify-between h-auto py-2', // Added vertical padding
  left: 'flex-shrink-0 flex items-center gap-1.5',
  center: 'flex-grow flex-shrink min-w-0 mx-2',
  right: 'flex-shrink-0 flex items-center gap-1.5',
  logo: 'flex-shrink-0 font-bold text-xl text-gray-900 dark:text-white flex items-end gap-1.5 w-32 sm:w-40',
})

const items: DropdownItem[][] = [
  [
    loggedIn.value
      ? {
          label: 'Profile',
          icon: 'i-healthicons-ui-user-profile',
          iconClass: 'text-green-500 dark:text-green-500',
          click: () => {
            navigateTo('/profile')
          },
        }
      : {
          label: 'Sign in',
          icon: 'i-ri-login-circle-line',
          iconClass: 'text-green-500 dark:text-green-500',
          click: () => {
            useLoginModal()
          },
        },
    user.value && user.value.isGuest
      ? {
          label: 'Sign up as a user',
          icon: 'i-ri-login-circle-line',
          iconClass: 'text-green-500 dark:text-green-500',
          click: () => {
            useRegisterModal()
          },
        }
      : {
          label: '',
          class: 'hidden',
          disabled: true,
        },
  ],
  [
    {
      label: 'Listings',
      icon: 'i-material-symbols-receipt-long',
      iconClass: 'text-orange-500 dark:text-orange-500',
      click: () => {
        navigateTo('/profile/listings')
      },
      disabled: !loggedIn.value,
    },
    {
      label: 'Shopping Cart',
      icon: 'i-mdi-light-cart',
      iconClass: 'text-blue-500 dark:text-blue-500',
      disabled: !loggedIn.value,
    },
  ],
  [
    {
      label: 'Log out',
      icon: 'i-ri-logout-circle-line',
      iconClass: 'text-red-500 dark:text-red-500',
      disabled: !loggedIn.value,
      click: () => {
        useLogout()
      },
    },
  ],
]

function handleSellNowClick() {
  !loggedIn.value ? useSellNowNotificationModal() : useCreateLettingModal()
}
</script>

<template>
  <div>
    <UHeader :ui="uiHeader">
      <template #logo>
        <NuxtImg width="150" height="50" src="img/main-logo.png" />
      </template>

      <template #center>
        <SearchInput icon-size="1.2rem" />
      </template>

      <template #right>
        <!-- <UColorModeButton /> -->
        <ButtonsSellNowButton :click="handleSellNowClick" />
        <UDropdown :items="items" :popper="{ placement: 'bottom' }">
          <ButtonsProfileButton />
        </UDropdown>
      </template>
    </UHeader>

    <slot />
  </div>
</template>
