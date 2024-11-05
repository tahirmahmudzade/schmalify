<script setup lang="ts">
import type { Item } from '~/server/database/drizzle'

const route = useRoute('items-id')

const { user } = useUserSession()
const { t } = useI18n()

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
  throw createError({ statusCode: 404, message: t('Item might be already sold or removed, please check back later') })
}

const { item } = itemData.value

const isChatboxOpen = useChatboxState()

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
  condition: item.condition || t('Not specified'),
  location: item.seller?.location || t('Not specified'),
  postedOn: formatDateToDDMMYYYY(item.createdAt!),
})

const selectedImage = ref<string | null>()

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
            :condition="product.condition as Condition"
            :location="product.location"
            :postedOn="product.postedOn"
            :categoryName="item.category?.name!"
          />
          <div v-if="user?.id !== item.seller_id" class="mt-6">
            <ContactSeller :status="item.status" :phone="item.seller?.phone!" :title="item.title" />
          </div>
        </div>
      </div>
    </div>
    <ModalsImagePreviewModal v-if="selectedImage" :imageUrl="selectedImage" @close="selectedImage = null" />
    <ChatSlideOver
      v-if="isChatboxOpen"
      :item-id="item.id"
      :seller-name="item.seller?.username || `${item.seller?.firstName} ${item.seller?.lastName}`"
    />
  </div>
</template>
