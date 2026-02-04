<script lang="ts" setup>
import type { Trigger } from '~~/types/deck'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')

const triggers = ref<Trigger[]>([
  {
    id: 1,
    nome: '2 Soul',
    iconKey: '2soul.png',
  },
  {
    id: 2,
    nome: 'Book',
    iconKey: 'book.png',
  }
])

const columns: TableColumn<Trigger>[] = [
  {
    header: 'Nome',
    accessorKey: 'nome',
  },
  {
    header: 'Descrizione',
    accessorKey: 'nome',
  },
  {
    header: 'ICONA',
    accessorKey: 'iconKey',
    cell: ({ row }) => h(UAvatar, {
      src: `/trigger/${row.original.iconKey}`,
      width: 32,
      height: 32,
      size: 'xl',
    })
  }
]

const aggiungiTrigger = () => {
  // Logic to add a new trigger
}
</script>

<template>
  <div class="p-2">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Gestione Trigger</h1>
          <UButton color="primary" @click="aggiungiTrigger()">Aggiungi Trigger</UButton>
        </div>
      </template>
      <UTable :data="triggers" :columns="columns" />
    </UCard>
  </div>
</template>

<style></style>