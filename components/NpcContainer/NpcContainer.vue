<script setup lang="ts">
import type { NpcInfo } from './types';

withDefaults(defineProps<NpcInfo>(), {
    name: 'Unknown',
    location: 'Unknown',
    description: 'Unknown',
    notes: 'Unknown',
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
            <div class="border-b border-nier-border py-2">
                <p class="font-nier font-bold">Description</p>
                <span>{{ description }}</span>
            </div>
            
            <div class="border-b border-nier-border py-2">
                <p class="font-nier font-bold">Notes</p>
                <span>{{ notes }}</span>
            </div>
            
            <div class="py-2">
                <p class="font-nier font-bold">Location</p>
                <span>{{ location }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>