<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFetch } from 'nuxt/app'
import { createError } from 'h3'

const route = useRoute()

const { data: itemData, error } = await useFetch(`/api/items/${route.params.id}`)

if (error.value) {
  throw createError({
    statusCode: 404,
    message: 'Item might be already sold or removed, please check back later',
  })
}

const { item } = itemData.value!
</script>

<template>
  <div class="item-page">
    <div class="item-container">
      <div class="image-container">
        <img class="item-image" :src="`/api/blob/${item.id}/serveImg`" alt="Item Image" />
      </div>

      <div class="item-info">
        <UBlogPost
          :title="item.title"
          :description="item.description || ''"
          :date="item.seller?.username || `${item.seller?.firstName} ${item.seller?.lastName}`"
          orientation="horizontal"
          :authors="[
            {
              name: item.seller?.username || `${item.seller?.firstName} ${item.seller?.lastName}`,
              avatar: { src: getProfilePicUrl(item.seller?.avatar, item.seller_id), size: 'lg' },
            },
          ]"
          :badge="{ label: formatDateToDDMMYYYY(item.createdAt!), size: 'lg' }"
          :ui="{
            title:
              'text-gray-900 dark:text-gray-900 text-xl font-semibold truncate group-hover:text-gray-900 dark:group-hover:text-gray-900',
            description: 'text-base text-gray-700 dark:text-gray-700 mt-1',
          }"
        />

        <div class="item-details">
          <div class="detail-item">
            <Icon name="mdi:hammer-wrench" class="detail-icon" />
            <span class="detail-label">Condition:</span>
            <span class="detail-value">{{ item.condition }}</span>
          </div>

          <div class="detail-item">
            <Icon name="mdi:map-marker" class="detail-icon" />
            <span class="detail-label">Location:</span>
            <span class="detail-value">{{ item.seller?.location || 'Not specified' }}</span>
          </div>

          <div class="detail-item">
            <Icon name="mdi:folder" class="detail-icon" />
            <span class="detail-label">Category:</span>
            <span class="detail-value">{{ item.category?.name || 'General' }}</span>
          </div>

          <div class="detail-item">
            <Icon name="mdi:calendar" class="detail-icon" />
            <span class="detail-label">Posted on:</span>
            <span class="detail-value">{{ formatDateToDDMMYYYY(item.createdAt!) }}</span>
          </div>
        </div>

        <button class="contact-seller-button">Contact Seller</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-page {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.item-container {
  width: 100%;
  max-width: 900px;
  height: 400px;
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  color: #333;
}

.image-container {
  flex: 1;
  background-color: #f5f5f5;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.item-info {
  flex: 1.2;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #000;
}

.item-price {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #e60023;
}

.item-details {
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Updated Details Styling */
.detail-item {
  display: flex;
  align-items: center;
}

.detail-icon {
  font-size: 1.5rem;
  color: #007bff;
  margin-right: 10px;
}

.detail-label {
  font-weight: 600;
  margin-right: 5px;
  color: #495057;
}

.detail-value {
  font-size: 1.1rem;
  color: #6c757d;
}

.contact-seller-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-end;
}

.contact-seller-button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .item-container {
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  .item-details {
    margin-top: 15px; /* Add margin to create space between sections */
  }

  .item-image {
    max-width: 100%;
    height: auto;
  }

  .item-info {
    padding: 10px;
  }

  .item-price {
    font-size: 1.5rem;
  }
}
</style>
