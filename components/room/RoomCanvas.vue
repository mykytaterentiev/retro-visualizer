<script setup lang="ts">
import { onMounted, onUnmounted, ref, onBeforeUnmount } from 'vue';
import { useCanvas } from '@/composables/useCanvas';
import type p5 from 'p5';

const { initCanvas } = useCanvas();
const canvasContainerRef = ref<HTMLElement | null>(null);
let p5Instance = ref<p5 | undefined>(undefined);

// Ensure any previous canvas is properly removed
const cleanupCanvas = () => {
  if (p5Instance.value) {
    p5Instance.value.remove();
    p5Instance.value = undefined;
  }
  if (canvasContainerRef.value) {
    canvasContainerRef.value.innerHTML = '';
  }
};

onMounted(async () => {
  // Make sure we clean up first to prevent duplicates
  cleanupCanvas();
  
  if (canvasContainerRef.value) {
    p5Instance.value = await initCanvas(canvasContainerRef.value);
  }
});

// Clean up on both unmount events to ensure proper cleanup
onBeforeUnmount(cleanupCanvas);
onUnmounted(cleanupCanvas);
</script>
<template>
  <div 
    id="canvas-container" 
    ref="canvasContainerRef" 
    class="w-full h-full relative overflow-hidden" 
  ></div>
</template>

<style scoped>
:deep(canvas) {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important; /* Force width even if p5 tries to set inline style */
  height: 100% !important; /* Force height even if p5 tries to set inline style */
  object-fit: contain; /* Maintain aspect ratio */
}
</style>
