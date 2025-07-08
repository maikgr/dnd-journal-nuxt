<script setup lang="ts">
import { CACHE_KEY } from '~/server/utils/values'
// Use definePageMeta to enable prefetching
definePageMeta({
  fetchKey: CACHE_KEY.JOURNALS
})

// Fetch journal entries without blocking initial render
const { data: journalEntries, pending, error: fetchError } = useFetch('/api/journal', {
  key: CACHE_KEY.JOURNALS,
  lazy: true, // Don't block initial render
  server: false, // Start fetch on client to show loading state
  transform: (response) => {
    if (!response) return []
    
    return response.map((entry: any) => ({
      id: entry.id,
      date: entry.properties?.Date?.date?.start,
      summary: entry.properties?.Summary?.rich_text?.[0]?.plain_text || 'No summary available',
      leap: entry.properties?.Leap?.number || 0,
      day: entry.properties?.Day?.number || 0,
      session: entry.properties?.Session?.number || 0,
      characters: entry.properties?.Characters?.multi_select?.map((char: any) => char.name) || [],
      npcs: entry.properties?.NPCs?.multi_select?.map((npc: any) => npc.name) || [],
      locations: entry.properties?.Locations?.multi_select?.map((loc: any) => loc.name) || [],
    }))
  }
})

// Sort entries by leap and day (descending)
const sortedEntries = computed(() => {
  if (!journalEntries.value) return []
  return [...journalEntries.value].sort((a, b) => {
    if (a.leap !== b.leap) return b.leap - a.leap
    return b.day - a.day
  })
})

// Add a helper array for skeleton loading
const skeletonCount = 4 // Number of skeleton items to show
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading state -->
    <div v-if="pending" class="relative">
      <!-- Central timeline line -->
      <div class="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-nier-secondary"></div>

      <!-- Skeleton loaders -->
      <div class="space-y-8">
        <div v-for="i in skeletonCount" :key="i" 
             :class="[
               'flex', 
               i % 2 === 0 ? 'justify-end' : 'justify-start',
               'w-full'
             ]">
          <div :class="[
                 'w-[calc(50%-2rem)]',
                 'bg-nier-primary opacity-50 rounded',
                 'animate-pulse'
               ]">
            <!-- Header skeleton -->
            <div class="flex justify-between mb-4">
              <div class="h-6 bg-nier-primary opacity-50 rounded w-24"></div>
              <div class="h-6 bg-nier-primary opacity-50 rounded w-16"></div>
            </div>
            <!-- Content skeleton -->
            <div class="space-y-3">
              <div class="h-4 bg-nier-primary opacity-50 rounded w-3/4"></div>
              <div class="h-4 bg-nier-primary opacity-50 rounded w-1/2"></div>
            </div>
            <!-- Tags skeleton -->
            <div class="flex gap-2 mt-4">
              <div class="h-6 bg-nier-primary opacity-50 rounded w-16"></div>
              <div class="h-6 bg-nier-primary opacity-50 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
      <p class="text-red-800">
        Failed to load log entries. Please try again later.
      </p>
    </div>

    <!-- Timeline -->
    <Transition name="fade" mode="out-in">
      <div v-if="sortedEntries.length > 0" class="relative">
        <!-- Central timeline line -->
        <div class="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-nier-secondary"></div>

        <!-- Journal entries -->
        <div class="space-y-8">
          <JournalCard
            v-for="(entry, index) in sortedEntries"
            :key="entry.id"
            :id="entry.id"
            :day="entry.day"
            :leap="entry.leap"
            :summary="entry.summary"
            :session="entry.session"
            :characters="entry.characters"
            :npcs="entry.npcs"
            :locations="entry.locations"
            :position="index % 2 === 0 ? 'left' : 'right'"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <p class="text-nier-primary opacity-50">No journal entries found.</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Timeline styles */
.relative {
  min-height: 100px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>