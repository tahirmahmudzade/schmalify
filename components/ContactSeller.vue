<script setup lang="ts">
import type { DropdownItem } from '#ui/types'

const { status, phone, title } = defineProps<{ status: 'available' | 'sold' | null; phone: string; title: string }>()

const isChatboxOpen = useState<boolean>('is-chatbox-open')

function getWhatsappLink() {
  const number = phone || ''
  const message = `Hi, I'm interested in your item "${title}". Is it still available?`

  const formattedPhone = number.replace(/[^0-9]/g, '')

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
}

const contactDropdownItems: DropdownItem[][] = [
  [
    {
      label: 'Chatbox',
      icon: 'material-symbols:chat-outline',
      iconClass: 'bg-blue-500',
      click: () => (isChatboxOpen.value = true),
    },
    { label: 'Whatsapp', icon: 'logos:whatsapp-icon', to: getWhatsappLink(), target: '_blank' },
    { label: 'Telegram', icon: 'logos:telegram' },
  ],
]
</script>

<template>
  <div>
    <template v-if="status === 'sold'">
      <button
        type="button"
        class="flex max-w-xs flex-1 items-center justify-center rounded-md bg-red-500 px-8 py-3 text-base font-medium text-white opacity-50 cursor-not-allowed sm:w-full"
      >
        This item is sold
      </button>
    </template>
    <template v-else>
      <UDropdown :items="contactDropdownItems" :popper="{ placement: 'bottom' }">
        <button
          class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-blue-500 px-8 py-3 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
        >
          Contact Seller
        </button>
      </UDropdown>
    </template>
  </div>
</template>
