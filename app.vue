<script setup lang="ts">
useHead({
  titleTemplate: title => (title ? `${title} · Schmalify` : 'Schmalify: Student Deals in Schmalkalden!'),
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', type: 'image/png', href: '/img/logo-title.png' }],
  htmlAttrs: { lang: 'en' },
})

useSeoMeta({ ogSiteName: 'Schmalify', ogType: 'website' })
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtRouteAnnouncer politeness="polite">
    <template #default="{ message }">
      <p>{{ message }} was loaded.</p>
    </template>
  </NuxtRouteAnnouncer>

  <!-- Flex container for the entire page -->
  <div class="app-container">
    <!-- Content section grows to fill available space -->
    <div class="content-container">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>

  <UModals />
  <UNotifications />
</template>

<style scoped>
html,
body,
#__nuxt {
  height: 100%; /* Ensure the page takes the full viewport height */
  margin: 0;
  padding: 0;
  background: #111827;
  color: white;
  color-scheme: dark;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures the container takes up at least the full viewport height */
}

.content-container {
  flex-grow: 1; /* This makes the content grow to fill available space */
}
</style>
