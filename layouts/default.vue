<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
import type { FooterLink } from '#ui-pro/types'
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

const footerLinks: FooterLink[] = [
  {
    label: 'Hochschule Schmalkalden',
    to: 'https://www.hs-schmalkalden.de/',
  },
  {
    label: 'About us',
    to: '/about',
  },
  {
    label: 'Feedback',
    to: 'mailto:support@schmalify.com?subject=Support%20Request&body=Hello%20Schmalify%20Support%2C%0A%0AI%20need%20help%20with...',
  },
  {
    label: `Bored? Let's play some games!`,
    to: 'https://tahirmahmudzade.github.io/guessmynumber/',
  },
]

function handleSellNowClick() {
  !loggedIn.value && !user.value ? useSellNowNotificationModal() : useCreateLettingModal()
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UHeader>
      <template #logo>
        <span class="font-black text-white text-base md:text-xl tracking-tighter leading-none">Schmalify</span>
      </template>

      <template #center>
        <SearchInput :class="path === '/' ? 'hidden' : ''" :is-on-header="true" text-size="xs" icon-size="1.2rem" />
      </template>

      <template #right>
        <ButtonsSellNowButton :click="handleSellNowClick" />
        <UDropdown :items="items" :popper="{ placement: 'bottom' }">
          <ButtonsProfileButton />
        </UDropdown>
      </template>
    </UHeader>

    <!-- Main content -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- Footer -->
    <UDivider label="Schmalify" />
    <UFooter :links="footerLinks">
      <template #left> Copyright © {{ new Date().getFullYear() }} </template>
      <template #right>
        <UButton
          icon="skill-icons:instagram"
          color="gray"
          variant="ghost"
          to="https://www.instagram.com/hs_schmalkalden/"
          target="_blank"
        />
        <UButton
          icon="logos:google-gmail"
          color="gray"
          variant="ghost"
          to="mailto:support@schmalify.com?subject=Support%20Request&body=Hello%20Schmalify%20Support%2C%0A%0AI%20need%20help%20with..."
          target="_blank"
        />
        <UButton icon="mdi:github" color="gray" variant="ghost" to="https://github.com/tahirmahmudzade/" target="_blank" />
      </template>
    </UFooter>
  </div>
</template>
