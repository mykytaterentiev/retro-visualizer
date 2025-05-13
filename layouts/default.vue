<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const logical = 768                                // native scene size
const { width, height } = useWindowSize()
const scale = computed(() => Math.min(
  width.value  / logical,
  height.value / logical
))
</script>

<template>
  <!-- full-screen black background -->
  <div class="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
    <!-- centre-scaled square -->
    <div
      class="origin-center relative"
      :style="{
        width:  logical + 'px',
        height: logical + 'px',
        transform: `scale(${scale})`
      }">
      <RoomCanvas />
    </div>
  </div>

  <!-- overlays (Shelf, HUD…) are slotted here -->
  <slot />
</template>

<style scoped>
:deep(canvas) { image-rendering: pixelated; }
</style>
