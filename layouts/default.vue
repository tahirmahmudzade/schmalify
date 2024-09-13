<script setup lang="ts">
import type { HorizontalNavigationLink } from '#ui/types'

const route = useRoute()

const path = computed(() => route.path)

const links = ref<HorizontalNavigationLink[] | HorizontalNavigationLink[][]>([])

onMounted(() => {
  links.value = [
    [
      {
        label: 'Schmalify',
        to: '/',
      },
      {
        label: '',
        as: 'Search',
      },
    ],
    [
      {
        label: 'Sell Now',
        click: () => {
          useSellNowModal()
        },
      },
      {
        label: 'Profile',
        // key: 'more',
        click: () => {
          useLoginModal()
        },
      },
    ],
  ]
})
</script>

<template>
  <div class="container mx-auto px-4">
    <!-- Added container with mx-auto and padding -->
    <UHorizontalNavigation
      :links="links"
      :ui="{
        wrapper:
          'fixed top-0 left-0 w-full bg-gray-900 z-50 shadow-lg mx-auto px-5', // Solid background color and shadow
        after: '',
        before: 'hover:before:bg-gray-900 dark:hover:before:bg-gray-900',
        inactive:
          'text-gray-400 dark:text-gray-400 font-bold transition-colors duration-300', // add transition here
        active:
          'text-gray-400 dark:text-gray-400 font-bold transition-colors duration-300', // add transition here
      }"
    >
      <template #default="{ link }">
        <span class="relative">
          <NuxtImg
            v-if="link.label === 'Schmalify'"
            width="150"
            height="50"
            src="img/main-logo.png"
          />
          <div v-else-if="path !== '/' && link.as === 'Search'">
            <div class="flex-1">
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
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
          <div v-else-if="link.label === 'Sell Now'">
            <ButtonsSellNowButton :click="link.click as () => void" />
          </div>
          <div v-else-if="link.label === 'Profile'">
            <UButton
              variant="solid"
              color="black"
              :ui="{
                color: {
                  black: {
                    solid: `text-gray-900 dark:text-gray-900 bg-gray-100 
          dark:bg-gray-100 hover:bg-gray-900 dark:hover:bg-black
          hover:text-gray-100 dark:hover:text-gray-100`,
                  },
                },
              }"
            >
              <Icon name="i-healthicons-ui-user-profile" size="1.5em"
            /></UButton>
          </div>
        </span>
      </template>
    </UHorizontalNavigation>
    <div class="mt-20">
      <slot />
    </div>
  </div>
</template>
