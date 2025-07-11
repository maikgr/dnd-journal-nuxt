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
}

// Select first character by default when data loads
watch(npcs, (newNpcs) => {
    if (newNpcs?.length && !selectedNpcId.value) {
        selectedNpcId.value = newNpcs[0].id
    }
}, { immediate: true })
</script>

<template>
    <div>
        <h1 class="text-4xl font-bold mb-8 font-nier">People</h1>
        <div class="flex gap-8">
            <!-- Character List -->
            <div class="w-1/3">
                <BlockList
                    :pending="pending"
                    :error="fetchError?.message || null"
                    :items="npcItemList"
                    :selectedItemId="selectedNpcId"
                    @click="onItemClick"
                />
            </div>

            <!-- Character Details -->
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
                    No character selected
                </div>
            </div>
        </div>
    </div>
</template>