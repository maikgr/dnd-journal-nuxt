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
    <div class="relative bg-nier-bg-primary border border-nier-primary min-w-64 max-w-96">
        <!-- Card Header -->
        <div class="bg-nier-primary text-nier-text-inverse px-2 py-0 m-[-1px] border border-nier-primary flex justify-between">
            <div class="font-bold font-nier tracking-wide">{{ name }}</div>
            <div class="opacity-80 text-xs italic mt-0.5">{{ charClass }}</div>
        </div>

        <!-- Card Content -->
        <div class="p-2 bg-nier-bg-primary text-xs text-nier-primary">
            <div v-if="species" class="flex mb-1.5 gap-1">
                <span class="flex tracking-wide font-semibold uppercase min-w-16">Species</span>
                <span>{{ species }}</span>
            </div>
            <div v-if="occupation" class="flex mb-1.5 gap-1">
                <span class="flex tracking-wide font-semibold uppercase min-w-16">Role</span>
                <span>{{ occupation }}</span>
            </div>

            <div v-if="flavor" class="italic opacity-90 pt-1 mt-1 border-t border-nier-primary/20 line-height-1.4 center">{{ flavor }}</div>
        </div>

        <!-- Decorative Elements -->
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
    </div>
</template>

<style scoped>
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
</style>