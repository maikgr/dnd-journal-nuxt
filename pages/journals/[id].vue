<script setup lang="ts">
import type { JournalContent } from '~/server/api/journals/types'
import EntityTooltip from '~/components/Tooltips/EntityTooltip.vue'

const route = useRoute()
const id = route.params.id as string

// Tooltip state
const hoveredEntity = ref<string | null>(null)
const currentTriggerRef = ref<HTMLElement | null>(null)
const isPinned = ref(false)

// Event handlers for tooltip
const onMouseEnter = (element: EventTarget | null, entity: any) => {
    if (entity?.id && element instanceof HTMLElement) {
        if (!isPinned.value) {
            hoveredEntity.value = entity.key
            currentTriggerRef.value = element
        }
    }
}

const onMouseLeave = () => {
    if (!isPinned.value) {
        hoveredEntity.value = null
        currentTriggerRef.value = null
    }
}

const onClick = (element: EventTarget | null, entity: any) => {
    if (entity?.id && element instanceof HTMLElement) {
        hoveredEntity.value = entity.key
        currentTriggerRef.value = element
        isPinned.value = true
    }
}

// Handle tooltip close
const onTooltipClose = () => {
    isPinned.value = false
    hoveredEntity.value = null
    currentTriggerRef.value = null
}

// Handle click outside
const onClickOutside = (event: MouseEvent) => {
    if (!isPinned.value) return
    
    const target = event.target as HTMLElement
    if (!currentTriggerRef.value?.contains(target)) {
        isPinned.value = false
        hoveredEntity.value = null
        currentTriggerRef.value = null
    }
}

onMounted(() => {
    document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
})

// Single API call to get all journal data
const { data: journal, pending, error } = await useFetch<JournalContent>(`/api/journals/${id}`, {
    key: `journal-${id}`,
    lazy: true,
    server: false
})

interface ProcessedSegment {
    type: 'text' | 'entity';
    text: string;
    entity?: {
        id: string;
        key: string;
        name: string;
        type: string;
        [key: string]: any;
    };
}

interface ProcessedBlock {
    type: string;
    segments?: ProcessedSegment[];
    text?: string; // For simple text blocks like bullet points
    [key: string]: any;
}

const content = computed(() => {
    if (!journal.value) return []

    // Create a regex pattern from entity names, escaping special characters
    const entityNames = Object.keys(journal.value.entityMap)
    const escapedNames = entityNames
        .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .sort((a, b) => b.length - a.length) // Sort by length descending to match longer names first
    const entityPattern = new RegExp(`\\b(${escapedNames.join('|')})\\b`, 'gi')

    const processText = (richText: any[]): ProcessedSegment[] => {
        const segments: ProcessedSegment[] = []
        richText.forEach(text => {
            const plainText = text.plain_text
            // Split text by entity matches and wrap matches with span
            let lastIndex = 0
            let match: RegExpExecArray | null = null
            
            // Reset lastIndex of regex for each new text
            entityPattern.lastIndex = 0
            
            while ((match = entityPattern.exec(plainText)) !== null) {
                // Add text before match
                if (match.index > lastIndex) {
                    segments.push({
                        type: 'text',
                        text: plainText.slice(lastIndex, match.index)
                    })
                }
                
                // Find the correct case in entityMap
                const entityKey = entityNames.find(name => name.toLowerCase() === match?.[0]?.toLowerCase())
                
                // Add matched entity
                if (!entityKey) {
                    console.warn('Entity key not found:', match[0])
                    return segments
                }

                segments.push({
                    type: journal.value?.entityMap[entityKey].type,
                    text: match[0],
                    entity: entityKey ? {
                       ...journal.value?.entityMap[entityKey],
                       key: entityKey
                     } : null
                })
                lastIndex = match.index + match[0].length
            }
            // Add remaining text
            if (lastIndex < plainText.length) {
                segments.push({
                    type: 'text',
                    text: plainText.slice(lastIndex)
                })
            }
        })
        return segments
    }

    const processedBlock = journal.value.content.map((block: any): ProcessedBlock => {
        if (block.type === 'paragraph') {
            // Process each rich text segment in the paragraph
            return {
                type: 'paragraph',
                segments: processText(block.paragraph?.rich_text || [])
            }
        } else if (block.type === 'bulleted_list_item') {
            // Process bulleted list items
            return {
                type: 'bulleted_list_item',
                segments: processText(block.bulleted_list_item?.rich_text || [])
            }
        }
        return block
    })

    return processedBlock
})
</script>

<template>
    <div class="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div v-if="pending" class="space-y-4">
            <SkeletonBlock :height="'h-96'" />
        </div>
        <div v-else-if="error" class="text-red-500">
            Error: {{ error }}
        </div>
        <div v-else-if="journal" class="space-y-4 sm:space-y-8">
            <!-- Header -->
            <div class="bg-nier-primary text-nier-text-inverse px-4 sm:px-6 py-3 sm:py-4 shadow-nier">
                <h1 class="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-nier">Session {{ journal.session }}</h1>
                <p class="text-base sm:text-lg opacity-80">Day {{ journal.day }} - Time Leap {{ journal.leap }}</p>
            </div>

            <!-- Details -->
            <div class="bg-nier-bg-primary border border-nier-primary p-4 sm:p-6">
                <div class="space-y-3 sm:space-y-4">
                    <div v-if="journal.characters.length" class="flex gap-3 sm:gap-4 text-sm sm:text-base">
                        <span class="font-semibold min-w-24 sm:min-w-32">Characters</span>
                        <span class="opacity-80">{{ journal.characters.join(', ') }}</span>
                    </div>
                    <div v-if="journal.npcs.length" class="flex gap-3 sm:gap-4 text-sm sm:text-base">
                        <span class="font-semibold min-w-24 sm:min-w-32">NPCs</span>
                        <span class="opacity-80">{{ journal.npcs.join(', ') }}</span>
                    </div>
                    <div v-if="journal.locations.length" class="flex gap-3 sm:gap-4 text-sm sm:text-base">
                        <span class="font-semibold min-w-24 sm:min-w-32">Locations</span>
                        <span class="opacity-80">{{ journal.locations.join(', ') }}</span>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="bg-nier-bg-primary border border-nier-primary p-4 sm:p-6">
                <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-nier">Content</h2>
                <div class="space-y-3 sm:space-y-4 font-content text-base sm:text-lg leading-relaxed">
                    <div v-for="(block, index) in content" :key="index">
                        <!-- Paragraph -->
                        <div v-if="block.type === 'paragraph'" class="whitespace-pre-wrap font-alt-content text-base sm:text-lg leading-relaxed">
                            <template v-for="(segment, segmentIndex) in block.segments" :key="segmentIndex">
                                <span 
                                    v-if="segment.entity" 
                                    class="entity-link"
                                    @mouseenter="onMouseEnter($event.target, segment.entity)"
                                    @mouseleave="onMouseLeave"
                                    @click="onClick($event.target, segment.entity)"
                                >
                                    {{ segment.text }}
                                </span>
                                <template v-else>{{ segment.text }}</template>
                            </template>
                        </div>
                        <!-- Bullet Point -->
                        <div v-else-if="block.type === 'bulleted_list_item'" class="whitespace-pre-wrap font-alt-content text-base sm:text-lg leading-relaxed pl-3 sm:pl-4 flex">
                            <span class="mr-2">•</span>
                            <div>
                                <template v-for="(segment, segmentIndex) in block.segments" :key="segmentIndex">
                                    <span 
                                        v-if="segment.entity" 
                                        class="entity-link"
                                        @mouseenter="onMouseEnter($event.target, segment.entity)"
                                        @mouseleave="onMouseLeave"
                                        @click="onClick($event.target, segment.entity)"
                                    >
                                        {{ segment.text }}
                                    </span>
                                    <template v-else>{{ segment.text }}</template>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tooltip -->
            <EntityTooltip
                v-if="hoveredEntity && journal?.entityMap[hoveredEntity]?.type !== 'entity'"
                :name="journal?.entityMap[hoveredEntity]?.name"
                :type="journal?.entityMap[hoveredEntity]?.type"
                :tagline="journal?.entityMap[hoveredEntity]?.tagline"
                :description="journal?.entityMap[hoveredEntity]?.description"
                :char-class="journal?.entityMap[hoveredEntity]?.charClass"
                :occupation="journal?.entityMap[hoveredEntity]?.occupation"
                :species="journal?.entityMap[hoveredEntity]?.species"
                :flavor="journal?.entityMap[hoveredEntity]?.flavor"
                :trigger-ref="currentTriggerRef"
                @close="onTooltipClose"
            />

            <!-- Back button -->
            <div class="flex justify-end mt-4 sm:mt-8">
                <NuxtLink to="/journals" class="nier-button-small">
                    Back to Timeline
                </NuxtLink>
            </div>
        </div>
        <div v-else class="text-center text-nier-primary opacity-70">
            Journal not found.
        </div>
    </div>
</template>

<style scoped>
.nier-button-small {
    background-color: theme('colors.nier.secondary');
    color: theme('colors.nier.primary');
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    font-weight: 600;
    transition: all 0.2s ease;
    border: 1px solid theme('colors.nier.primary');
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

@media (min-width: 640px) {
    .nier-button-small {
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }
}

.nier-button-small:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.entity-link {
    border-bottom: 1px dotted theme('colors.nier.primary');
    cursor: help;
}
</style> 