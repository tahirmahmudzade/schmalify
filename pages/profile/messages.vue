<script setup lang="ts">
import type { Conversation } from '~/server/database/drizzle'

const { user } = useUserSession()

const isConversationOpen = useProfileConversationState()

const { data: conversationsData, error } = await useFetch(`/api/users/${user.value?.id}/conversations`)

if (error.value || !conversationsData.value) {
  throw createError({ statusCode: 404, message: 'Failed to load conversations' })
}

const conversations = conversationsData.value.conversations

const selectedConversation = ref<Conversation | null>(null)

function openConversation(conversation: Conversation) {
  isConversationOpen.value = true
  selectedConversation.value = conversation
}
</script>

<template>
  <div>
    <UDashboardPage>
      <UDashboardPanel id="inbox" :width="1000" :resizable="{ min: 300, max: 1000 }">
        <UDashboardNavbar title="Inbox" :badge="conversations.length" />
        <UDashboardPanelContent class="p-0">
          <div v-for="(conversation, index) in conversations" :key="index">
            <div class="p-4 text-sm cursor-pointer border-l-2" @click="openConversation(conversation)">
              <InboxList :conversation="conversation" />
            </div>
            <UDivider />
          </div>
        </UDashboardPanelContent>
      </UDashboardPanel>
      <USlideover v-model="isConversationOpen">
        <InboxChat v-if="selectedConversation" :conversation="selectedConversation" />
      </USlideover>
    </UDashboardPage>
  </div>
</template>
