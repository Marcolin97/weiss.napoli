<script setup lang="ts">
const router = useRouter()

// MOCK: poi sostituisci con fetch /api/stagioni/attiva
const activeSeasonId = 1

await router.replace(`/tornei/${activeSeasonId}`)
</script>

<template>
  <div class="p-4 opacity-70">Reindirizzamento…</div>
</template>
