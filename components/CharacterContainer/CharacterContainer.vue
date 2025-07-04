<script setup lang="ts">
import type { CharacterStats } from './types';
import type { CharacterInfo } from './types';

withDefaults(defineProps<CharacterInfo>(), {
    name: '',
    pronouns: '',
    species: '',
    class1: '',
    level1: '',
    class2: null,
    level2: null,
    hp: 0,
    stats: () => ({
        str: 0,
        dex: 0,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0,
    }),
})
</script>

<template>
    <div class="character-details-container">
        <!-- Header -->
        <div class="card-header">
            <div class="flex justify-between">
                <p class="font-bold">{{ name }}</p>
                <p class="opacity-80 self-end text-right">{{ pronouns }}</p>
            </div>
        </div>

        <!-- Content -->
        <div class="card-content">
            <!-- Basic Info -->
            <div class="content-section">
                <p>{{ species }}</p>
                <div class="flex justify-between">
                    <span>{{ class1 }}</span>
                    <span>Lv: {{ level1 }}</span>
                </div>
                <div v-if="class2" class="flex justify-between">
                    <span>{{ class2 }}</span>
                    <span>Lv: {{ level2 }}</span>
                </div>
            </div>

            <!-- HP -->
            <div class="content-section">
                <div class="flex justify-between">
                    <span>HP :</span>
                    <span>{{ hp }}</span>
                </div>
            </div>

            <!-- Attributes -->
            <div class="content-section">
                <div class="flex justify-between">
                    <span>STR :</span>
                    <span>{{ stats.str }}</span>
                </div>
                <div class="flex justify-between">
                    <span>DEX :</span>
                    <span>{{ stats.dex }}</span>
                </div>
                <div class="flex justify-between">
                    <span>CON :</span>
                    <span>{{ stats.con }}</span>
                </div>
                <div class="flex justify-between">
                    <span>INT :</span>
                    <span>{{ stats.int }}</span>
                </div>
                <div class="flex justify-between">
                    <span>WIS :</span>
                    <span>{{ stats.wis }}</span>
                </div>
                <div class="flex justify-between">
                    <span>CHA :</span>
                    <span>{{ stats.cha }}</span>
                </div>
            </div>

            <!-- Status -->
            <div class="content-section">
                <h2 class="text-center opacity-80">ALIVE</h2>
            </div>
        </div>
    </div>
</template>

<style scoped>

.section-header {
    position: relative;
    padding-left: 1rem;
    font-family: 'Rajdhani', sans-serif;
}

.section-header::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--primary-color);
}


.stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 600;
}

.character-header {
    position: relative;
}

.character-header::after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--primary-color), transparent);
}

.character-details-container {
    border: 1px solid var(--primary-color);
    background-color: var(--bg-color);
}

.card-header {
    background-color: var(--primary-color);
    color: var(--button-bg);
    padding: 0.25rem 1rem;
}

.card-content {
    padding: 0rem 1rem;
    font-family: 'Share Tech Mono', monospace;
}

.content-section {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}

.content-section:not(:last-child) {
    border-bottom: 1px solid var(--primary-color);
}

.stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Share Tech Mono', monospace;
}

.stat-label {
    font-size: 1.125rem;
    color: var(--text-color);
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
}
</style>