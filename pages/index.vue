<script setup lang="ts">
const authed = useCookie('authed').value === '1'
console.log('[index.vue] authed=', authed)
if (authed) navigateTo('/room')
</script>
<template><button @click="useAuth().login()">Log in with Spotify</button></template>
