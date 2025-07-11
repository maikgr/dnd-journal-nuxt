<script setup lang="ts">
interface Props {
    name: string
    description: string
    tagline?: string
}
defineProps<Props>()
</script>

<template>
    <div class="relative bg-nier-bg-primary border border-nier-primary min-w-64 max-w-96">
        <!-- Card Header -->
        <div class="bg-nier-primary text-nier-text-inverse px-2 py-0 m-[-1px] border border-nier-primary flex justify-between">
            <div class="font-bold font-nier tracking-wide">{{ name }}</div>
        </div>

        <!-- Card Content -->
        <div class="p-2 bg-nier-bg-primary text-xs text-nier-primary">
            <div class="mb-1.5 gap-1">
                <span>{{ description }}</span>
            </div>

            <div v-if="tagline" class="pt-1 mt-1 border-t border-nier-primary/20 line-height-1.4 flex items-center justify-center">
                <span class="italic opacity-90">{{ tagline }}</span>
            </div>
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