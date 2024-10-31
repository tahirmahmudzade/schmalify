<script setup>
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value
})

function updateLocale(event) {
  setLocale(event.target.value)
}

onMounted(() => {
  const langSwitcher = document.querySelector('#langSwitcher')
  langSwitcher.value = locale.value
})
</script>

<template>
  <div mt-5 flex items-center gap2>
    Language:
    <select id="langSwitcher" rounded-md p-1 text-sm @change="updateLocale">
      <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code" p-1>
        {{ loc.name }}
      </option>
    </select>
  </div>
</template>
