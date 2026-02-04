<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

type Stagione = {
  id: number
  nome: string
  anno: number
  numeroTappe: number
  isAttiva: boolean
}

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const router = useRouter()

// Mock dati (poi sostituisci con fetch API)
const stagioni = ref<Stagione[]>([
  { id: 1, nome: 'Torneo Mega Galattico', anno: 2025, numeroTappe: 6, isAttiva: true },
  { id: 2, nome: 'Winter Cup', anno: 2024, numeroTappe: 6, isAttiva: false },
])

const selectedStagione = ref<Stagione | null>(null)
const formData = ref<Stagione>({
  id: 0,
  nome: '',
  anno: new Date().getFullYear(),
  numeroTappe: 6,
  isAttiva: false,
})

function editStagione(s: Stagione) {
  selectedStagione.value = s
  formData.value = { ...s }
}

function resetForm() {
  selectedStagione.value = null
  formData.value = {
    id: 0,
    nome: '',
    anno: new Date().getFullYear(),
    numeroTappe: 6,
    isAttiva: false,
  }
}

function setAttiva(id: number) {
  stagioni.value = stagioni.value.map(s => ({
    ...s,
    isAttiva: s.id === id,
  }))
}

function salvaStagione() {
  if (!formData.value.nome.trim()) {
    alert('Il nome è obbligatorio.')
    return
  }
  if (!formData.value.anno || formData.value.anno < 2000) {
    alert('Anno non valido.')
    return
  }
  if (!formData.value.numeroTappe || formData.value.numeroTappe < 1) {
    alert('Numero tappe non valido.')
    return
  }

  if (selectedStagione.value) {
    // update
    stagioni.value = stagioni.value.map(s =>
      s.id === formData.value.id
        ? { ...s, ...formData.value }
        : s
    )

    // se la stagione aggiornata è attiva, disattiva le altre
    if (formData.value.isAttiva) setAttiva(formData.value.id)

    resetForm()
    return
  }

  // create
  const newId = Math.max(0, ...stagioni.value.map(s => s.id)) + 1
  const nuova: Stagione = { ...formData.value, id: newId }

  stagioni.value.push(nuova)

  if (nuova.isAttiva) setAttiva(nuova.id)

  resetForm()
}

function eliminaStagione(id: number) {
  if (!confirm('Vuoi eliminare questa stagione?')) return
  stagioni.value = stagioni.value.filter(s => s.id !== id)
  if (selectedStagione.value?.id === id) resetForm()
}

function apriStagione(id: number) {
  router.push(`/tornei/${id}`)
}

const columns: TableColumn<Stagione>[] = [
  { header: 'Nome', accessorKey: 'nome' },
  { header: 'Anno', accessorKey: 'anno' },
  { header: 'Tappe', accessorKey: 'numeroTappe' },
  {
    header: 'Stato',
    cell: ({ row }) =>
      h(UBadge, { color: row.original.isAttiva ? 'primary' : 'neutral', variant: 'soft' }, () =>
        row.original.isAttiva ? 'Attiva' : 'Archiviata'
      ),
  },
  {
    header: 'Azioni',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          icon: 'mdi-open-in-new',
          color: 'primary',
          variant: 'soft',
          onClick: () => apriStagione(row.original.id),
        }),
        h(UButton, {
          icon: 'mdi-pencil',
          color: 'info',
          variant: 'soft',
          onClick: () => editStagione(row.original),
        }),
        h(UButton, {
          icon: 'mdi-delete',
          color: 'error',
          variant: 'soft',
          onClick: () => eliminaStagione(row.original.id),
        }),
      ]),
  },
]
</script>

<template>
  <div class="grid grid-cols-12 gap-4 min-h-[calc(100vh-1rem)] p-2">
    <!-- LISTA -->
    <div class="col-span-8">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold">Stagioni</h1>
            <UButton icon="mdi-plus" color="primary" variant="soft" @click="resetForm">
              Nuova
            </UButton>
          </div>
        </template>

        <UTable :data="stagioni" :columns="columns" />
      </UCard>
    </div>

    <!-- FORM -->
    <div class="col-span-4 border-l p-2 w-full">
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold">
            {{ selectedStagione ? 'Modifica Stagione' : 'Nuova Stagione' }}
          </h2>
        </template>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup class="col-span-2" label="Nome">
            <UInput v-model="formData.nome" placeholder="Es. Torneo Mega Galattico" />
          </UFormGroup>

          <UFormGroup label="Anno">
            <UInput v-model.number="formData.anno" type="number" min="2000" />
          </UFormGroup>

          <UFormGroup label="Numero tappe">
            <UInput v-model.number="formData.numeroTappe" type="number" min="1" />
          </UFormGroup>

          <UFormGroup class="col-span-2" label="Stagione attiva">
            <div class="flex items-center gap-3">
              <UCheckbox v-model="formData.isAttiva" />
              <span class="text-sm opacity-70">
                Se la attivi, le altre verranno disattivate automaticamente.
              </span>
            </div>
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton @click="resetForm" color="neutral" variant="outline">
              Reset
            </UButton>
            <UButton @click="salvaStagione" color="primary">
              Salva
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
