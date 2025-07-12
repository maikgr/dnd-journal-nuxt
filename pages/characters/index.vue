<script setup lang="ts">
// Prefetch characters
definePageMeta({
    fetchKey: 'characters'
})
import type { BlockListItem } from '~/components/BlockList/types';
import type { CharacterInfo } from '~/components/CharacterContainer/types';

const { data: characters, pending, error: fetchError } = useFetch('/api/characters', {
    key: 'characters',
    lazy: true,
    server: false,
    transform: (response) => {
        if (!response) return []

        return response.map<CharacterInfo>((character: any) => ({
            id: character.id,
            name: character.properties.Name?.title?.[0]?.plain_text || 'No name',
            pronouns: character.properties.Pronouns?.rich_text?.[0]?.plain_text || 'No pronouns',
            class1: character.properties.Class1?.rich_text?.[0]?.plain_text || 'No class',
            level1: character.properties.Level1?.number || 0,
            class2: character.properties.Class2?.rich_text?.[0]?.plain_text || null,
            level2: character.properties.Level2?.number || null,
            species: character.properties.Species?.rich_text?.[0]?.plain_text || 'No species',
            hp: character.properties['Hit Points']?.number || 0,
            stats: {
                str: character.properties.STR?.number || 0,
                dex: character.properties.DEX?.number || 0,
                con: character.properties.CON?.number || 0,
                int: character.properties.INT?.number || 0,
                wis: character.properties.WIS?.number || 0,
                cha: character.properties.CHA?.number || 0,
            }
        }))
    }
})

const characterListItems = computed<BlockListItem[]>(() => characters.value?.map(character => ({
    id: character.id,
    text: character.name
})) || [])

const selectedCharacterId = ref<string | null>(null)
const selectedCharacter = computed<CharacterInfo | undefined>(() => 
    characters.value?.find(char => char.id === selectedCharacterId.value)
)
const onCharacterClick = (id: string) => {
    selectedCharacterId.value = id
}

// Select first character by default when data loads
watch(characters, (newCharacters) => {
    if (newCharacters?.length && !selectedCharacterId.value) {
        selectedCharacterId.value = newCharacters[0].id
    }
}, { immediate: true })

// Add scroll indicator logic
const showScrollIndicators = ref(true)
const scrollContainer = ref<HTMLElement | null>(null)

onMounted(() => {
    // Check if scrolling is needed
    const checkScroll = () => {
        if (!scrollContainer.value) return
        const { scrollWidth, clientWidth } = scrollContainer.value
        showScrollIndicators.value = scrollWidth > clientWidth
    }

    // Check on mount and window resize
    checkScroll()
    window.addEventListener('resize', checkScroll)
    
    onUnmounted(() => {
        window.removeEventListener('resize', checkScroll)
    })
})
</script>

<template>
    <div>
        <h1 class="text-4xl font-bold mb-8 font-nier">Characters</h1>
        
        <!-- Desktop Layout -->
        <div class="hidden md:flex gap-8">
            <!-- Character List -->
            <div class="w-1/3">
                <div class="character-list-container">
                    <BlockList
                        :pending="pending"
                        :error="fetchError?.message || null"
                        :items="characterListItems"
                        :selectedItemId="selectedCharacterId"
                        @click="onCharacterClick"
                    />
                </div>
            </div>

            <!-- Character Details -->
            <div class="w-2/3">
                <div v-if="pending" class="space-y-4">
                    <SkeletonBlock :height="'h-96'" ></SkeletonBlock>
                </div>
                <div v-else-if="fetchError" class="text-red-500">
                    Error: {{ fetchError }}
                </div>
                <CharacterContainer v-else-if="selectedCharacter"
                    :id="selectedCharacter.id"
                    :character="selectedCharacter"
                    :name="selectedCharacter.name"
                    :pronouns="selectedCharacter.pronouns"
                    :species="selectedCharacter.species"
                    :class1="selectedCharacter.class1"
                    :level1="selectedCharacter.level1"
                    :class2="selectedCharacter.class2"
                    :level2="selectedCharacter.level2"
                    :hp="selectedCharacter.hp"
                    :stats="selectedCharacter.stats"
                />
                <div v-else class="flex items-center justify-center h-full text-lg opacity-70">
                    No character selected
                </div>
            </div>
        </div>

        <!-- Mobile Layout -->
        <div class="md:hidden">
            <!-- Character Selector -->
            <div class="relative mb-6">
                <!-- Left Scroll Indicator -->
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-full pointer-events-none bg-gradient-to-r from-nier-bg-primary to-transparent z-10 flex items-center">
                    <font-awesome-icon icon="fa-solid fa-chevron-left" class="text-nier-primary opacity-50 ml-1" />
                </div>
                
                <!-- Right Scroll Indicator -->
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-full pointer-events-none bg-gradient-to-l from-nier-bg-primary to-transparent z-10 flex items-center justify-end">
                    <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-nier-primary opacity-50 mr-1" />
                </div>

                <!-- Scrollable Container -->
                <div class="overflow-x-auto scrollbar-hide" ref="scrollContainer">
                    <div class="flex gap-2 pb-2 px-8">
                        <button
                            v-for="char in characterListItems"
                            :key="char.id"
                            class="character-button flex-shrink-0 px-4 py-2 border border-nier-primary font-nier text-sm transition-colors relative"
                            :class="{
                                'bg-nier-primary text-nier-bg-primary': char.id === selectedCharacterId,
                                'bg-nier-bg-primary text-nier-primary hover:bg-nier-primary/10': char.id !== selectedCharacterId
                            }"
                            @click="onCharacterClick(char.id)"
                        >
                            {{ char.text }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Character Details -->
            <div>
                <div v-if="pending" class="space-y-4">
                    <SkeletonBlock :height="'h-96'" ></SkeletonBlock>
                </div>
                <div v-else-if="fetchError" class="text-red-500">
                    Error: {{ fetchError }}
                </div>
                <CharacterContainer v-else-if="selectedCharacter"
                    :id="selectedCharacter.id"
                    :character="selectedCharacter"
                    :name="selectedCharacter.name"
                    :pronouns="selectedCharacter.pronouns"
                    :species="selectedCharacter.species"
                    :class1="selectedCharacter.class1"
                    :level1="selectedCharacter.level1"
                    :class2="selectedCharacter.class2"
                    :level2="selectedCharacter.level2"
                    :hp="selectedCharacter.hp"
                    :stats="selectedCharacter.stats"
                />
                <div v-else class="flex items-center justify-center h-full text-lg opacity-70">
                    No character selected
                </div>
            </div>
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

/* Character Button Decorative Corners */
.character-button::before,
.character-button::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border: 1px solid currentColor;
    opacity: 0.7;
}

.character-button::before {
    top: 1px;
    right: 1px;
    border-left: none;
    border-bottom: none;
}

.character-button::after {
    bottom: 1px;
    left: 1px;
    border-right: none;
    border-top: none;
}

/* Add min-width to ensure buttons don't get too narrow */
.character-button {
    min-width: 100px;
}
</style>