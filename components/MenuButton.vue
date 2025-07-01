<script setup lang="ts">
interface Props {
    text: string
    linkPath: string
    isActive: boolean
    fwIcon?: string[]
}

defineProps<Props>()
</script>

<template>
    <NuxtLink :to="linkPath" :prefetch="true" class="nier-button flex items-center w-full" :class="{ 'active': isActive }">
        <font-awesome-icon v-if="fwIcon" :icon="fwIcon" class="w-4 h-4 mr-3 flex-shrink-0" />
        <span>{{ text }}</span>
    </NuxtLink>
</template>

<style>

.nier-button {
  background-color: var(--button-bg);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 120px;
  position: relative;
  overflow: hidden;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

.nier-button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background-color: var(--primary-color);
  transition: width 0.2s ease-in-out;
  z-index: 0;
}

.nier-button:hover::before {
  width: 100%;
}

.nier-button > * {
  position: relative;
  z-index: 1;
}

.nier-button:hover {
  color: var(--button-bg);
}

.nier-button.active {
  background-color: var(--primary-color);
  color: var(--button-bg);
}
</style>