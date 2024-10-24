<script setup lang="ts">
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
    description: 'Lisa is a key developer in building and maintaining our platform.',
    imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Lindsey Cooper',
    role: 'Designer',
    description: 'Lindsey designs beautiful and user-friendly interfaces for our users.',
    imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Tina Lee',
    role: 'CEO',
    description: 'Tina provides visionary leadership and guides the company’s strategy.',
    imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Chris Lee',
    role: 'CTO',
    description: 'Chris oversees the tech stack and drives the development of new features.',
    imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Dawn Wilson',
    role: 'Designer',
    description: 'Dawn works on crafting intuitive designs that enhance user experience.',
    imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=150&h=150&q=80',
  },
]
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 mt-12 sm:my-20 mb-12 lg:px-8 text-center">
    <div class="mx-auto max-w-2xl">
      <h2 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Our Team</h2>
      <p class="mt-6 text-lg leading-8 text-gray-300">
        We’re a cozy group of students from Hochschule Schmalkalden, united by bright ideas and a shared passion for creating
        something meaningful. Together, we’re building a platform that brings our community closer, one project at a time.
      </p>
    </div>
    <ul role="list" class="mx-auto mt-12 grid gap-x-8 gap-y-16 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <li v-for="person in team" :key="person.name" class="flex flex-col items-center">
        <img :src="person.imageUrl" alt="" class="h-24 w-24 rounded-full mx-auto object-cover" />
        <h3 class="mt-4 text-base font-semibold leading-7 tracking-tight text-white">{{ person.name }}</h3>
        <p class="text-sm leading-6 text-gray-400">{{ person.role }}</p>
        <p class="mt-2 text-sm leading-6 text-gray-500 max-w-xs">{{ person.description }}</p>
      </li>
    </ul>
  </div>
</template>
