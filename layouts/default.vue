<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
import type { FooterLink } from '#ui-pro/types'

const { loggedIn, user } = useUserSession()
const { t } = useI18n()

const path = computed(() => useRoute().path)

const items: DropdownItem[][] = [
  [
    loggedIn.value
      ? {
          label: t('Profile'),
          icon: 'i-healthicons-ui-user-profile',
          iconClass: 'text-green-500 dark:text-green-500',
          click: () => {
            navigateTo('/profile')
          },
        }
      : {
          label: t('Log in'),
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
      : { label: '', class: 'hidden', disabled: true },
  ],
  [
    {
      label: t('Listings'),
      icon: 'i-material-symbols-receipt-long',
      iconClass: 'text-orange-500 dark:text-orange-500',
      disabled: !loggedIn.value,
      click: () => {
        navigateTo('/profile/listings')
      },
    },
    // {
    //   label: t('Messages'),
    //   icon: 'material-symbols:chat-outline',
    //   iconClass: 'bg-blue-500',
    //   disabled: !loggedIn.value,
    //   click: () => {
    //     navigateTo('/profile/messages')
    //   },
    // },
  ],
  [
    {
      label: t('Log out'),
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
  { label: 'Hochschule Schmalkalden', to: 'https://www.hs-schmalkalden.de/' },
  { label: t('About us'), to: '/about' },
  {
    label: 'Feedback',
    to: 'mailto:support@schmalify.com?subject=Support%20Request&body=Hello%20Schmalify%20Support%2C%0A%0AI%20need%20help%20with...',
  },
  { label: t(`Bored? Let's play some games!`), to: 'https://tahirmahmudzade.github.io/guessmynumber/' },
]

function handleSellNowClick() {
  !loggedIn.value && !user.value ? useSellNowNotificationModal() : useCreateLettingModal()
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UHeader>
      <template #logo>
        <img src="/img/main-logo.png" class="h-32 sm:h-32 md:h-48 lg:h-48 w-auto -ml-4" alt="Schmalify Logo" />
      </template>

      <template #center>
        <LazySearchInput :class="path === '/' ? 'hidden' : ''" :is-on-header="true" text-size="xs" icon-size="1.2rem" />
      </template>

      <template #right>
        <ButtonsSellNowButton :click="handleSellNowClick" />
        <UDropdown :items="items" :popper="{ placement: 'bottom' }" aria-label="User menu dropdown">
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
          aria-label="Visit Hochschule Schmalkalden's Instagram"
          title="Visit Instagram"
        />
        <UButton
          icon="logos:google-gmail"
          color="gray"
          variant="ghost"
          to="mailto:support@schmalify.com?subject=Support%20Request&body=Hello%20Schmalify%20Support%2C%0A%0AI%20need%20help%20with..."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Support via Email"
          title="Send Email"
        />
        <UButton
          icon="mdi:github"
          color="gray"
          variant="ghost"
          to="https://github.com/tahirmahmudzade/"
          target="_blank"
          aria-label="Visit GitHub Profile"
          title="GitHub"
        />

        <LanguageSwitcher />
      </template>
    </UFooter>
  </div>
</template>
