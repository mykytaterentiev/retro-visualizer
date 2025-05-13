<script setup lang="ts">
onMounted(async () => {
  const code = useRoute().query.code as string | undefined
  console.log('[callback.vue] query', code?.slice(0, 8))

  try {
    const r = await $fetch('/api/spotify/callback', {
      method: 'POST',
      body: { code },
      credentials: 'include'
    })
    console.log('[callback.vue] POST /callback ->', r)
    useCookie('authed').value = '1'          // client copy
    await nextTick()                         // ensure reactivity :contentReference[oaicite:2]{index=2}
    console.log('[callback.vue] cookie now', useCookie('authed').value)
    navigateTo('/room')
  } catch (e) {
    console.error('[callback.vue] exchange failed', e)
    navigateTo('/')
  }
})
</script>
<template><p>Authorising…</p></template>
