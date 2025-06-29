<script setup lang="ts">
// Fetch journal entries directly using useFetch
const { data: journalEntries, pending, error: fetchError } = await useFetch('/api/journal', {
  transform: (response) => {
    if (!response) return []
    
    return response.map((entry: any) => ({
      id: entry.id,
      date: entry.properties?.Date?.date?.start,
      summary: entry.properties?.Summary?.rich_text?.[0]?.plain_text || 'No summary available',
    }))
  }
})

</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">D&D Campaign Journal</h1>

    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
      <p class="text-red-800">
        Failed to load journal entries. Please try again later.
      </p>
    </div>

    <!-- Journal entries -->
    <div v-else-if="journalEntries && journalEntries.length > 0" class="space-y-6">
      <article 
        v-for="journal in journalEntries" 
        :key="journal.id"
        class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <time 
            v-if="journal.date" 
            :datetime="journal.date"
            class="text-sm text-gray-500"
          >
            {{ new Date(journal.date).toLocaleDateString() }}
          </time>
        </div>
        <p class="text-gray-600">{{ journal.summary }}</p>
      </article>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500">No journal entries found.</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional custom styles here */
</style>