<script setup lang="ts">
import type { HorizontalNavigationLink } from '#ui/types'

const route = useRoute()
const { isMobile } = useDevice()

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
    !isMobile
      ? [
          {
            label: 'Sell Now',
            click: () => {
              useSellNowModal()
            },
          },
          {
            label: 'Register',
            to: '/register',
          },
          {
            label: 'Login',
            to: '/login',
          },
        ]
      : [
          {
            label: 'Sell Now',
            click: () => {
              useSellNowModal()
            },
          },
          {
            label: '',
            // key: 'more',
            icon: 'i-pepicons-pop-dots-x',
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
          <div v-else-if="link.label === 'Categories'">
            <UButton
              label="Categories"
              variant="outline"
              color="white"
              :ui="{
                rounded: 'rounded-full',
                variant: {
                  outline: 'text-gray-100',
                },
              }"
            />
          </div>
          <div v-else-if="link.label === 'Sell Now'">
            <LazyButtonsSellNowButton :click="link.click as () => void" />
          </div>
          <p v-else>{{ link.label }}</p>
        </span>
      </template>
    </UHorizontalNavigation>
    <slot />
  </div>
</template>
