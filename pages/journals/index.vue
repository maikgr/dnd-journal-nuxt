<script setup lang="ts">
import { CACHE_KEY } from '~/server/utils/values'

// Use definePageMeta to enable prefetching
definePageMeta({
  fetchKey: CACHE_KEY.JOURNALS
})

// Fetch journal entries without blocking initial render
const { data: journalEntries, pending, error: fetchError } = useFetch('/api/journal', {
  key: CACHE_KEY.JOURNALS,
  lazy: true,
  server: false,
  transform: (response) => {
    if (!response) return []
    
    return response.map((entry: any) => ({
      id: entry.id,
      pageId: entry.properties?.PageID?.title?.[0]?.plain_text || '',
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

// Current entry index and visible entries
const currentIndex = ref(0)
const visibleEntries = computed(() => {
  const entries = []
  for (let i = -1; i <= 1; i++) {
    const entry = sortedEntries.value[currentIndex.value + i]
    if (entry) {
      // Invert the position value to show newer entries on the right
      entries.push({ ...entry, position: -i })
    }
  }
  return entries
})

// Handle card click
const handleCardClick = (entry: any) => {
  if (entry.position === 0) return // Already active
  // Invert the position value when calculating the new index
  const newIndex = currentIndex.value - entry.position
  if (newIndex >= 0 && newIndex < sortedEntries.value.length) {
    currentIndex.value = newIndex
  }
}

// Navigation handlers
const handlePrevious = () => {
  if (currentIndex.value < sortedEntries.value.length - 1) {
    currentIndex.value++
  }
}

const handleNext = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// Dynamic height calculation
const containerRef = ref<HTMLElement | null>(null)
const cardHeight = ref(0)

onMounted(() => {
  const updateHeight = () => {
    if (!containerRef.value) return
    const headerHeight = 80 // Approximate header height
    const navigationHintHeight = 40 // Approximate navigation hints height
    const padding = 32 // Top and bottom padding
    cardHeight.value = window.innerHeight - containerRef.value.offsetTop - headerHeight - navigationHintHeight - padding
  }

  updateHeight()
  window.addEventListener('resize', updateHeight)
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4" ref="containerRef">
    <!-- Loading state -->
    <div v-if="pending" class="space-y-4">
      <!-- Header skeleton -->
      <div class="bg-nier-bg-primary border border-nier-primary p-4 mb-4 animate-pulse">
        <div class="flex justify-center items-center gap-8">
          <div class="h-6 bg-nier-primary opacity-30 rounded w-32"></div>
          <div class="h-5 bg-nier-primary opacity-30 rounded w-40"></div>
        </div>
      </div>

      <!-- Card skeleton -->
      <div class="flex justify-center items-center">
        <div class="w-[450px] bg-nier-bg-primary border border-nier-primary p-6 animate-pulse">
          <div class="space-y-3">
            <div class="h-5 bg-nier-primary opacity-30 rounded w-full"></div>
            <div class="h-5 bg-nier-primary opacity-30 rounded w-3/4"></div>
            <div class="flex gap-2 mt-4">
              <div class="h-6 bg-nier-primary opacity-30 rounded w-20"></div>
              <div class="h-6 bg-nier-primary opacity-30 rounded w-24"></div>
              <div class="h-6 bg-nier-primary opacity-30 rounded w-16"></div>
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

    <!-- Journal viewer -->
    <div v-else-if="sortedEntries.length > 0" class="space-y-4">
      <!-- Header with current entry info -->
      <div class="relative">
        <JournalHeader
          :key="sortedEntries[currentIndex].id"
          v-if="sortedEntries[currentIndex]"
          :session="sortedEntries[currentIndex].session"
          :day="sortedEntries[currentIndex].day"
          :leap="sortedEntries[currentIndex].leap"
          :has-previous="currentIndex < sortedEntries.length - 1"
          :has-next="currentIndex > 0"
          :on-previous="handlePrevious"
          :on-next="handleNext"
        />
      </div>

      <!-- Carousel -->
      <div class="carousel">
        <ul class="carousel-list" :style="{ height: `${cardHeight}px` }">
          <li
            v-for="entry in visibleEntries"
            :key="entry.id"
            class="carousel-item"
            :data-pos="entry.position"
            @click="handleCardClick(entry)"
          >
            <JournalCard
              :id="entry.pageId"
              :summary="entry.summary"
              :characters="entry.characters"
              :npcs="entry.npcs"
              :locations="entry.locations"
              :is-current="entry.position === 0"
              :leap="entry.leap"
              :day="entry.day"
            />
          </li>
        </ul>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <p class="text-nier-primary opacity-50">No journal entries found.</p>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  display: flex;
  width: 100%;
  align-items: center;
}

.carousel-list {
  display: flex;
  list-style: none;
  position: relative;
  width: 100%;
  justify-content: center;
  perspective: 1000px;
  padding: 0;
}

.carousel-item {
  width: 450px;
  position: absolute;
  transition: all 0.3s ease-in;
  cursor: pointer;
}

.carousel-item[data-pos="0"] {
  z-index: 5;
  transform: translateX(0) scale(1);
  opacity: 1;
  filter: blur(0);
}

.carousel-item[data-pos="-1"] {
  z-index: 4;
  transform: translateX(-50%) scale(0.9);
  opacity: 0.6;
  filter: blur(1px) grayscale(10%);
}

.carousel-item[data-pos="1"] {
  z-index: 4;
  transform: translateX(50%) scale(0.9);
  opacity: 0.6;
  filter: blur(1px) grayscale(10%);
}

/* Fade transition for header */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>