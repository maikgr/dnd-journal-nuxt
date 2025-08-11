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
  quests: {
    id: string
    name: string
    number: number
    nextSteps: string
    facts: {
      id: string
      sessionId: string
      sessionDate: string
      summary: string
    }[]
  }[]
}

// Use computed properties for type-safe data access
const stats = computed(() => {
  if (!data.value) return null
  return {
    lastPlayed: data.value.lastSession.date,
    totalSessions: data.value.totalSessions,
    totalCharacters: data.value.totalCharacters,
    totalNpcs: data.value.totalNpcs,
    totalLocations: data.value.totalLocations,
  }
})

const lastSession = computed(() => {
  if (!data.value) return null
  return data.value.lastSession
})

const quests = computed(() => {
  if (!data.value) return null
  return data.value.quests
})

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
          <div class="card-content">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              <div v-for="i in 5" :key="i" class="stat-item relative overflow-hidden">
                <div class="stat-content animate-pulse">
                  <div class="stat-icon mb-2">
                    <div class="w-6 h-6 bg-nier-primary opacity-30 rounded-full"></div>
                  </div>
                  <SkeletonBlock height="h-4 mb-2 w-20" />
                  <SkeletonBlock height="h-6 w-12" />
                </div>
                <div class="stat-decoration"></div>
              </div>
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
          <div class="card-content">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              <!-- Last Played -->
              <div class="stat-item relative overflow-hidden">
                <div class="stat-content">
                  <div class="stat-icon mb-2">
                    <font-awesome-icon icon="fa-solid fa-clock" class="text-nier-primary opacity-70" />
                  </div>
                  <p class="text-xs sm:text-sm uppercase tracking-wider opacity-70">Last Played</p>
                  <p class="text-lg sm:text-xl font-nier">{{ stats.lastPlayed }}</p>
                </div>
                <div class="stat-decoration"></div>
              </div>

              <!-- Total Sessions -->
              <div class="stat-item relative overflow-hidden">
                <div class="stat-content">
                  <div class="stat-icon mb-2">
                    <font-awesome-icon icon="fa-solid fa-dice-d20" class="text-nier-primary opacity-70" />
                  </div>
                  <p class="text-xs sm:text-sm uppercase tracking-wider opacity-70">Sessions</p>
                  <p class="text-lg sm:text-xl font-nier">{{ stats.totalSessions }}</p>
                </div>
                <div class="stat-decoration"></div>
              </div>

              <!-- Characters -->
              <div class="stat-item relative overflow-hidden">
                <div class="stat-content">
                  <div class="stat-icon mb-2">
                    <font-awesome-icon icon="fa-solid fa-users" class="text-nier-primary opacity-70" />
                  </div>
                  <p class="text-xs sm:text-sm uppercase tracking-wider opacity-70">Characters</p>
                  <p class="text-lg sm:text-xl font-nier">{{ stats.totalCharacters }}</p>
                </div>
                <div class="stat-decoration"></div>
              </div>

              <!-- NPCs -->
              <div class="stat-item relative overflow-hidden">
                <div class="stat-content">
                  <div class="stat-icon mb-2">
                    <font-awesome-icon icon="fa-solid fa-masks-theater" class="text-nier-primary opacity-70" />
                  </div>
                  <p class="text-xs sm:text-sm uppercase tracking-wider opacity-70">NPCs</p>
                  <p class="text-lg sm:text-xl font-nier">{{ stats.totalNpcs }}</p>
                </div>
                <div class="stat-decoration"></div>
              </div>

              <!-- Locations -->
              <div class="stat-item relative overflow-hidden">
                <div class="stat-content">
                  <div class="stat-icon mb-2">
                    <font-awesome-icon icon="fa-solid fa-map" class="text-nier-primary opacity-70" />
                  </div>
                  <p class="text-xs sm:text-sm uppercase tracking-wider opacity-70">Locations</p>
                  <p class="text-lg sm:text-xl font-nier">{{ stats.totalLocations }}</p>
                </div>
                <div class="stat-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Active Quests Section -->
      <section class="quests nier-section" v-if="quests">
        <h2 class="section-header">Active Quests</h2>
        <div class="space-y-2">
          <QuestContainer v-for="quest in quests" :key="quest.id" :quest="quest" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.stats-card, .session-card {
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
  position: relative;
  background-color: #d1cdb7;
  border: 1px solid #454138;
  padding: 1rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-content {
  position: relative;
  z-index: 2;
}

.stat-icon {
  font-size: 1.5rem;
  height: 2rem;
  display: flex;
  align-items: center;
}

/* Decorative elements */
.stat-decoration {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.stat-decoration::before,
.stat-decoration::after {
  content: '';
  position: absolute;
  background-color: #454138;
  opacity: 0.1;
  transition: all 0.3s ease;
}

/* Diagonal line decoration */
.stat-decoration::before {
  top: -1rem;
  right: -1rem;
  width: 3px;
  height: 150%;
  transform: rotate(45deg);
}

/* Corner square decoration */
.stat-decoration::after {
  top: 0.5rem;
  right: 0.5rem;
  width: 6px;
  height: 6px;
  border: 1px solid currentColor;
  opacity: 0.3;
  border-left: none;
  border-bottom: none;
}

/* Hover effects */
.stat-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(69, 65, 56, 0.1);
}

.stat-item:hover .stat-decoration::before {
  opacity: 0.15;
  transform: rotate(45deg) scale(1.1);
}

.stat-item:hover .stat-decoration::after {
  opacity: 0.4;
}

/* Grid layout adjustments */
@media (max-width: 768px) {
  .stat-item {
    padding: 0.75rem;
  }
  
  .stat-icon {
    font-size: 1.25rem;
    height: 1.75rem;
  }
}

/* Add animation for loading state */
@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
