<script setup lang="ts">
interface Props {
  id: string
  day: number
  leap: number
  summary: string
  session: number
  position?: 'left' | 'right'
  characters?: string[]
  npcs?: string[]
  locations?: string[]
}

const props = defineProps<Props>()
const isExpanded = ref(false)

const hasDetails = computed(() => {
  return (props.characters?.length || 0) + (props.npcs?.length || 0) + (props.locations?.length || 0) > 0
})
</script>

<template>
  <div class="timeline-entry relative flex items-center" :class="position === 'left' ? 'justify-start' : 'justify-end'">
    <!-- Timeline dot -->
    <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#454138] border-4 border-[#d1cdb7]"></div>

    <!-- Entry card -->
    <div 
      class="w-5/12 border border-[#454138]"
      :class="position === 'left' ? 'mr-auto' : 'ml-auto'"
    >
      <!-- Card Header -->
      <div class="card-header">
        <div class="text-2xl font-bold">
          Session {{ session }}
        </div>
        <div class="text-sm opacity-80">
          Day {{ day }} - Time Leap {{ leap }}
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <p class="text-[#454138] mb-4">{{ summary }}</p>
        
        <!-- Details Section -->
        <div v-if="hasDetails" class="mb-4">
          <button 
            @click="isExpanded = !isExpanded"
            class="text-sm text-[#454138] hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            <span>{{ isExpanded ? 'Hide Details' : 'Show Details' }}</span>
            <span class="transform transition-transform" :class="{ 'rotate-180': isExpanded }">▼</span>
          </button>
          
          <div v-if="isExpanded" class="mt-2 space-y-2 text-sm text-[#454138]">
            <div v-if="characters?.length" class="detail-group">
              <span class="detail-label">Characters:</span>
              <span class="detail-content">{{ characters.join(', ') }}</span>
            </div>
            <div v-if="npcs?.length" class="detail-group">
              <span class="detail-label">NPCs:</span>
              <span class="detail-content">{{ npcs.join(', ') }}</span>
            </div>
            <div v-if="locations?.length" class="detail-group">
              <span class="detail-label">Locations:</span>
              <span class="detail-content">{{ locations.join(', ') }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <NuxtLink :to="`/journal/${id}`" class="nier-button-small">
            View session log
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add connecting lines - make selector more specific */
.timeline-entry::before {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(8.333333%);
  height: 2px;
  background-color: #454138;
}

/* Position connecting lines based on entry position */
.timeline-entry.justify-start::before {
  right: 45.833333%;
}

.timeline-entry.justify-end::before {
  left: 45.833333%;
}

.card-header {
  background-color: #454138;
  color: #bab5a1;
  padding: 0.75rem 1rem;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.25);
}

.card-content {
  background-color: #d1cdb7;
  padding: 1rem;
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

.detail-group {
  display: flex;
  gap: 0.5rem;
}

.detail-label {
  font-weight: 600;
  color: #454138;
  min-width: 5rem;
}

.detail-content {
  color: #454138;
  opacity: 0.9;
}

/* Animation for expand/collapse */
.transform {
  display: inline-block;
  font-size: 0.75rem;
}

.rotate-180 {
  transform: rotate(180deg);
}

.transition-transform {
  transition: transform 0.2s ease;
}
</style> 