<script setup lang="ts">
import type { BlockListItem } from './types';
interface Props {
    pending?: boolean;
    error?: string | null;
    items: BlockListItem[];
    selectedItemId: string | null;
}

withDefaults(defineProps<Props>(), {
    pending: false,
    error: null,
    items: () => [],
    selectedItemId: null,
});

const emit = defineEmits<{
    click: [id: string];
}>();

const onClick = (id: string) => {
    emit('click', id);
}
const skeletonCount = 6;
</script>

<template>
    <div class="block-list bg-nier-bg-primary relative shadow-nier border border-nier-border">
        <div v-if="pending" class="block-list-content space-y-4 p-4">
            <SkeletonBlock v-for="i in skeletonCount" :key="i"/>
        </div>
        <div v-else-if="error" class="block-list-content text-red-500 p-4">
            Error: {{ error }}
        </div>
        <div v-else class="block-list-content">
            <BlockListItem :items="items" :selectedItemId="selectedItemId" @click="onClick"/>
        </div>
    </div>
</template>

<style scoped>
.block-list {
    position: relative;
    height: auto;
    max-height: calc(100vh - 24rem);
    overflow: hidden; /* Contain the scrolling content */
}

.block-list-content {
    height: 100%;
    max-height: inherit;
    overflow-y: auto;
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #454138 #bab5a1;
    /* Ensure content is properly contained */
    position: relative;
    width: 100%;
}

/* For Webkit browsers (Chrome, Safari) */
.block-list-content::-webkit-scrollbar {
    width: 8px;
}

.block-list-content::-webkit-scrollbar-track {
    background: #bab5a1;
}

.block-list-content::-webkit-scrollbar-thumb {
    background-color: #454138;
    border: 2px solid #bab5a1;
    border-radius: 4px;
}

.block-list-content::-webkit-scrollbar-thumb:hover {
    background-color: #3c392f;
}

/* Corner decorations */
.block-list::before,
.block-list::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #454138;
    z-index: 1; /* Ensure corners appear above content */
}

.block-list::before {
    top: -1px;
    right: -1px;
    border-left: none;
    border-bottom: none;
}

.block-list::after {
    bottom: -1px;
    left: -1px;
    border-right: none;
    border-top: none;
}
</style>