<script setup lang="ts">
import { navigationMenu } from '#build/ui';
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Home',
    to: '/',
    icon: 'mdi-home',
  },
  {
    label: 'Anagrafiche',
    icon: 'mdi-database',
    children: [
      {
        label: 'Giocatori',
        to: '/giocatori',
        icon: 'mdi-account-multiple',
      },
      {
        label: 'Set',
        to: '/set',
        icon: 'mdi-cards-outline',
      },
      {
        label: 'Trigger',
        to: '/anagrafiche/trigger',
        icon: 'mdi-flash-outline',
      },
    ],
  },
  {
    label: 'Tornei',
    icon: 'mdi-trophy',
    children: [
      {
        label: 'Stagioni',
        to: '/tornei', // index stagioni (lista + crea + stagione attiva)
        icon: 'mdi-calendar-multiple',
      },
      {
        label: 'Stagione Attiva',
        to: '/tornei/attiva', // redirect/landing alla stagione attiva (se esiste)
        icon: 'mdi-star-circle',
      },
      {
        label: 'Classifica',
        to: '/tornei/attiva/classifica', // classifica stagione attiva
        icon: 'mdi-podium',
      },
      {
        label: 'Inserisci Risultati',
        to: '/tornei/attiva/risultati', // shortcut alla prossima/ultima tappa
        icon: 'mdi-clipboard-edit-outline',
      },
    ],
  },
])

</script>

<template>
  <div>
    <div class="grid grid-cols-12">
      <UNavigationMenu :items="items" orientation="vertical" class="col-span-2" />
      <div class="col-span-10">
        <slot />
      </div>
    </div>
  </div>
</template>
