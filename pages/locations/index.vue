<script setup lang="ts">
import type { BlockListItem } from '~/components/BlockList/types';
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

// map locations to category list items by its type
const categories = computed<string[]>(() => {
    return [...new Set(locations.value?.map(location => location.type) || [])]
})

const categorizedLocations = computed(() => {
    const result: Record<string, BlockListItem[]> = {}
    locations.value?.forEach(location => {
        const type = location.type
        if (!result[type]) {
            result[type] = []
        }
        result[type].push({
            id: location.id,
            text: location.name,
        })
    })
    return result
})

const selectedLocationId = ref<string | null>(null)
const selectedLocation = computed<ApiLocationData | undefined>(() => 
    locations.value?.find(location => location.id === selectedLocationId.value)
)

const selectedCategory = ref<string | null>(null)
const isCategoryActive = (category: string) => selectedCategory.value === category

const onLocationClick = (id: string) => {
    selectedLocationId.value = id
}

const onCategoryClick = (category: string) => {
    selectedCategory.value = category
    const categoryLocations = categorizedLocations.value[category]
    if (categoryLocations?.length > 0) {
        selectedLocationId.value = categoryLocations[0].id
    }
}

// Select first category and location by default when data loads
watch(locations, (newLocations) => {
    if (newLocations?.length && !selectedLocationId.value) {
        selectedLocationId.value = newLocations[0].id
        selectedCategory.value = newLocations[0].type
    }
}, { immediate: true })
</script>

<template>
    <div>
        <h1 class="text-4xl font-bold mb-8 font-nier">Area of Interests</h1>
        <div v-if="pending" class="space-y-4">
            <SkeletonBlock :height="'h-96'" ></SkeletonBlock>
        </div>
        <div v-else-if="fetchError" class="text-red-500">
            Error: {{ fetchError }}
        </div>
        <div v-else-if="locations" class="space-y-8">
            <!-- Category List -->
            <div class="flex gap-4">
                <CategoryButton
                    v-for="category in categories"
                    :key="category"
                    :text="category"
                    :is-active="isCategoryActive(category)"
                    @click="onCategoryClick(category)"
                />
            </div>

            <div class="flex gap-8">
                <!-- location List -->
                <div class="w-1/3">
                    <div class="character-list-container">
                        <SkeletonBlock v-if="!selectedCategory" :height="'h-96'" ></SkeletonBlock>
                        <BlockList v-else
                            :items="categorizedLocations[selectedCategory]"
                            :selectedItemId="selectedLocationId"
                            @click="onLocationClick"
                        />
                    </div>
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
        <div v-else class="flex items-center justify-center h-full text-lg opacity-70">
            Unable to load page.
        </div>
    </div>
</template>