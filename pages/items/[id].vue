<script setup lang="ts">
import type { Item } from '~/server/database/drizzle'

const route = useRoute('items-id')
const newMessage = ref<string>('')

// Sample chat messages (replace with real data)
const messages = reactive([
  { text: 'Hello! Is this item still available?', from: 'buyer' },
  { text: 'Yes, it is still available.', from: 'seller' },
  { text: 'Great, I am interested in buying it.', from: 'buyer' },
])

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.push({ text: newMessage.value, from: 'buyer' })
    newMessage.value = ''
  }
}

const { data: itemData, error } = await useFetch<{
  statusCode: number
  item: Item & {
    category: { name: string } | null
    seller: {
      avatar: string | null
      location: string | null
      lastName: string | null
      firstName: string | null
      phone: string | null
      username: string | null
    } | null
  }
}>(`/api/items/${route.params.id}`)

if (error.value || !itemData.value) {
  throw createError({ statusCode: 404, message: 'Item might be already sold or removed, please check back later' })
}

const { item } = itemData.value

useSeoMeta({
  title: `${item.title} - ${item.price} €`,
  description: () => `${item.description}`,
  ogTitle: () => `${item.title} - ${item.price} €`,
  ogDescription: () => `${item.description}`,
  ogImage: () => `/api/blob/${item.id}/serveImg?fileName=${item.images?.[0]}`,
  ogUrl: () => `${canonicalUrl}/items/${item.id}`,
  ogType: 'website',
})

const imagesUrl = item.images?.map(image => `/api/blob/${item.id}/serveImg?fileName=${image}`) || []

const product = reactive({
  name: item.title,
  price: item.price + ' €',
  rating: 0,
  images: imagesUrl.map((url, index) => ({
    id: index,
    name: `Image ${index + 1}`,
    src: url,
    alt: `Image ${index + 1} of ${item.title}`,
  })),
  description: item.description || '',
  condition: item.condition || 'Not specified',
  location: item.seller?.location || 'Not specified',
  postedOn: formatDateToDDMMYYYY(item.createdAt!),
})

const selectedImage = ref<string | null>()
const isChatboxOpen = useState<boolean>('is-chatbox-open', () => false)

const previewImg = (imageUrl: string) => {
  selectedImage.value = imageUrl
}
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
        <ProductImageGallery :images="product.images" @preview="previewImg" />
        <div class="mt-10 lg:mt-0 lg:pl-8">
          <ProductDetails
            :name="product.name"
            :price="product.price"
            :description="product.description"
            :avatarUrl="getProfilePicUrl(item.seller?.avatar, item.seller_id)"
            :sellerName="item.seller?.username || `${item.seller?.firstName} ${item.seller?.lastName}`"
            :condition="product.condition"
            :location="product.location"
            :postedOn="product.postedOn"
            :categoryName="item.category?.name!"
          />
          <div class="mt-6">
            <ContactSeller :status="item.status" :phone="item.seller?.phone!" :title="item.title" />
          </div>
        </div>
      </div>
    </div>
    <ModalsImagePreviewModal v-if="selectedImage" :imageUrl="selectedImage" @close="selectedImage = null" />
    <USlideover v-model="isChatboxOpen">
      <div class="flex flex-col h-full">
        <!-- Chat Header -->
        <div class="flex items-center p-4 border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <div class="rounded-full bg-blue-500 w-10 h-10 flex items-center justify-center text-white">
              {{ item.seller?.username?.charAt(0).toUpperCase() || 'G' }}
            </div>
            <div class="text-lg font-semibold">{{ item.seller?.username || 'Garden Design' }}</div>
          </div>
          <button @click="isChatboxOpen = false" class="ml-auto text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="{
              'ml-auto': message.from === 'buyer',
              'mr-auto': message.from === 'seller',
            }"
            class="max-w-[75%]"
          >
            <div
              :class="[
                'relative px-4 py-2 rounded-lg',
                message.from === 'buyer' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800',
              ]"
              class="break-words"
            >
              <span>{{ message.text }}</span>
              <div
                :class="[
                  'absolute bottom-0 h-4 w-4',
                  message.from === 'buyer' ? 'right-0 -mr-2 bg-blue-500' : 'left-0 -ml-2 bg-gray-300',
                ]"
                :style="{
                  clipPath: message.from === 'buyer' ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)',
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Type your message..."
              class="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900"
            />
            <button
              @click="sendMessage"
              class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </USlideover>
  </div>
</template>
