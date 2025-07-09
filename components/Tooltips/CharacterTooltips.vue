<script setup lang="ts">
interface Props {
    name: string
    charClass: string
    species: string
    occupation: string
    flavor: string
}
defineProps<Props>()
</script>

<template>
    <div class="character-tooltip">
        <!-- Card Header -->
        <div class="bg-nier-primary text-nier-text-inverse px-2 py-0 m-[-1px] border border-nier-primary flex justify-between">
            <div class="font-bold font-nier tracking-wide">{{ name }}</div>
            <div class="opacity-80 text-xs italic mt-0.5">{{ charClass }}</div>
        </div>

        <!-- Card Content -->
        <div class="tooltip-content">
            <div v-if="species" class="content-row">
                <span class="label">Species</span>
                <span class="value">{{ species }}</span>
            </div>
            <div v-if="occupation" class="content-row">
                <span class="label">Role</span>
                <span class="value">{{ occupation }}</span>
            </div>
            <div v-if="flavor" class="flavor">{{ flavor }}</div>
        </div>

        <!-- Decorative Elements -->
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
    </div>
</template>

<style scoped>
.character-tooltip {
    position: relative;
    background: theme('colors.nier.bg-primary');
    border: 1px solid theme('colors.nier.primary');
    padding: 1px;
    min-width: 240px;
    max-width: 320px;
}

.tooltip-header {
    background: theme('colors.nier.primary');
    color: theme('colors.nier.text-inverse');
    padding: 0.5rem 0.75rem;
    margin: -1px;
    border: 1px solid theme('colors.nier.primary');
}

.class {
    font-size: 0.75rem;
    opacity: 0.8;
    font-style: italic;
    margin-top: 0.125rem;
}

.tooltip-content {
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
    color: theme('colors.nier.primary');
    background: rgba(255, 255, 255, 0.02);
}

.content-row {
    display: flex;
    margin-bottom: 0.375rem;
    line-height: 1.3;
    gap: 0.5rem;
}

.content-row:last-child {
    margin-bottom: 0;
}

.label {
    flex: 0 0 auto;
    width: 3.5rem;
    font-weight: 600;
    opacity: 0.7;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
}

.value {
    flex: 1;
}

.flavor {
    font-style: italic;
    opacity: 0.9;
    padding-top: 0.375rem;
    margin-top: 0.375rem;
    border-top: 1px solid rgba(141, 137, 123, 0.2);
    line-height: 1.4;
}

/* Decorative corners */
.corner-decoration {
    position: absolute;
    width: 6px;
    height: 6px;
    border: 1px solid theme('colors.nier.primary');
    opacity: 0.7;
}

.top-left {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
}

.top-right {
    top: -1px;
    right: -1px;
    border-left: none;
    border-bottom: none;
}

.bottom-left {
    bottom: -1px;
    left: -1px;
    border-right: none;
    border-top: none;
}

.bottom-right {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
}

/* Hover effects */
.character-tooltip:hover .corner-decoration {
    opacity: 1;
    transition: opacity 0.2s ease;
}
</style>