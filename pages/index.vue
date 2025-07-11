<script setup lang="ts">
const { data, pending, error: fetchError } = useFetch<MainData>('/api/main', {
  lazy: true,
  server: false
})

// Add type safety for the data
type MainData = {
  lastSession: {
    date: string
    summary: string
    characters: string[]
    npcs: string[]
    locations: string[]
    day: number
    leap: number
    pageId: string
  }
  totalSessions: number
  totalCharacters: number
  totalNpcs: number
  totalLocations: number
}

// Use computed properties for type-safe data access
const stats = computed(() => {
  if (!data.value) return null
  return {
    lastPlayed: data.value.lastSession.date,
    totalSessions: data.value.totalSessions,
    totalCharacters: data.value.totalCharacters,
    totalNpcs: data.value.totalNpcs,
    totalLocations: data.value.totalLocations
  }
})

const lastSession = computed(() => {
  if (!data.value) return null
  return data.value.lastSession
})

const navigateToJournal = (pageId: string) => {
  navigateTo(`/journals/${pageId}`)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Error State -->
    <div v-if="fetchError" class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> Failed to load dashboard data.</span>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending" class="space-y-8">
      <!-- Stats Section Loading -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="stats-card col-span-1 md:col-span-3">
          <h2 class="card-header">Campaign Statistics</h2>
          <div class="card-content grid grid-cols-2 md:grid-cols-5 gap-4">
            <div v-for="i in 5" :key="i" class="stat-item">
              <SkeletonBlock height="h-4 mb-2 w-20" />
              <SkeletonBlock height="h-6 w-12" />
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Sessions Loading -->
      <section class="recent-sessions nier-section">
        <h2 class="section-header">Recent Sessions</h2>
        <div class="session-card">
          <h3 class="card-header flex justify-between items-center">
            <SkeletonBlock height="h-6 w-48" />
            <SkeletonBlock height="h-4 w-24" />
          </h3>
          <div class="card-content">
            <SkeletonBlock height="h-16 w-full mb-4" />
            <div class="flex justify-between items-center">
              <SkeletonBlock height="h-4 w-64" />
              <SkeletonBlock height="h-8 w-24" />
            </div>
          </div>
        </div>
      </section>

      <!-- Quests Loading -->
      <section class="quests nier-section">
        <h2 class="section-header">Active Quests</h2>
        <div class="quest-item">
          <h3 class="card-header">
            <SkeletonBlock height="h-6 w-48" />
          </h3>
          <div class="card-content">
            <SkeletonBlock height="h-12 w-full" />
          </div>
        </div>
      </section>
    </div>

    <template v-else-if="stats && lastSession">
      <!-- Stats Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="stats-card col-span-1 md:col-span-3">
          <h2 class="card-header">Campaign Statistics</h2>
          <div class="card-content grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="stat-item">
              <p class="text-sm opacity-70">Last Played</p>
              <p class="text-xl">{{ stats.lastPlayed }}</p>
            </div>
            <div class="stat-item">
              <p class="text-sm opacity-70">Total Sessions</p>
              <p class="text-xl">{{ stats.totalSessions }}</p>
            </div>
            <div class="stat-item">
              <p class="text-sm opacity-70">Characters</p>
              <p class="text-xl">{{ stats.totalCharacters }}</p>
            </div>
            <div class="stat-item">
              <p class="text-sm opacity-70">NPCs</p>
              <p class="text-xl">{{ stats.totalNpcs }}</p>
            </div>
            <div class="stat-item">
              <p class="text-sm opacity-70">Locations</p>
              <p class="text-xl">{{ stats.totalLocations }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Sessions Section -->
      <section class="recent-sessions nier-section">
        <h2 class="section-header">Recent Sessions</h2>
        <div class="space-y-4">
          <div class="session-card">
            <h3 class="card-header flex justify-between items-center">
              <span>Timeline {{ lastSession.leap }} • Day {{ lastSession.day }}</span>
              <span class="text-sm">{{ lastSession.date }}</span>
            </h3>
            <div class="card-content">
              <p class="text-sm mb-2 opacity-80">
                {{ lastSession.summary }}
              </p>
              <div class="flex justify-between items-center">
                <div class="text-sm opacity-70">
                  Characters: {{ lastSession.characters.join(', ') }}
                </div>
                <button 
                  class="nier-button-small"
                  @click="navigateToJournal(lastSession.pageId)"
                >
                  Read more...
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Active Quests Section -->
      <section class="quests nier-section">
        <h2 class="section-header">Active Quests</h2>
        <div class="space-y-2">
          <div class="quest-item">
            <h3 class="card-header">Find SPIRIT</h3>
            <div class="card-content">
              <p class="text-sm opacity-80 text-nier-warning">[NO DATA]</p>
              <div class="flex items-center mt-1">
                <span class="text-xs px-2 py-1 bg-nier-primary text-nier-secondary">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.stats-card, .session-card, .quest-item {
  position: relative;
  border: 1px solid #454138;
}

.card-header {
  background-color: #454138;
  color: #bab5a1;
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.25);
}

.card-content {
  background-color: #d1cdb7;
  color: #454138;
  padding: 1rem;
}

.section-header {
  position: relative;
  font-size: 1.25rem;
  font-weight: 600;
  padding-left: 1rem;
  margin-bottom: 1rem;
  color: #454138;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

.section-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #454138;
}

.section-header::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #454138;
}

.nier-section .section-header::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid #454138;
  right: -4px;
  top: -4px;
  border-left: none;
  border-bottom: none;
  background: none;
}

.nier-section .section-header::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid #454138;
  left: -4px;
  bottom: -4px;
  border-right: none;
  border-top: none;
  background: none;
}

.stat-item {
  background-color: #d1cdb7;
  border: 1px solid #454138;
  padding: 0.75rem;
}

.nier-button-small {
  background-color: #bab5a1;
  color: #454138;
  padding: 0.25rem 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid #454138;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

.nier-button-small:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.text-primary {
  color: var(--primary-color);
}
</style>
