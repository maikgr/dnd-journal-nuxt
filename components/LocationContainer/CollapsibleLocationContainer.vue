<script setup lang="ts">
import type { LocationInfo } from './types';

withDefaults(defineProps<LocationInfo>(), {
    description: 'Unknown'
})

const isExpanded = ref(false)

const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
}

</script>

<template>
    <div class="bg-nier-bg-primary border border-nier-primary">
        <!-- Header -->
        <div class="bg-nier-primary text-nier-text-inverse px-4 py-2">
            <div @click="toggleExpanded" class="flex justify-between">
                <p class="font-bold">{{ name }}</p>
                <font-awesome-icon :icon="isExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" class="w-4 h-4 mt-1" />
            </div>
        </div>

        <!-- Content -->
        <div v-show="isExpanded" class="px-4 py-1 font-mono">
            <div class="py-2" :class="notes ? 'border-b border-nier-border' : ''">
                <span class="whitespace-pre-wrap">{{ description }}</span>
            </div>
            
            <div v-if="notes" class="py-2">
                <p class="font-nier font-bold">Notes</p>
                <span class="whitespace-pre-wrap">{{ notes }}</span>
            </div>
        </div>
    </div>
</template>
