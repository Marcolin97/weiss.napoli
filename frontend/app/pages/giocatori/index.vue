<script lang="ts" setup>
import type { User } from '~~/types/user'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const giocatori = ref<User[]>([
  {
    id: 1,
    nickname: 'Mario Rossi',
    discord: 'mario#1234',
  }
])

const selectedGiocatore = ref<User | null>(null)
const formData = ref({
  id: 0,
  nickname: '',
  discord: ''
})

const columns: TableColumn<User>[] = [
  {
    header: 'Nickname',
    accessorKey: 'nickname',
  },
  {
    header: 'Discord',
    accessorKey: 'discord',
  },
  {
    header: 'Azioni',
    cell: ({ row }) =>
      h(UButton, {
        icon: 'mdi-pencil',
        color: 'info',
        variant: 'soft',
        'aria-label': 'Actions dropdown',
        onClick: () => editGiocatore(row.original)
      })

  }
]

function editGiocatore(giocatore: User) {
  selectedGiocatore.value = giocatore
  formData.value = {
    id: giocatore.id,
    nickname: giocatore.nickname,
    discord: giocatore.discord || ''
  }
}

const salvaGiocatore = () => {
  if (!formData.value.nickname) {
    alert('Il nickname è obbligatorio.')
    return
  }
  if (selectedGiocatore.value) {
    giocatori.value = giocatori.value.map(g =>
      g.id === formData.value.id
        ? { ...g, nickname: formData.value.nickname, discord: formData.value.discord }
        : g
    )
    resetForm()
  } else {
    //creazione nuovo giocatore
    const newGiocatore: User = {
      id: Date.now(),
      nickname: formData.value.nickname,
      discord: formData.value.discord || ''
    }
    giocatori.value.push(newGiocatore)
    resetForm()
  }
}

function resetForm() {
  selectedGiocatore.value = null
  formData.value = { id: 0, nickname: '', discord: '' }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4 h-screen">
    <div class="col-span-8 p-2">

      <UCard class="">
        <template #header>
          <h1 class="text-3xl font-bold">Elenco Giocatori</h1>
        </template>
        <UTable :data="giocatori" :columns="columns" />
      </UCard>
    </div>
    <div class="col-span-4 border-l p-2 w-full">
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold">
            {{ selectedGiocatore ? 'Modifica Giocatore' : 'Nuovo Giocatore' }}
          </h2>
        </template>
        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Nickname">
            <UInput class="w-full" v-model="formData.nickname" placeholder="Inserisci nickname" />
          </UFormGroup>
          <UFormGroup label="Discord">
            <UInput v-model="formData.discord" placeholder="Inserisci discord" />
          </UFormGroup>

        </div>
        <template #footer>
          <div class="flex justify-between">
            <UButton @click="resetForm" color="neutral" variant="outline">
              Reset
            </UButton>
            <UButton @click="salvaGiocatore" color="primary">
              Salva
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<style></style>