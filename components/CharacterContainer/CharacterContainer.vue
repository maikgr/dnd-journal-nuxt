<script setup lang="ts">
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
    <div class="character-details-container bg-nier-bg-primary">
        <!-- Header -->
        <div class="bg-nier-primary text-nier-text-inverse px-4 py-2">
            <div class="flex justify-between">
                <p class="font-bold">{{ name }}</p>
                <p class="opacity-80 self-end text-right">{{ pronouns }}</p>
            </div>
        </div>

        <!-- Content -->
        <div class="px-4 py-1 font-mono">
            <!-- Basic Info -->
            <div class="border-b border-nier-border py-2">
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
            <div class="border-b border-nier-border py-2">
                <div class="flex justify-between">
                    <span>HP :</span>
                    <span>{{ hp }}</span>
                </div>
            </div>

            <!-- Attributes -->
            <div class="border-b border-nier-border py-2">
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
            <div class="py-2">
                <h2 class="text-center opacity-70">ALIVE</h2>
            </div>
        </div>
    </div>
</template>

<style scoped>
.character-details-container {
    border: 1px solid theme('colors.nier.primary');
}
</style>