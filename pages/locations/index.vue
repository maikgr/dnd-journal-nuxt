<script setup lang="ts">
import CollapsibleLocationContainer from '~/components/LocationContainer/CollapsibleLocationContainer.vue';
import { CACHE_KEY } from '~/server/utils/values'

definePageMeta({
  fetchKey: CACHE_KEY.LOCATIONS
})

type ApiLocationData = {
    id: string;
    name: string;
    type: string;
    description: string;
    notes: string;
}

// Fetch locations data
const { data: locations, pending, error: fetchError } = await useFetch<ApiLocationData[]>('/api/locations', {
    key: CACHE_KEY.LOCATIONS,
    lazy: true,
    server: false,
    transform: (response) => {
        if (!response) return []
        return response.map((entry: any) => ({
            id: entry.id,
            name: entry.properties.Name?.title?.[0]?.plain_text || 'Unknown',
            type: entry.properties.Type?.select?.name || 'Other',
            description: entry.properties.Description?.rich_text?.[0]?.plain_text,
            notes: entry.properties.Notes?.rich_text?.[0]?.plain_text,
        }))
    }
});

// Search functionality
const searchQuery = ref('')

// Categories management
const categories = computed<string[]>(() => {
    return [...new Set(locations.value?.map(location => location.type) || [])]
})

// Filter locations based on search and category
const filteredLocations = computed(() => {
    if (!locations.value) return []
    
    let filtered = locations.value
    
    // Apply search filter if query exists
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(location => 
            location.name.toLowerCase().includes(query) ||
            location.description?.toLowerCase().includes(query) ||
            location.notes?.toLowerCase().includes(query)
        )
        
        // If we find locations and they have a different category than selected,
        // update the selected category to match the first result
        if (filtered.length > 0 && (!selectedCategory.value || !filtered.some(loc => loc.type === selectedCategory.value))) {
            selectedCategory.value = filtered[0].type
        }
    }
    
    return filtered
})

const selectedLocationId = ref<string | null>(null)
const selectedLocation = computed<ApiLocationData | undefined>(() => 
    locations.value?.find(location => location.id === selectedLocationId.value)
)

const selectedCategory = ref<string | null>(null)
const isCategoryActive = (category: string) => {
    if (!searchQuery.value) {
        return selectedCategory.value === category
    }
    // When searching, highlight category if any filtered results belong to it
    return filteredLocations.value.some(loc => loc.type === category)
}

const onLocationClick = (id: string) => {
    selectedLocationId.value = id
    // Update selected category based on the selected location
    const location = locations.value?.find(loc => loc.id === id)
    if (location) {
        selectedCategory.value = location.type
    }
}

const onCategoryClick = (category: string) => {
    selectedCategory.value = category
    searchQuery.value = '' // Clear search when selecting category
}

// Select first category and location by default when data loads
watch(locations, (newLocations) => {
    if (newLocations?.length && !selectedLocationId.value) {
        selectedLocationId.value = newLocations[0].id
        selectedCategory.value = newLocations[0].type
    }
}, { immediate: true })

// Get locations for a specific category
const getCategoryLocations = (category: string) => {
    return filteredLocations.value.filter(location => location.type === category)
}
</script>

<template>
    <div>
        <h1 class="text-4xl font-bold mb-2 font-nier">Area of Interests</h1>
        <div v-if="pending" class="space-y-4">
            <SkeletonBlock :height="'h-96'" ></SkeletonBlock>
        </div>
        <div v-else-if="fetchError" class="text-red-500">
            Error: {{ fetchError }}
        </div>
        <div v-else-if="locations" class="space-y-4">
            <!-- Search Bar -->
            <div class="location-selector relative border border-nier-primary bg-nier-bg-primary">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search locations..."
                    class="w-full px-4 py-3 bg-transparent font-nier text-nier-primary placeholder-nier-primary/50 focus:outline-none"
                >
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <font-awesome-icon 
                        icon="fa-solid fa-magnifying-glass"
                        class="text-nier-primary opacity-70"
                    />
                </div>
            </div>

            <!-- Desktop Layout -->
            <div class="hidden md:block space-y-4">
                <!-- Category List -->
                <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <CategoryButton
                        v-for="category in categories"
                        :key="category"
                        :text="category"
                        :is-active="isCategoryActive(category)"
                        @click="onCategoryClick(category)"
                    />
                </div>

                <!-- Content -->
                <div class="flex gap-8">
                    <!-- Location List -->
                    <div class="w-1/3">
                        <BlockList
                            v-if="searchQuery && filteredLocations.length > 0" 
                            :items="filteredLocations.map(loc => ({ id: loc.id, text: loc.name }))"
                            :selectedItemId="selectedLocationId"
                            @click="onLocationClick"
                        />
                        <BlockList
                            v-else-if="selectedCategory"
                            :items="getCategoryLocations(selectedCategory).map(loc => ({ id: loc.id, text: loc.name }))"
                            :selectedItemId="selectedLocationId"
                            @click="onLocationClick"
                        />
                    </div>

                    <!-- Location Details -->
                    <div class="w-2/3">
                        <LocationContainer v-if="selectedLocation"
                            :id="selectedLocation.id"
                            :location="selectedLocation"
                            :name="selectedLocation.name"
                            :type="selectedLocation.type"
                            :description="selectedLocation.description"
                            :notes="selectedLocation.notes"
                        />
                    </div>
                </div>
            </div>

            <!-- Mobile Layout -->
            <div class="md:hidden space-y-2">
                <!-- Category Scroll Container -->
                <div class="relative">
                    <!-- Scrollable Container -->
                    <div class="overflow-x-auto scrollbar-hide">
                        <div class="flex gap-2 pb-2 px-4">
                            <button
                                v-for="category in categories"
                                :key="category"
                                class="category-button flex-shrink-0 px-4 py-2 border border-nier-primary font-nier text-sm transition-colors relative"
                                :class="{
                                    'bg-nier-primary text-nier-bg-primary': isCategoryActive(category),
                                    'bg-nier-bg-primary text-nier-primary hover:bg-nier-primary/10': !isCategoryActive(category)
                                }"
                                @click="onCategoryClick(category)"
                            >
                                {{ category }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Left Scroll Indicator -->
                    <div class="absolute left-0 -top-2 bottom-0 w-6 pointer-events-none bg-gradient-to-r from-nier-bg-primary to-transparent z-10 flex items-center">
                        <font-awesome-icon icon="fa-solid fa-chevron-left" class="text-nier-primary opacity-50 ml-1 text-xs" />
                    </div>
                    
                    <!-- Right Scroll Indicator -->
                    <div class="absolute right-0 -top-2 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-nier-bg-primary to-transparent z-10 flex items-center justify-end">
                        <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-nier-primary opacity-50 mr-1 text-xs" />
                    </div>
                </div>

                <!-- Selected Location Details -->
                <div v-if="searchQuery && filteredLocations.length > 0" class="pb-2">
                    <LocationContainer v-for="location in filteredLocations"
                        class="mb-4"
                        :id="location.id"
                        :location="location"
                        :name="location.name"
                        :type="location.type"
                        :description="location.description"
                        :notes="location.notes"
                    />
                </div>
                <div v-else-if="selectedCategory && getCategoryLocations(selectedCategory).length > 0" class="pb-2">
                    <CollapsibleLocationContainer v-for="location in getCategoryLocations(selectedCategory)"
                        class="mb-4"
                        :id="location.id"
                        :location="location"
                        :name="location.name"
                        :type="location.type"
                        :description="location.description"
                        :notes="location.notes"
                    />
                </div>

                <!-- No Results Message -->
                <div 
                    v-if="!pending && !fetchError && ((searchQuery && filteredLocations.length === 0) || (!searchQuery && selectedCategory && getCategoryLocations(selectedCategory).length === 0))"
                    class="text-center py-4 text-nier-primary/70 border border-nier-primary bg-nier-bg-primary"
                >
                    No locations found
                </div>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-full text-lg opacity-70">
            Unable to load page.
        </div>
    </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
}

/* Decorative corners for buttons and inputs */
.category-button::before,
.category-button::after,
.location-selector::before,
.location-selector::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border: 1px solid currentColor;
    opacity: 0.7;
}

.category-button::before,
.location-selector::before {
    top: 1px;
    right: 1px;
    border-left: none;
    border-bottom: none;
}

.category-button::after,
.location-selector::after {
    bottom: 1px;
    left: 1px;
    border-right: none;
    border-top: none;
}

/* Location selector specific styles */
.location-selector::before,
.location-selector::after {
    border-color: theme('colors.nier.primary');
}

.location-selector:focus-within {
    box-shadow: 0 0 0 1px theme('colors.nier.primary');
}
</style>