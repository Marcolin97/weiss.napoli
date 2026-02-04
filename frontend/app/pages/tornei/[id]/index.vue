<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

type Stagione = {
  id: number
  nome: string
  anno: number
  numeroTappe: number
  isAttiva: boolean
}

type Tappa = {
  id: number
  stagioneId: number
  numero: number
  data: string
  completata: boolean
}

type RigaClassifica = {
  userId: number
  nickname: string
  puntiTotali: number
}

const route = useRoute()
const router = useRouter()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stagioneId = computed(() => Number(route.params.id))

// MOCK: poi sostituisci con API
const stagione = ref<Stagione>({
  id: stagioneId.value,
  nome: 'Torneo Mega Galattico',
  anno: 2025,
  numeroTappe: 6,
  isAttiva: true,
})

// MOCK tappe: per ora le genero qui (poi le farai arrivare dall’API)
const tappe = ref<Tappa[]>(Array.from({ length: stagione.value.numeroTappe }, (_, i) => ({
  id: i + 1,
  stagioneId: stagione.value.id,
  numero: i + 1,
  data: '',
  completata: false,
})))

// MOCK classifica: poi la calcoli dalle partecipazioni
const classifica = ref<RigaClassifica[]>([
  { userId: 1, nickname: 'Mario Rossi', puntiTotali: 21 },
  { userId: 2, nickname: 'Luigi', puntiTotali: 18 },
])

function apriTappa(tappaId: number) {
  router.push(`/tornei/${stagioneId.value}/tappe/${tappaId}`)
}

function setDataTappa(t: Tappa, value: string) {
  t.data = value
}

function toggleCompletata(t: Tappa) {
  t.completata = !t.completata
}

const columnsTappe: TableColumn<Tappa>[] = [
  { header: 'N°', accessorKey: 'numero' },
  {
    header: 'Data',
    cell: ({ row }) =>
      h('input', {
        class:
          'w-44 rounded-md border border-gray-200 bg-transparent px-2 py-1 text-sm',
        type: 'date',
        value: row.original.data,
        onInput: (e: Event) => setDataTappa(row.original, (e.target as HTMLInputElement).value),
      }),
  },
  {
    header: 'Stato',
    cell: ({ row }) =>
      h(UBadge, { color: row.original.completata ? 'primary' : 'neutral', variant: 'soft' }, () =>
        row.original.completata ? 'Completata' : 'Da compilare'
      ),
  },
  {
    header: 'Azioni',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          icon: 'mdi-clipboard-edit-outline',
          color: 'primary',
          variant: 'soft',
          onClick: () => apriTappa(row.original.id),
        }),
        h(UButton, {
          icon: row.original.completata ? 'mdi-check-circle' : 'mdi-circle-outline',
          color: row.original.completata ? 'primary' : 'neutral',
          variant: 'soft',
          onClick: () => toggleCompletata(row.original),
        }),
      ]),
  },
]

const columnsClassifica: TableColumn<RigaClassifica>[] = [
  { header: '#', cell: ({ row, table }) => String(table.getRowModel().rows.findIndex(r => r.id === row.id) + 1) },
  { header: 'Giocatore', accessorKey: 'nickname' },
  { header: 'Punti', accessorKey: 'puntiTotali' },
]
</script>

<template>
  <div class="p-2 space-y-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold">{{ stagione.nome }}</h1>
            <p class="text-sm opacity-70">{{ stagione.anno }} · {{ stagione.numeroTappe }} tappe</p>
          </div>

          <div class="flex items-center gap-2">
            <UBadge :color="stagione.isAttiva ? 'primary' : 'neutral'" variant="soft">
              {{ stagione.isAttiva ? 'Attiva' : 'Archiviata' }}
            </UBadge>
          </div>
        </div>
      </template>

      <UTabs :items="[{ label: 'Classifica' }, { label: 'Tappe' }]" class="w-full">
        <template #content="{ item }">
          <div v-if="item.label === 'Classifica'" class="space-y-3">
            <UTable :data="classifica" :columns="columnsClassifica" />
          </div>

          <div v-else class="space-y-3">
            <UTable :data="tappe" :columns="columnsTappe" />
          </div>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>
