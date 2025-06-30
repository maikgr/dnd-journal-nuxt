<script setup lang="ts">
// Fetch journal entries directly using useFetch
const { data: journalEntries, pending, error: fetchError } = await useFetch('/api/journal', {
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
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Campaign Timeline</h1>

    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
      <p class="text-red-800">
        Failed to load journal entries. Please try again later.
      </p>
    </div>

    <!-- Timeline -->
    <div v-else-if="sortedEntries.length > 0" class="relative">
      <!-- Central timeline line -->
      <div class="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-[#bab5a1]"></div>

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
      <p class="text-slate-500">No journal entries found.</p>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

<style scoped>
/* Timeline styles */
.relative {
  min-height: 100px;
}
</style>