<script setup lang="ts">
import type { BlockListItem } from '~/components/BlockList/types'
import NpcContainer from '~/components/NpcContainer/NpcContainer.vue'
import type { NpcInfo } from '~/components/NpcContainer/types'
import { CACHE_KEY } from '~/server/utils/values'

// Prefetch characters
definePageMeta({
    fetchKey: CACHE_KEY.NPCS
})

const { data: npcs, pending, error: fetchError } = useFetch('/api/npcs', {
    key: CACHE_KEY.NPCS,
    lazy: true,
    server: false,
    transform: (response) => {
        if (!response) return []

        return response.map<NpcInfo>((npc: any) => ({
            id: npc.id,
            name: npc.properties.Name?.title?.[0]?.plain_text,
            location: npc.properties.Location?.multi_select?.map((loc: any) => loc.name).join(', '),
            description: npc.properties.Description?.rich_text?.[0]?.plain_text,
            notes: npc.properties.Notes?.rich_text?.[0]?.plain_text,
        }))
    }
})

// Search functionality
const searchQuery = ref('')
const isDropdownOpen = ref(false)

const filteredNpcs = computed(() => {
    if (!searchQuery.value) return npcItemList.value
    const query = searchQuery.value.toLowerCase()
    return npcItemList.value.filter(npc => 
        npc.text.toLowerCase().includes(query)
    )
})

const npcItemList = computed<BlockListItem[]>(() => npcs.value?.map(npc => ({
    id: npc.id,
    text: npc.name || 'Unknown'
})) || [])

const selectedNpcId = ref<string | null>(null)
const selectedNpc = computed<NpcInfo | undefined>(() => 
    npcs.value?.find(npc => npc.id === selectedNpcId.value)
)

const onItemClick = (id: string) => {
    selectedNpcId.value = id
    isDropdownOpen.value = false // Close dropdown after selection on mobile
}

// Select first character by default when data loads
watch(npcs, (newNpcs) => {
    if (newNpcs?.length && !selectedNpcId.value) {
        selectedNpcId.value = newNpcs[0].id
    }
}, { immediate: true })

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLElement | null>(null)
onMounted(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
            isDropdownOpen.value = false
        }
    }
    document.addEventListener('click', handleClickOutside)
    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
    })
})
</script>

<template>
    <div>
        <h1 class="text-4xl font-bold mb-2 font-nier">People</h1>

        <!-- Desktop Layout -->
        <div class="hidden md:block">
            <!-- Full-width Search Bar -->
            <div class="mb-4">
                <div class="npc-selector relative border border-nier-primary bg-nier-bg-primary">
                    <input
                        v-model="searchQuery"
                type="text"
                        placeholder="Search NPCs..."
                        class="w-full px-4 py-3 bg-transparent font-nier text-nier-primary placeholder-nier-primary/50 focus:outline-none"
                    >
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <font-awesome-icon 
                            icon="fa-solid fa-magnifying-glass"
                            class="text-nier-primary opacity-70"
                        />
                    </div>
                </div>
            </div>

            <!-- No Results Message (Desktop) -->
            <div 
                v-if="!pending && !fetchError && filteredNpcs.length === 0" 
                class="text-center py-4 text-nier-primary/70 border border-nier-primary bg-nier-bg-primary max-w-2xl mx-auto mb-6"
            >
                No NPCs found
            </div>

            <!-- Content Columns -->
            <div class="flex gap-8">
                <!-- NPC List -->
                <div class="w-1/3">
                    <BlockList
                        :pending="pending"
                        :error="fetchError?.message || null"
                        :items="filteredNpcs"
                        :selectedItemId="selectedNpcId"
                        @click="onItemClick"
                    />
                </div>

                <!-- NPC Details -->
                <div class="w-2/3">
                    <div v-if="pending" class="space-y-4">
                        <SkeletonBlock :height="'h-96'" ></SkeletonBlock>
                    </div>
                    <div v-else-if="fetchError" class="text-red-500">
                        Error: {{ fetchError }}
                    </div>
                    <NpcContainer v-else-if="selectedNpc"
                        :id="selectedNpc.id"
                        :npc="selectedNpc"
                        :name="selectedNpc.name"
                        :location="selectedNpc.location"
                        :description="selectedNpc.description"
                        :notes="selectedNpc.notes"
                    />
                    <div v-else class="flex items-center justify-center h-full text-lg opacity-70">
                        No NPC selected
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Layout -->
        <div class="md:hidden">
            <!-- Searchable Dropdown -->
            <div class="relative mb-4" ref="dropdownRef">
                <!-- Selected NPC Display / Search Input -->
                <div 
                    class="npc-selector relative border border-nier-primary bg-nier-bg-primary"
                    @click="isDropdownOpen = !isDropdownOpen"
                >
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search NPCs..."
                        class="w-full px-4 py-3 bg-transparent font-nier text-nier-primary placeholder-nier-primary/50 focus:outline-none"
                        @click.stop
                        @focus="isDropdownOpen = true"
                    >
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <font-awesome-icon 
                            :icon="isDropdownOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
                            class="text-nier-primary"
                        />
                    </div>
                </div>

                <!-- Dropdown List -->
                <div v-if="isDropdownOpen" class="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto border border-nier-primary bg-nier-bg-primary shadow-nier">
                    <div v-if="filteredNpcs.length === 0" class="p-4 text-center text-nier-primary/70">
                        No NPCs found
                    </div>
                    <button
                        v-for="npc in filteredNpcs"
                        :key="npc.id"
                        class="w-full text-left px-4 py-2 hover:bg-nier-primary hover:text-nier-bg-primary transition-colors"
                        :class="{ 'bg-nier-primary text-nier-bg-primary': npc.id === selectedNpcId }"
                        @click="onItemClick(npc.id)"
                    >
                        {{ npc.text }}
                    </button>
                </div>
            </div>

            <!-- NPC Details -->
            <div v-if="pending" class="space-y-4">
                <SkeletonBlock :height="'h-96'" ></SkeletonBlock>
            </div>
            <div v-else-if="fetchError" class="text-red-500">
                Error: {{ fetchError }}
            </div>
            <NpcContainer v-else-if="selectedNpc"
                :id="selectedNpc.id"
                :npc="selectedNpc"
                :name="selectedNpc.name"
                :location="selectedNpc.location"
                :description="selectedNpc.description"
                :notes="selectedNpc.notes"
            />
            <div v-else class="flex items-center justify-center h-full text-lg opacity-70">
                No NPC selected
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Decorative corners for NPC selector */
.npc-selector::before,
.npc-selector::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border: 1px solid theme('colors.nier.primary');
    opacity: 0.7;
}

.npc-selector::before {
    top: 1px;
    right: 1px;
    border-left: none;
    border-bottom: none;
}

.npc-selector::after {
    bottom: 1px;
    left: 1px;
    border-right: none;
    border-top: none;
}

/* Add shadow to the search input on focus */
.npc-selector:focus-within {
    box-shadow: 0 0 0 1px theme('colors.nier.primary');
}
</style>