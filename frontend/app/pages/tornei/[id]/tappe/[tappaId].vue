<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import type { User } from '~~/types/user'
import type { SetGioco } from '~~/types/deck'

type Tappa = {
  id: number
  stagioneId: number
  numero: number
  data: string
}

type PartecipazioneTappa = {
  id?: number
  tappaId: number
  userId: number
  assente: boolean
  posizione: number | null
  vittorie: number | null
  sconfitte: number | null
  setId: number | null
  bonus: number
  punti: number
}

type RigaUI = {
  userId: number
  nickname: string
  assente: boolean
  posizione: number | null
  vittorie: number | null
  sconfitte: number | null
  setId: number | null
  bonus: number
  punti: number
  totale: number
}

const route = useRoute()
const router = useRouter()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stagioneId = computed(() => Number(route.params.id))
const tappaId = computed(() => Number(route.params.tappaId))

/**
 * Punti fissi (adatta alle vostre regole)
 * Se una posizione non è presente qui -> 0
 */
const PUNTI_PER_POSIZIONE: Record<number, number> = {
  1: 12,
  2: 9,
  3: 6,
  4: 6,
  5: 3,
  6: 3,
  7: 3,
  8: 0,
  9: 0,
  10: 0,
}

// MOCK dati (poi sostituisci con API)
const tappa = ref<Tappa>({
  id: tappaId.value,
  stagioneId: stagioneId.value,
  numero: tappaId.value,
  data: '2025-08-30',
})

const players = ref<User[]>([
  { id: 1, nickname: 'Mario Rossi', discord: 'mario#1234' },
  { id: 2, nickname: 'Luigi', discord: 'luigi#0001' },
  { id: 3, nickname: 'Peach', discord: 'peach#7777' },
])

const sets = ref<SetGioco[]>([
  { id: 1, nome: 'Alice Gear Aegis' },
  { id: 2, nome: 'Steins;Gate' },
])

// MOCK risultati già esistenti (vuoto all’inizio)
const existing = ref<PartecipazioneTappa[]>([])

const righe = ref<RigaUI[]>([])
const isSaving = ref(false)

const positionOptions = computed(() =>
  Array.from({ length: Math.max(players.value.length, 10) }, (_, i) => i + 1).map(n => ({
    label: `${n}°`,
    value: n,
  }))
)

const setOptions = computed(() => [
  { label: '—', value: null },
  ...sets.value.map((s: any) => ({ label: s.nome, value: s.id })),
])

function puntiDaPosizione(pos: number | null) {
  if (!pos) return 0
  return PUNTI_PER_POSIZIONE[pos] ?? 0
}

function aggiornaRiga(row: RigaUI) {
  if (row.assente) {
    row.posizione = null
    row.vittorie = null
    row.sconfitte = null
    row.setId = null
    row.bonus = 0
    row.punti = 0
    row.totale = 0
    return
  }

  row.punti = puntiDaPosizione(row.posizione)
  row.totale = (row.punti ?? 0) + (row.bonus ?? 0)
}

function buildRighe() {
  const map = new Map<number, PartecipazioneTappa>()
  for (const p of existing.value) map.set(p.userId, p)

  righe.value = players.value.map((u: any) => {
    const saved = map.get(u.id)

    // se non esiste -> default assente (così compili solo chi c’è)
    const assente = saved ? saved.assente : true

    const row: RigaUI = {
      userId: u.id,
      nickname: u.nickname,
      assente,

      posizione: saved?.posizione ?? null,
      vittorie: saved?.vittorie ?? null,
      sconfitte: saved?.sconfitte ?? null,
      setId: saved?.setId ?? null,

      bonus: saved?.bonus ?? 0,
      punti: saved?.punti ?? 0,
      totale: 0,
    }

    aggiornaRiga(row)
    return row
  })
}

function resetTappa() {
  if (!confirm('Vuoi resettare tutti i risultati di questa tappa?')) return
  existing.value = []
  buildRighe()
}

/**
 * Validazione: posizioni duplicate tra presenti
 */
function validate(): string[] {
  const errors: string[] = []
  const used = new Map<number, number>() // posizione -> userId

  for (const r of righe.value) {
    if (r.assente) continue
    if (!r.posizione) {
      errors.push(`Manca la posizione per ${r.nickname}.`)
      continue
    }
    if (used.has(r.posizione)) {
      errors.push(`Posizione duplicata: ${r.posizione}° (controlla ${r.nickname}).`)
    } else {
      used.set(r.posizione, r.userId)
    }
  }
  return errors
}

async function save() {
  const errors = validate()
  if (errors.length) {
    alert(errors.join('\n'))
    return
  }

  isSaving.value = true
  try {
    // payload batch (poi chiamerai l’API)
    const payload: PartecipazioneTappa[] = righe.value.map(r => ({
      tappaId: tappaId.value,
      userId: r.userId,
      assente: r.assente,
      posizione: r.assente ? null : r.posizione,
      vittorie: r.assente ? null : r.vittorie,
      sconfitte: r.assente ? null : r.sconfitte,
      setId: r.assente ? null : r.setId,
      bonus: r.assente ? 0 : r.bonus,
      punti: r.assente ? 0 : r.punti,
    }))

    // MOCK: salva in memoria come se fosse risposta API
    existing.value = payload
    buildRighe()

    alert('Salvato!')
  } finally {
    isSaving.value = false
  }
}

// init
buildRighe()

const columns: TableColumn<RigaUI>[] = [
  { header: 'Giocatore', accessorKey: 'nickname' },
  { header: 'Assente', accessorKey: 'assente' },
  { header: 'Posizione', accessorKey: 'posizione' },
  { header: 'W-L', accessorKey: 'wl' },
  { header: 'Set', accessorKey: 'set' },
  { header: 'Bonus', accessorKey: 'bonus' },
  { header: 'Punti', accessorKey: 'punti' },
  { header: 'Totale', accessorKey: 'totale' },
]
</script>

<template>
  <div class="p-2 space-y-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold">
              Inserisci risultati · Tappa {{ tappa.numero }}
            </h1>
            <p class="text-sm opacity-70">
              {{ tappa.data }} · Stagione {{ stagioneId }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UButton icon="mdi-arrow-left" color="neutral" variant="outline"
              @click="router.push(`/tornei/${stagioneId}`)">
              Indietro
            </UButton>

            <UButton icon="mdi-refresh" color="neutral" variant="soft" @click="resetTappa">
              Reset tappa
            </UButton>

            <UButton icon="mdi-content-save" color="primary" :loading="isSaving" @click="save">
              Salva
            </UButton>
          </div>
        </div>
      </template>

      <UTable :data="righe" :columns="columns">
        <template #nickname-data="{ row }">
          <div class="font-medium">
            {{ row.original.nickname }}
          </div>
        </template>

        <template #assente-data="{ row }">
          <UCheckbox v-model="row.original.assente" @update:model-value="() => aggiornaRiga(row.original)" />
        </template>

        <template #posizione-data="{ row }">
          <USelect v-model="row.original.posizione" :options="positionOptions" :disabled="row.original.assente"
            placeholder="—" @update:model-value="() => aggiornaRiga(row.original)" />
        </template>

        <template #wl-data="{ row }">
          <div class="flex items-center gap-2">
            <UInput v-model.number="row.original.vittorie" type="number" min="0" class="w-16"
              :disabled="row.original.assente" placeholder="W" @input="() => aggiornaRiga(row.original)" />
            <span class="opacity-60">-</span>
            <UInput v-model.number="row.original.sconfitte" type="number" min="0" class="w-16"
              :disabled="row.original.assente" placeholder="L" @input="() => aggiornaRiga(row.original)" />
          </div>
        </template>

        <template #set-data="{ row }">
          <USelect v-model="row.original.setId" :options="setOptions" :disabled="row.original.assente"
            @update:model-value="() => aggiornaRiga(row.original)" />
        </template>

        <template #bonus-data="{ row }">
          <UInput v-model.number="row.original.bonus" type="number" class="w-24" :disabled="row.original.assente"
            @input="() => aggiornaRiga(row.original)" />
        </template>

        <template #punti-data="{ row }">
          <UBadge variant="soft" color="neutral">
            {{ row.original.punti }}
          </UBadge>
        </template>

        <template #totale-data="{ row }">
          <UBadge variant="soft" color="primary">
            {{ row.original.totale }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
