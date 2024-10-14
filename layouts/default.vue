<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
const { loggedIn, user } = useUserSession()

const path = computed(() => useRoute().path)

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
          label: 'Log in',
          icon: 'i-ri-login-circle-line',
          iconClass: 'text-green-500 dark:text-green-500',
          click: () => {
            useLoginModal()
          },
        },
    user.value && user.value.isGuest
      ? {
          label: 'Sign in as user',
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
  !loggedIn.value && !user.value ? useSellNowNotificationModal() : useCreateLettingModal()
}
</script>

<template>
  <div>
    <UHeader>
      <template #logo>
        <span class="font-black text-white text-base md:text-xl tracking-tighter leading-none">Schmalify</span>
      </template>

      <template #center>
        <SearchInput :class="path === '/' ? 'hidden' : ''" :is-on-header="true" text-size="xs" icon-size="1.2rem" />
      </template>

      <template #right>
        <!-- <UColorModeButton />/ -->
        <ButtonsSellNowButton :click="handleSellNowClick" />
        <UDropdown :items="items" :popper="{ placement: 'bottom' }">
          <ButtonsProfileButton />
        </UDropdown>
      </template>
    </UHeader>

    <slot />
  </div>
</template>
