<script setup lang="ts">
interface Props {
    text: string
    isActive: boolean
}

defineProps<Props>()
</script>

<template>
    <button
      class="nier-main-button bg-nier-secondary font-nier px-4 py-2 font-semibold flex items-center w-full uppercase min-w-32 relative overflow-hidden"
      :class="{ 'active': isActive }">
        <span>{{ text }}</span>
    </button>
</template>

<style scoped>
.nier-main-button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background-color: theme('colors.nier.primary');
  transition: width 0.2s ease-in-out;
  z-index: 0;
}

.nier-main-button:hover::before {
  width: 100%;
}

.nier-main-button > * {
  position: relative;
  z-index: 1;
}

.nier-main-button:hover {
  color: theme('colors.nier.secondary');
}

.nier-main-button.active {
  background-color: theme('colors.nier.primary');
  color: theme('colors.nier.secondary');
}
</style> 