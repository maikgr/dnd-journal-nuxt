<script setup lang="ts">
import type { BlockListItem } from './types';
interface Props {
    pending: boolean;
    error: string | null;
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
const skeletonCount = 3;
</script>

<template>
    <div class="character-list-container">
        <div v-if="pending" class="space-y-4 p-4">
            <SkeletonBlock v-for="i in skeletonCount" :key="i"/>
        </div>
        <div v-else-if="error" class="text-red-500 p-4">
            Error: {{ error }}
        </div>
        <div v-else class="py-2">
            <BlockListItem :items="items" :selectedItemId="selectedItemId" @click="onClick"/>
        </div>
    </div>
</template>

<style scoped>

.character-list-container {
    background-color: var(--bg-color);
    border: 1px solid var(--primary-color);
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
    position: relative;
}

/* Corner decorations */
.character-list-container::before,
.character-list-container::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid var(--primary-color);
}

.character-list-container::before {
    top: -1px;
    right: -1px;
    border-left: none;
    border-bottom: none;
}

.character-list-container::after {
    bottom: -1px;
    left: -1px;
    border-right: none;
    border-top: none;
}
</style>