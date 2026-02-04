<script setup lang="ts">
const router = useRouter()
const activeSeasonId = 1
const nextTappaId = 1
await router.replace(`/tornei/${activeSeasonId}/tappe/${nextTappaId}`)
</script>

<template>
  <div class="p-4 opacity-70">Reindirizzamento…</div>
</template>
