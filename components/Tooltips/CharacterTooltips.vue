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
      <!-- Card Header -->
      <div class="bg-nier-primary text-nier-text-inverse px-4 py-2">
        <div class="text-2xl font-bold">
          {{ name }}
        </div>
        <div class="text-sm opacity-80">
          {{ charClass }}
        </div>
      </div>

      <!-- Card Content -->
      <div class="text-nier-primary px-4 py-2">
        <p class="mb-4">{{ species }}</p>
        <p class="mb-4">{{ occupation }}</p>
        <p class="mb-4">{{ flavor }}</p>
      </div>
</template>