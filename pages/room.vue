<script setup lang="ts">
definePageMeta({ middleware: 'auth' as any })
const { fetchTop } = useSpotify()
onMounted(fetchTop)
</script>

<template>
  <RoomShelf />
</template>
