<script setup lang="ts">
const router = useRouter()
const activeSeasonId = 1
await router.replace(`/tornei/${activeSeasonId}#classifica`)
</script>

<template>
  <div class="p-4 opacity-70">Reindirizzamento…</div>
</template>
