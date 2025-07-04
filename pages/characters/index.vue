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
const debugPending = ref(true)
</script>

<template>
    <div>
        <h1 class="text-4xl font-bold mb-8 font-nier">Characters</h1>
        <div class="flex gap-8">
            <!-- Character List -->
            <div class="w-1/3">
                <div class="character-list-container">
                    <BlockList
                        :pending="pending || debugPending"
                        :error="fetchError?.message || null"
                        :items="characterListItems"
                        :selectedItemId="selectedCharacterId"
                        @click="onCharacterClick"
                    />
                </div>
            </div>

            <!-- Character Details -->
            <div class="w-2/3">
                <div v-if="pending || debugPending" class="space-y-4">
                    <SkeletonBlock v-for="i in 3" :key="i" ></SkeletonBlock>
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