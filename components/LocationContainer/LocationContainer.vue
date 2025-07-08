<script setup lang="ts">
import type { LocationInfo } from './types';

withDefaults(defineProps<LocationInfo>(), {
    description: 'Unknown'
})
</script>

<template>
    <div class="bg-nier-bg-primary border border-nier-primary">
        <!-- Header -->
        <div class="bg-nier-primary text-nier-text-inverse px-4 py-2">
            <div class="flex justify-between">
                <p class="font-bold">{{ name }}</p>
            </div>
        </div>

        <!-- Content -->
        <div class="px-4 py-1 font-mono">
            <div class="py-2" :class="notes ? 'border-b border-nier-border' : ''">
                <p class="font-nier font-bold">Description</p>
                <span class="whitespace-pre-wrap">{{ description }}</span>
            </div>
            
            <div v-if="notes" class="py-2">
                <p class="font-nier font-bold">Notes</p>
                <span class="whitespace-pre-wrap">{{ notes }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>