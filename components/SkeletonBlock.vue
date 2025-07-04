<script setup lang="ts">
withDefaults(defineProps<{
    height: string
}>(), {
    height: 'h-12'
})
</script>

<template>
    <div class="bg-nier-primary opacity-50 rounded animate-pulse" :class="height" />
</template>