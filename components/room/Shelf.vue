<script setup lang="ts">
const{topAlbums,playAlbum}=useSpotify()
</script>
<template>
  <div class="grid grid-cols-5 gap-1">
    <div v-for="a in topAlbums" :key="a.id" @click="playAlbum(a.id)" class="w-8 h-24 bg-pink-500"></div>
  </div>
</template>
