<script setup lang="ts">
import type { HorizontalNavigationLink, DropdownItem } from '#ui/types'

const route = useRoute()
const { loggedIn, user } = useUserSession()

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

const links = computed<HorizontalNavigationLink[] | HorizontalNavigationLink[][]>(() => [
  [
    {
      label: 'Schmalify',
      to: '/',
    },
    route.path !== '/'
      ? {
          label: '',
          as: 'Search',
        }
      : {
          label: '',
        },
  ],
  [
    {
      label: 'Sell Now',
      click: () => {
        !loggedIn.value ? useSellNowNotificationModal() : useCreateLettingModal()
      },
    },
    {
      label: 'Profile',
    },
  ],
])
</script>

<template>
  <div class="container mx-auto">
    <!-- Added container with mx-auto and padding -->
    <UHorizontalNavigation
      :links="links"
      :ui="{
        wrapper: 'fixed top-0 left-0 w-full bg-gray-900 z-50 shadow-lg mx-auto px-5', // Solid background color and shadow
        after: '',
        before: 'hover:before:bg-gray-900 dark:hover:before:bg-gray-900',
        inactive: 'text-gray-400 dark:text-gray-400 font-bold transition-colors duration-300', // add transition here
        active: 'text-gray-400 dark:text-gray-400 font-bold transition-colors duration-300', // add transition here
      }"
    >
      <template #default="{ link }">
        <span class="relative">
          <NuxtImg v-if="link.label === 'Schmalify'" width="150" height="50" src="img/main-logo.png" />
          <div v-if="route.path !== '/' && link.as === 'Search'">
            <div class="flex-1">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    class="h-6 w-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35m1.86-5.86a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </span>
                <input
                  type="text"
                  class="w-full py-2 pl-10 pr-4 rounded-full focus:outline-none bg-gray-100 text-gray-900"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
          <div v-if="link.label === 'Sell Now'">
            <ClientOnly>
              <ButtonsSellNowButton :click="link.click as () => void" />
            </ClientOnly>
          </div>
          <div v-else-if="link.label === 'Profile'">
            <ClientOnly>
              <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
                <ButtonsProfileButton />
              </UDropdown>
            </ClientOnly>
          </div>
        </span>
      </template>
    </UHorizontalNavigation>
    <div class="mt-20">
      <slot />
    </div>
  </div>
</template>
