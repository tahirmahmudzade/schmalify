<script setup lang="ts">
function logout(clear: () => Promise<void>) {
  clear()
  console.log('Logged out')

  reloadNuxtApp({ path: '/' })
  console.log('Reloaded')
}
</script>

<template>
  <AuthState v-slot="{ loggedIn, clear, user }">
    <div v-if="loggedIn">
      <h1>Welcome, {{ user?.email }} or {{ user?.username }}</h1>
      <button @click="logout(clear)">Logout</button>
    </div>
    <div v-else>You are not logged in!</div>
  </AuthState>
</template>
