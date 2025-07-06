<script setup lang="ts">
import type { BlockListItem } from './types';
interface Props {
    items: BlockListItem[]
    selectedItemId?: string | null
}

withDefaults(defineProps<Props>(), {
    selectedItemId: null,
})

defineEmits<{
    click: [id: string]
}>()

</script>

<template>
    <button
        v-for="item in items"
        :key="item.id"
        class="character-list-item bg-nier-bg-primary font-nier font-semibold relative my-2 mx-0
        w-full text-left px-8 py-3 transition-all h-8 flex items-center overflow-visible"
        :class="{ 'selected': item.id === selectedItemId }"
        @click="$emit('click', item.id)"
    >
        <!-- Selection Arrow -->
        <div v-if="item.id === selectedItemId" class="selection-indicator">
            <div class="diamond"></div>
        </div>
        {{ item.text }}
    </button>
</template>

<style scoped>
.character-list-item:hover {
    background-color: rgba(69, 65, 56, 0.1);
}

.character-list-item.selected {
    background-color: theme('colors.nier.primary');
    color: theme('colors.nier.text-inverse');
    position: relative;
}

.character-list-item.selected::before,
.character-list-item.selected::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: theme('colors.nier.primary');
    pointer-events: none;
}

.character-list-item.selected::before {
    top: -4px;
}

.character-list-item.selected::after {
    bottom: -4px;
}

.selection-indicator {
    position: absolute;
    left: 6px;
    top: 47%;
    transform: translateY(-50%);
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.diamond {
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    background-color: theme('colors.nier.secondary');
    position: relative;
}

.diamond::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background-color: theme('colors.nier.primary');
}
</style>