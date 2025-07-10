<script setup lang="ts">
interface Props {
  session: number
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious: boolean
  hasNext: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div class="p-4 mb-4">
    <div class="flex justify-center items-center gap-6 font-mono">
      <button 
        class="text-2xl text-nier-secondary opacity-80 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        @click="onPrevious"
        :disabled="!hasPrevious"
      >
        [<span class="text-nier-primary">&lt;</span>]
      </button>

      <Transition name="fade" mode="out-in">
        <div :key="`${session}`" class="text-nier-primary">
          <span class="text-lg font-semibold tracking-wide">Session {{ session }}</span>
        </div>
      </Transition>

      <button 
        class="text-2xl text-nier-secondary opacity-80 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        @click="onNext"
        :disabled="!hasNext"
      >
        [<span class="text-nier-primary">&gt;</span>]
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 