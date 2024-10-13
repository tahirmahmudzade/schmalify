<template>
  <VitePwaManifest />
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

    <!-- Footer will stick to the bottom -->
    <UFooter class="footer">
      <template #left> Copyright © {{ new Date().getFullYear() }} </template>
      <template #right> <p class="text-md font-bold italic">Schmalify</p> </template>
    </UFooter>
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

.footer {
  background: #1f2937;
  color: white;
  padding: 1rem;
  text-align: center;
}
</style>
