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
    <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-nier-secondary border-4 border-nier-primary"></div>

    <!-- Entry card -->
    <div 
      class="w-5/12 border border-nier-primary shadow-nier"
      :class="position === 'left' ? 'mr-auto' : 'ml-auto'"
    >
      <!-- Card Header -->
      <div class="bg-nier-primary text-nier-text-inverse px-4 py-2">
        <div class="text-2xl font-bold">
          Session {{ session }}
        </div>
        <div class="text-sm opacity-80">
          Day {{ day }} - Time Leap {{ leap }}
        </div>
      </div>

      <!-- Card Content -->
      <div class="text-nier-primary px-4 py-2">
        <p class="mb-4">{{ summary }}</p>
        
        <!-- Details Section -->
        <div v-if="hasDetails" class="mb-4">
          <button 
            @click="isExpanded = !isExpanded"
            class="text-sm text-nier-primary hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            <span>{{ isExpanded ? 'Hide Details' : 'Show Details' }}</span>
            <span class="transform transition-transform" :class="{ 'rotate-180': isExpanded }">▼</span>
          </button>
          
          <div v-if="isExpanded" class="mt-2 space-y-2 text-sm text-nier-primary">
            <div v-if="characters?.length" class="flex gap-2">
              <span class="font-semibold min-w-20">Characters</span>
              <span class="opacity-80">{{ characters.join(', ') }}</span>
            </div>
            <div v-if="npcs?.length" class="flex gap-2">
              <span class="font-semibold min-w-20">NPCs</span>
              <span class="opacity-80">{{ npcs.join(', ') }}</span>
            </div>
            <div v-if="locations?.length" class="flex gap-2">
              <span class="font-semibold min-w-20">Locations</span>
              <span class="opacity-80">{{ locations.join(', ') }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <NuxtLink :to="`/journals/${id}`" class="nier-button-small">
            View Log
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