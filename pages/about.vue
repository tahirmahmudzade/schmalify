<script setup lang="ts">
const { t } = useI18n()

const team = [
  {
    name: 'Tahir Mahmudzade',
    role: 'Founder / Developer',
    description: 'Full Stack Developer with a passion for building products that people love.',
    imageUrl: '/img/team/tahir_mahmudzade.jpeg',
  },
  {
    name: 'Baris Eroglu',
    role: 'QA Engineer',
    description: 'I test it, perfect it, so you love it.',
    imageUrl: '/img/team/baris_eroglu.png',
  },
  {
    name: 'Ismail Mahili',
    role: 'AI Engineer',
    description: 'A passionate software developer focused on building innovative AI solutions using Python.',
    imageUrl: '/img/team/ismail_mahili.jpg',
  },
  {
    name: 'Kamila Mammadzada',
    role: 'UI/UX Designer',
    description:
      'Crafting intuitive and visually engaging digital experiences that connect users effortlessly with technology.',
    imageUrl: '/img/team/kamila_mamedzade.jpeg',
  },
  {
    name: 'Fahmin Mahili',
    role: 'AI Engineer',
    description: 'Innovating with machine learning and AI technologies to create impactful real-world solutions.',
    imageUrl: '/img/team/fahmin_mahili.jpeg',
  },
  {
    name: 'Oleksii Muzyka',
    role: 'UI/UX Designer',
    description: 'UI/UX Designer, responsible for user friendly design and marketing',
    imageUrl: '/img/team/oleksii_muzyka.jpeg',
  },
]

const teamDescription =
  'We’re a cozy group of students from Hochschule Schmalkalden, united by bright ideas and a shared passion for creating something meaningful. Together, we’re building a platform that brings our community closer, one project at a time.'
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 my-10 lg:px-8 text-center">
    <div class="mx-auto max-w-2xl">
      <h2 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{{ t('Our Team') }}</h2>
      <p class="mt-6 text-lg leading-8 text-gray-300">
        {{ t(teamDescription) }}
      </p>
    </div>
    <ul role="list" class="mx-auto mt-12 grid gap-x-8 gap-y-16 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <li v-for="person in team" :key="person.name" class="flex flex-col items-center">
        <NuxtImg
          :src="person.imageUrl"
          alt="profile"
          class="h-24 w-24 rounded-full mx-auto object-cover"
          :class="{ 'rotate-180': person.name === 'Oleksii Muzyka' }"
          format="webp"
        />
        <h3 class="mt-4 text-base font-semibold leading-7 tracking-tight text-white">{{ person.name }}</h3>
        <p class="text-sm leading-6 text-gray-400">{{ t(person.role) }}</p>
        <p class="mt-2 text-sm leading-6 text-gray-500 max-w-xs">{{ t(person.description) }}</p>
      </li>
    </ul>
  </div>
</template>
