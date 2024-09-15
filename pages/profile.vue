<script setup lang="ts">
function logout() {
  $fetch('/api/auth/logout', { method: 'GET' })
    .then(() => reloadNuxtApp({ path: '/', force: true }))
    .catch(() => {
      console.log('Failed to logout')
    })
}
</script>

<template>
  <div>
    <AuthState v-slot="{ loggedIn, clear, user }">
      <div v-if="loggedIn">
        <h1>Welcome, {{ user?.email }} or {{ user?.username }}</h1>
        <button @click="logout">Logout</button>
      </div>
      <div v-else>You are not logged in!</div>
    </AuthState>
  </div>
</template>
