<script setup lang="ts">
interface Props {
  id: string
  summary: string
  characters?: string[]
  npcs?: string[]
  locations?: string[]
  isCurrent?: boolean
  leap: number
  day: number
}

const props = defineProps<Props>()

const hasDetails = computed(() => {
  return (props.characters?.length || 0) + (props.npcs?.length || 0) + (props.locations?.length || 0) > 0
})

const formatList = (items?: string[]) => {
  if (!items?.length) return 'None'
  return items.join(', ')
}
</script>

<template>
  <div class="min-h-[400px] h-[calc(100vh-24rem)] max-h-[600px] bg-nier-bg-primary border border-nier-primary flex flex-col overflow-hidden shadow-nier hover:shadow-nier-lg transition-shadow duration-300">
    <!-- Header -->
    <div class="bg-nier-primary px-4 py-2 border-b border-nier-primary">
      <span class="text-sm font-mono text-nier-bg-primary">Timeline {{ leap }} • Day {{ day }}</span>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col p-4 min-h-0">
      <!-- Summary -->
      <div class="flex-1 overflow-hidden">
        <template v-if="isCurrent">
          <NuxtLink :to="`/journals/${id}`" class="block group">
            <p class="text-base line-clamp-[16] group-hover:scale-[1.01] transition-transform duration-300">{{ summary }}</p>
          </NuxtLink>
        </template>
        <template v-else>
          <p class="text-base line-clamp-[16]">{{ summary }}</p>
        </template>
      </div>

      <!-- Details -->
      <div v-if="hasDetails" class="mt-4 pt-4 border-t border-nier-primary border-opacity-30 shrink-0">
        <div class="space-y-2 text-sm">
          <div v-if="characters?.length" class="flex">
            <span class="text-nier-primary font-bold min-w-24">Characters</span>
            <span class="ml-2">{{ formatList(characters) }}</span>
          </div>
          <div v-if="npcs?.length" class="flex">
            <span class="text-nier-primary font-bold min-w-24">NPCs</span>
            <span class="ml-2">{{ formatList(npcs) }}</span>
          </div>
          <div v-if="locations?.length" class="flex">
            <span class="text-nier-primary font-bold min-w-24">Locations</span>
            <span class="ml-2">{{ formatList(locations) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-nier-lg {
  box-shadow: 0 10px 25px -5px rgba(var(--nier-primary-rgb), 0.15),
              0 8px 10px -6px rgba(var(--nier-primary-rgb), 0.1);
}
</style> 