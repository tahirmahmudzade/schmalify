<template>
  <NuxtLoadingIndicator />
  <NuxtRouteAnnouncer politeness="polite">
    <template #default="{ message }">
      <p>{{ message }} was loaded.</p>
    </template>
  </NuxtRouteAnnouncer>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <UModals />
  <UNotifications />
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #111827;
  color: white;
  color-scheme: dark;
}
</style>
